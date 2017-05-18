biigle.$viewModel("largo-container",function(e){var i=biigle.$require("largo.api.volumes"),n=biigle.$require("largo.volumeId");new Vue({el:e,mixins:[biigle.$require("largo.mixins.largoContainer")],data:{labelTrees:biigle.$require("largo.labelTrees")},methods:{queryAnnotations:function(e){return i.queryAnnotations({id:n,label_id:e.id})},performSave:function(e,t){return i.save({id:n},{dismissed:e,changed:t})}}})}),biigle.$viewModel("largo-title",function(e){var i=biigle.$require("biigle.events");new Vue({el:e,data:{step:0,count:0,dismissedCount:0},computed:{shownCount:function(){return this.isInDismissStep?this.count:this.dismissedCount},isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step}},methods:{updateStep:function(e){this.step=e},updateCount:function(e){this.count=e},updateDismissedCount:function(e){this.dismissedCount=e}},created:function(){i.$on("annotations-count",this.updateCount),i.$on("dismissed-annotations-count",this.updateDismissedCount),i.$on("step",this.updateStep)}})}),biigle.$viewModel("project-largo-container",function(e){var i=biigle.$require("largo.api.projects"),n=biigle.$require("largo.projectId");new Vue({el:e,mixins:[biigle.$require("largo.mixins.largoContainer")],data:{labelTrees:biigle.$require("largo.labelTrees")},methods:{queryAnnotations:function(e){return i.queryAnnotations({id:n,label_id:e.id})},performSave:function(e,t){return i.save({id:n},{dismissed:e,changed:t})}}})}),biigle.$declare("largo.api.annotations",Vue.resource("api/v1/annotations{/id}/patch")),biigle.$declare("largo.api.projects",Vue.resource("api/v1/projects{/id}/largo",{},{queryAnnotations:{method:"GET",url:"api/v1/projects{/id}/annotations/filter/label{/label_id}"}})),biigle.$declare("largo.api.volumes",Vue.resource("api/v1/volumes{/id}/largo",{},{queryAnnotations:{method:"GET",url:"api/v1/volumes{/id}/annotations/filter/label{/label_id}"}})),biigle.$component("largo.components.dismissImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.dismissImageGridImage")}}),biigle.$component("largo.components.dismissImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--dismiss" :class="classObject" :title="title"><img @click="toggleSelect" :src="url || emptyUrl"><div v-if="showAnnotationLink" class="image-buttons"><a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.dismissed},title:function(){return this.selected?"Undo dismissing this annotation":"Dismiss this annotation"}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$component("largo.components.relabelImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.relabelImageGridImage")}}),biigle.$component("largo.components.relabelImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--relabel" :class="classObject" :title="title"><img @click="toggleSelect" :src="url || emptyUrl"><div v-if="showAnnotationLink" class="image-buttons"><a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></div><div v-if="selected" class="new-label"><span class="new-label__color" :style="newLabelStyle"></span> <span class="new-label__name" v-text="image.newLabel.name"></span></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.newLabel},title:function(){return this.selected?"Revert changing the label of this annotation":"Change the label of this annotation"},newLabelStyle:function(){return{"background-color":"#"+this.image.newLabel.color}}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$declare("largo.mixins.largoContainer",{mixins:[biigle.$require("core.mixins.loader")],components:{labelTrees:biigle.$require("labelTrees.components.labelTrees"),sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),dismissImageGrid:biigle.$require("largo.components.dismissImageGrid"),relabelImageGrid:biigle.$require("largo.components.relabelImageGrid")},data:{labelTrees:[],step:0,selectedLabel:null,annotationsCache:{}},computed:{isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step},annotations:function(){return this.selectedLabel&&this.annotationsCache.hasOwnProperty(this.selectedLabel.id)?this.annotationsCache[this.selectedLabel.id]:[]},allAnnotations:function(){var e=[];for(var i in this.annotationsCache)this.annotationsCache.hasOwnProperty(i)&&Array.prototype.push.apply(e,this.annotationsCache[i]);return e},hasNoAnnotations:function(){return this.selectedLabel&&!this.loading&&0===this.annotations.length},dismissedAnnotations:function(){return this.allAnnotations.filter(function(e){return e.dismissed})},hasDismissedAnnotations:function(){return this.dismissedAnnotations.length>0},dismissedToSave:function(){for(var e=this.dismissedAnnotations,i={},n=e.length-1;n>=0;n--)i.hasOwnProperty(e[n].label_id)?i[e[n].label_id].push(e[n].id):i[e[n].label_id]=[e[n].id];return i},changedToSave:function(){for(var e=this.dismissedAnnotations.filter(function(e){return!!e.newLabel}),i={},n=e.length-1;n>=0;n--)i[e[n].id]=e[n].newLabel.id;return i},events:function(){return biigle.$require("biigle.events")}},methods:{getAnnotations:function(e){if(!this.annotationsCache.hasOwnProperty(e.id)){var i=this;Vue.set(i.annotationsCache,e.id,[]),this.startLoading(),this.queryAnnotations(e).then(function(n){i.gotAnnotations(e,n.data)},biigle.$require("messages.store").handleErrorResponse).finally(this.finishLoading)}},gotAnnotations:function(e,i){i=i.map(function(i){return{id:i,label_id:e.id,blob:null,dismissed:!1,newLabel:null}}),Vue.set(this.annotationsCache,e.id,i)},handleSelectedLabel:function(e){this.selectedLabel=e,this.isInDismissStep&&this.getAnnotations(e)},handleDeselectedLabel:function(){this.selectedLabel=null},handleDismissedImage:function(e){e.dismissed=!0},handleUndismissedImage:function(e){e.dismissed=!1,e.newLabel=null},goToRelabel:function(){this.step=1},goToDismiss:function(){this.step=0,this.selectedLabel&&this.getAnnotations(this.selectedLabel)},handleRelabelledImage:function(e){this.selectedLabel&&(e.newLabel=this.selectedLabel)},handleUnrelabelledImage:function(e){this.selectedLabel&&e.newLabel.id!==this.selectedLabel.id?e.newLabel=this.selectedLabel:e.newLabel=null},save:function(){this.loading||(this.loading=!0,this.performSave(this.dismissedToSave,this.changedToSave).then(this.saved,biigle.$require("messages.store").handleErrorResponse).finally(this.finishLoading))},saved:function(){biigle.$require("messages.store").success("Saved.  You can now start a new re-evaluation session."),this.step=0;for(var e in this.annotationsCache)this.annotationsCache.hasOwnProperty(e)&&delete this.annotationsCache[e];this.handleSelectedLabel(this.selectedLabel)}},watch:{annotations:function(e){this.events.$emit("annotations-count",e.length)},dismissedAnnotations:function(e){this.events.$emit("dismissed-annotations-count",e.length)},step:function(e){this.events.$emit("step",e)}}});