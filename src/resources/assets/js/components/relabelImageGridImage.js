import {ImageGridImage} from '../import';
import AnnotationPatch from '../mixins/annotationPatch';

/**
 * A variant of the image grid image used for the relabel step of Largo
 *
 * @type {Object}
 */
export default {
    mixins: [
        ImageGridImage,
        AnnotationPatch,
    ],
    template: `<figure class="image-grid__image image-grid__image--relabel" :class="classObject" :title="title">
        <div v-if="selectable" class="image-icon">
            <i class="fas" :class="iconClass"></i>
        </div>
        <img @click="toggleSelect" :src="url || emptyUrl" @error="showEmptyImage">
        <div v-if="showAnnotationLink" class="image-buttons">
            <a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool">
                <span class="fa fa-external-link-square-alt" aria-hidden="true"></span>
            </a>
        </div>
        <div v-if="selected" class="new-label">
            <span class="new-label__color" :style="newLabelStyle"></span>
            <span class="new-label__name" v-text="image.newLabel.name"></span>
        </div>
    </figure>`,
    data() {
        return {
            showAnnotationRoute: null,
        };
    },
    computed: {
        showAnnotationLink() {
            return this.showAnnotationRoute ? (this.showAnnotationRoute + this.image.id) : '';
        },
        selected() {
            return this.image.newLabel;
        },
        title() {
            return this.selected ? 'Revert changing the label of this annotation' : 'Change the label of this annotation';
        },
        newLabelStyle() {
            return {
                'background-color': '#' + this.image.newLabel.color,
            };
        },
        id() {
            return this.image.id;
        },
        uuid() {
            return this.image.uuid;
        },
        urlTemplate() {
            // Usually this would be set in the created function but in this special
            // case this is not possible.
            return biigle.$require('largo.patchUrlTemplate');
        },
    },
    created() {
        this.showAnnotationRoute = biigle.$require('largo.showAnnotationRoute');
    },
};
