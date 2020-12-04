<?php

namespace Biigle\Modules\Largo\Jobs;

use Biigle\Contracts\Annotation;
use Biigle\Jobs\Job;
use Biigle\Shape;
use Biigle\VolumeFile;
use Exception;
use FileCache;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Jcupitt\Vips\Image;
use Str;

abstract class GenerateAnnotationPatch extends Job implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The the annotation to generate a patch for.
     *
     * @var Annotation
     */
    protected $annotation;

    /**
     * The storage disk to store the annotation patches to.
     *
     * @var string
     */
    protected $targetDisk;

    /**
     * Ignore this job if the annotation does not exist any more.
     *
     * @var bool
     */
    protected $deleteWhenMissingModels = true;

    /**
     * Create a new job instance.
     *
     * @param Annotation $annotation The the annotation to generate a patch for.
     * @param string|null $targetDisk The storage disk to store the annotation patches to.
     *
     * @return void
     */
    public function __construct(Annotation $annotation, $targetDisk = null)
    {
        $this->annotation = $annotation;
        $this->targetDisk = $targetDisk !== null
            ? $targetDisk
            : config('largo.patch_storage_disk');
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            FileCache::get($this->annotation->getFile(), [$this, 'handleFile']);
        } catch (Exception $e) {
            if ($this->shouldRetryAfterException($e)) {
                // Exponential backoff for retry after 10 and then 20 minutes.
                $this->release($this->attempts() * 600);
            } else {
                $class = get_class($this->annotation);

                throw new Exception("Could not generate annotation patch for {$class} {$this->annotationId}: {$e->getMessage()}");
            }
        }
    }

    /**
     * Handle a single file.
     *
     * @param VolumeFile $file
     * @param string $path Path to the cached file.
     */
    abstract public function handleFile(VolumeFile $file, $path);

    /**
     * Determine if this job should retry instead of fail after an exception
     *
     * @param Exception $e
     *
     * @return bool
     */
    protected function shouldRetryAfterException(Exception $e)
    {
        $message = $e->getMessage();
        return $this->attempts() < 3 && (
            // The remote source might be available again after a while.
            Str::contains($message, 'The source resource could not be established') ||
            // This error presumably occurs due to worker concurrency.
            Str::contains($message, 'Impossible to create the root directory')
        );
    }

    /**
     * Calculate the bounding rectangle of the patch to extract.
     *
     * @param array $points
     * @param Shape $Shape
     * @param int $thumbWidth
     * @param int $thumbHeight
     *
     * @return array Containing width, height, top and left
     */
    protected function getPatchRect(array $points, Shape $shape, $thumbWidth, $thumbHeight)
    {
        $padding = config('largo.patch_padding');

        switch ($shape->id) {
            case Shape::pointId():
                $pointPadding = config('largo.point_padding');
                $left = $points[0] - $pointPadding;
                $right = $points[0] + $pointPadding;
                $top = $points[1] - $pointPadding;
                $bottom = $points[1] + $pointPadding;
                break;

            case Shape::circleId():
                $left = $points[0] - $points[2];
                $right = $points[0] + $points[2];
                $top = $points[1] - $points[2];
                $bottom = $points[1] + $points[2];
                break;

            default:
                $left = INF;
                $right = -INF;
                $top = INF;
                $bottom = -INF;
                foreach ($points as $index => $value) {
                    if ($index % 2 === 0) {
                        $left = min($left, $value);
                        $right = max($right, $value);
                    } else {
                        $top = min($top, $value);
                        $bottom = max($bottom, $value);
                    }
                }
        }

        $left -= $padding;
        $right += $padding;
        $top -= $padding;
        $bottom += $padding;

        $width = $right - $left;
        $height = $bottom - $top;

        // Ensure the minimum width so the annotation patch is not "zoomed in".
        if ($width < $thumbWidth) {
            $delta = ($thumbWidth - $width) / 2.0;
            $left -= $delta;
            $right += $delta;
            $width = $thumbWidth;
        }

        // Ensure the minimum height so the annotation patch is not "zoomed in".
        if ($height < $thumbHeight) {
            $delta = ($thumbHeight - $height) / 2.0;
            $top -= $delta;
            $bottom += $delta;
            $height = $thumbHeight;
        }

        $widthRatio = $width / $thumbWidth;
        $heightRatio = $height / $thumbHeight;

        // increase the size of the patch so its aspect ratio is the same than the
        // ratio of the thumbnail dimensions
        if ($widthRatio > $heightRatio) {
            $newHeight = round($thumbHeight * $widthRatio);
            $top -= round(($newHeight - $height) / 2);
            $height = $newHeight;
        } else {
            $newWidth = round($thumbWidth * $heightRatio);
            $left -= round(($newWidth - $width) / 2);
            $width = $newWidth;
        }

        return [
            'width' => intval(round($width)),
            'height' => intval(round($height)),
            'left' => intval(round($left)),
            'top' => intval(round($top)),
        ];
    }

    /**
     * Adjust the position and size of the patch rectangle so it is contained in the
     * image.
     *
     * @param array $rect
     * @param Image $image
     *
     * @return array
     */
    protected function makeRectContained($rect, $image)
    {
        // Order of min max is importans so the point gets no negative coordinates.
        $rect['left'] = min($image->width - $rect['width'], $rect['left']);
        $rect['left'] = max(0, $rect['left']);
        $rect['top'] = min($image->height - $rect['height'], $rect['top']);
        $rect['top'] = max(0, $rect['top']);

        // Adjust dimensions of rect if it is larger than the image.
        $rect['width'] = min($image->width, $rect['width']);
        $rect['height'] = min($image->height, $rect['height']);

        return $rect;
    }

    /**
     * Get the annotation patch as buffer.
     *
     * @param Image $image
     * @param array $points
     * @param Shape $shape
     *
     * @return string
     */
    protected function getAnnotationPatch($image, $points, $shape)
    {
        $thumbWidth = config('thumbnails.width');
        $thumbHeight = config('thumbnails.height');

        if ($shape->id === Shape::wholeFrameId()) {
            $image = $image->resize(floatval($thumbWidth) / $image->width);
        } else {
            $rect = $this->getPatchRect($points, $shape, $thumbWidth, $thumbHeight);
            $rect = $this->makeRectContained($rect, $image);

            $image = $image->crop(
                    $rect['left'],
                    $rect['top'],
                    $rect['width'],
                    $rect['height']
                )
                ->resize(floatval($thumbWidth) / $rect['width']);
        }

        return $image->writeToBuffer('.'.config('largo.patch_format'), [
            'Q' => 85,
            'strip' => true,
        ]);
    }
}
