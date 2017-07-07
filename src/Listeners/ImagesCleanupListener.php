<?php

namespace Biigle\Modules\Largo\Listeners;

use Biigle\Image;
use Biigle\Annotation;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Biigle\Modules\Largo\Jobs\RemoveAnnotationPatches;

class ImagesCleanupListener
{
    use DispatchesJobs;

    /**
     * Handle the event.
     *
     * Assembles the volume ID and annotation IDs for the RemoveAnnotationPatches job.
     * The job will be queued and when it is run, the volume, images and annotations
     * may no longer exist in the DB.
     *
     * @param  array  $uuids  The volume image uuids
     * @return void
     */
    public function handle(array $uuids)
    {
        if (empty($uuids)) {
            return;
        }

        $images = Image::whereIn('uuid', $uuids)->select('id', 'volume_id')->get();

        if ($images->isEmpty()) {
            return;
        }

        $annotationIds = Annotation::whereIn('image_id', $images->pluck('id'))
            ->pluck('id')
            ->toArray();

        $this->dispatch(new RemoveAnnotationPatches(
            $images->first()->volume_id,
            $annotationIds
        ));
    }
}
