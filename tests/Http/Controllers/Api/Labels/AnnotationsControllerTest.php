<?php

namespace Biigle\Tests\Modules\Largo\Http\Controllers\Api\Labels;

use ApiTestCase;
use Carbon\Carbon;
use Biigle\Tests\ImageTest;
use Biigle\Tests\LabelTest;
use Biigle\Tests\AnnotationTest;
use Biigle\Tests\AnnotationLabelTest;
use Biigle\Tests\AnnotationSessionTest;

class AnnotationsControllerTest extends ApiTestCase
{
    public function testIndex()
    {
        $image = ImageTest::create(['volume_id' => $this->volume()->id]);
        $label = LabelTest::create();
        $a1 = AnnotationTest::create(['image_id' => $image->id]);
        AnnotationLabelTest::create(['label_id' => $label->id, 'annotation_id' => $a1->id]);
        $a2 = AnnotationTest::create(['image_id' => $image->id]);
        AnnotationLabelTest::create(['label_id' => $label->id, 'annotation_id' => $a2->id]);
        $a3 = AnnotationTest::create(['image_id' => $image->id]);
        AnnotationLabelTest::create(['annotation_id' => $a3->id]);

        $this->doTestApiRoute('GET', "/api/v1/labels/{$label->id}/annotations");

        $this->beUser();
        $this->get("/api/v1/labels/{$label->id}/annotations")
            ->seeJsonEquals([]);
        $this->assertResponseOk();

        $this->beGuest();
        $this->get("/api/v1/labels/{$label->id}/annotations")
            ->seeJsonEquals([$a1->id, $a2->id]);
        $this->assertResponseOk();

        $this->get("/api/v1/labels/{$label->id}/annotations?take=1")
            ->seeJsonEquals([$a1->id]);
        $this->assertResponseOk();
    }
}
