<?php

namespace Biigle\Tests\Modules\Largo\Jobs;

use Biigle\Modules\Largo\Jobs\CopyImageAnnotationFeatureVector;
use Biigle\Modules\Largo\ImageAnnotationLabelFeatureVector;
use Biigle\ImageAnnotationLabel;
use TestCase;

class CopyImageAnnotationFeatureVectorTest extends TestCase
{
    public function testHandle()
    {
        $vector = ImageAnnotationLabelFeatureVector::factory()->create();
        $annotationLabel = ImageAnnotationLabel::factory()->create([
            'annotation_id' => $vector->annotation_id,
        ]);

        (new CopyImageAnnotationFeatureVector($annotationLabel))->handle();

        $vectors = ImageAnnotationLabelFeatureVector::where('annotation_id', $vector->annotation_id)
            ->orderBy('id', 'asc')->get();
        $this->assertCount(2, $vectors);
        $this->assertEquals($annotationLabel->id, $vectors[1]->id);
        $this->assertEquals($annotationLabel->annotation_id, $vectors[1]->annotation_id);
        $this->assertEquals($annotationLabel->label_id, $vectors[1]->label_id);
        $this->assertEquals($annotationLabel->label->label_tree_id, $vectors[1]->label_tree_id);
        $this->assertEquals($vector->volume_id, $vectors[1]->volume_id);
        $this->assertEquals($vector->vector, $vectors[1]->vector);
    }
}
