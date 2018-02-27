biigle.$viewModel("annotation-catalog-container",function(e){var i=biigle.$require("largo.api.labels"),t=biigle.$require("annotationCatalog.labelTree");new Vue({el:e,mixins:[biigle.$require("largo.mixins.largoContainer")],components:{catalogImageGrid:biigle.$require("largo.components.catalogImageGrid")},data:{labelTrees:[t]},methods:{queryAnnotations:function(e){return i.queryAnnotations({id:e.id})}}})}),biigle.$viewModel("largo-example-annotations",function(e){var i=biigle.$require("events"),t=biigle.$require("messages.store"),n=biigle.$require("largo.api.labels");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],components:{annotationPatch:biigle.$require("largo.components.annotationPatch")},data:{selectedLabel:null,cache:{null:Vue.Promise.resolve([])},exampleAnnotations:[]},computed:{hasSelectedLabel:function(){return null!==this.selectedLabel},hasExampleAnnotations:function(){return this.exampleAnnotations.length>0},selectedLabelName:function(){return this.hasSelectedLabel?this.selectedLabel.name:""}},methods:{parseResponse:function(e){return e.data},setSelectedLabel:function(e){this.selectedLabel=e;var i=e?e.id:null;this.cache.hasOwnProperty(i)||(this.startLoading(),this.cache[i]=n.queryAnnotations({id:i,take:4}).then(this.parseResponse).catch(t.handleErrorResponse).finally(this.finishLoading)),this.cache[i].then(this.setExampleAnnotations)},setExampleAnnotations:function(e){this.exampleAnnotations=e}},created:function(){i.$on("selectLabel",this.setSelectedLabel)}})}),biigle.$viewModel("largo-container",function(e){var i=biigle.$require("largo.api.volumes"),t=biigle.$require("largo.volumeId");new Vue({el:e,mixins:[biigle.$require("largo.mixins.largoContainer")],data:{labelTrees:biigle.$require("largo.labelTrees")},methods:{queryAnnotations:function(e){return i.queryAnnotations({id:t,label_id:e.id})},performSave:function(e,n){return i.save({id:t},{dismissed:e,changed:n})}}})}),biigle.$viewModel("largo-title",function(e){var i=biigle.$require("events");new Vue({el:e,data:{step:0,count:0,dismissedCount:0},computed:{shownCount:function(){return this.isInDismissStep?this.count:this.dismissedCount},isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step}},methods:{updateStep:function(e){this.step=e},updateCount:function(e){this.count=e},updateDismissedCount:function(e){this.dismissedCount=e}},created:function(){i.$on("annotations-count",this.updateCount),i.$on("dismissed-annotations-count",this.updateDismissedCount),i.$on("step",this.updateStep)}})}),biigle.$viewModel("project-largo-container",function(e){var i=biigle.$require("largo.api.projects"),t=biigle.$require("largo.projectId");new Vue({el:e,mixins:[biigle.$require("largo.mixins.largoContainer")],data:{labelTrees:biigle.$require("largo.labelTrees")},methods:{queryAnnotations:function(e){return i.queryAnnotations({id:t,label_id:e.id})},performSave:function(e,n){return i.save({id:t},{dismissed:e,changed:n})}}})}),biigle.$declare("largo.api.annotations",Vue.resource("api/v1/annotations{/id}/patch")),biigle.$declare("largo.api.labels",Vue.resource("api/v1/labels{/id}/annotations",{},{queryAnnotations:{method:"GET"}})),biigle.$declare("largo.api.projects",Vue.resource("api/v1/projects{/id}/largo",{},{queryAnnotations:{method:"GET",url:"api/v1/projects{/id}/annotations/filter/label{/label_id}"}})),biigle.$declare("largo.api.volumes",Vue.resource("api/v1/volumes{/id}/largo",{},{queryAnnotations:{method:"GET",url:"api/v1/volumes{/id}/annotations/filter/label{/label_id}"},queryExampleAnnotations:{method:"GET",url:"api/v1/volumes{/id}/annotations/examples{/label_id}"}})),biigle.$component("largo.components.annotationPatch",{props:{id:{type:Number,required:!0},label:{type:Object,required:!0},emptySrc:{type:String,required:!0}},data:function(){return{blobUrl:""}},computed:{title:function(){return"Example annotation for label "+this.label.name},src:function(){return this.blobUrl||this.emptySrc}},methods:{setBlobUrl:function(e){var i=window.URL||window.webkitURL;this.blobUrl=i.createObjectURL(e.body)}},created:function(){biigle.$require("largo.api.annotations").get({id:this.id}).then(this.setBlobUrl)},destroyed:function(){if(this.blobUrl){(window.URL||window.webkitURL).revokeObjectURL(this.blobUrl)}}}),biigle.$component("largo.components.catalogImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.catalogImageGridImage")}}),biigle.$component("largo.components.catalogImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--catalog" :class="classObject"><a v-if="showAnnotationLink" :href="showAnnotationLink" target="_blank" title="Show the annotation in the annotation tool"><img :src="url || emptyUrl"></a><img v-else :src="url || emptyUrl"></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("annotationCatalog.showAnnotationRoute");return e?e+this.image.id:""}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$component("largo.components.dismissImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.dismissImageGridImage")}}),biigle.$component("largo.components.dismissImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--dismiss" :class="classObject" :title="title"><img @click="toggleSelect" :src="url || emptyUrl"><div v-if="showAnnotationLink" class="image-buttons"><a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.dismissed},title:function(){return this.selected?"Undo dismissing this annotation":"Dismiss this annotation"}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$require("annotations.components.labelsTabPlugins").exampleAnnotations={mixins:[biigle.$require("core.mixins.loader")],components:{annotationPatch:biigle.$require("largo.components.annotationPatch")},props:{label:{default:null},volumeId:{type:Number,required:!0},count:{type:Number,default:3}},data:function(){return{exampleLabel:null,exampleAnnotations:[],cache:{},shown:!0}},computed:{isShown:function(){return this.shown&&null!==this.label},hasExamples:function(){return this.exampleLabel&&this.exampleAnnotations&&this.exampleAnnotations.length>0},volumesApi:function(){return biigle.$require("largo.api.volumes")}},methods:{parseResponse:function(e){return e.data},setExampleAnnotations:function(e){(!e[0].hasOwnProperty("annotations")||e[0].annotations.length<this.count)&&delete this.cache[e[1]],e[0].hasOwnProperty("label")&&e[0].label.id===e[1]||delete this.cache[e[1]],this.label&&this.label.id===e[1]&&(this.exampleAnnotations=e[0].annotations,this.exampleLabel=e[0].label)},updateShown:function(e){this.shown=e},updateExampleAnnotations:function(){this.exampleAnnotations=[],this.isShown&&(this.startLoading(),this.cache.hasOwnProperty(this.label.id)||(this.cache[this.label.id]=this.volumesApi.queryExampleAnnotations({id:this.volumeId,label_id:this.label.id,take:this.count}).then(this.parseResponse)),Vue.Promise.all([this.cache[this.label.id],this.label.id]).then(this.setExampleAnnotations).finally(this.finishLoading))}},watch:{label:function(){this.updateExampleAnnotations()},shown:function(){this.updateExampleAnnotations()}},created:function(){biigle.$require("events").$on("settings.exampleAnnotations",this.updateShown)}},biigle.$component("largo.components.relabelImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.relabelImageGridImage")}}),biigle.$component("largo.components.relabelImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--relabel" :class="classObject" :title="title"><img @click="toggleSelect" :src="url || emptyUrl"><div v-if="showAnnotationLink" class="image-buttons"><a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></div><div v-if="selected" class="new-label"><span class="new-label__color" :style="newLabelStyle"></span> <span class="new-label__name" v-text="image.newLabel.name"></span></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.newLabel},title:function(){return this.selected?"Revert changing the label of this annotation":"Change the label of this annotation"},newLabelStyle:function(){return{"background-color":"#"+this.image.newLabel.color}}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$require("annotations.components.settingsTabPlugins").exampleAnnotations={components:{powerButton:biigle.$require("annotations.components.powerButton")},props:{settings:{type:Object,required:!0}},data:function(){return{isShown:!0}},methods:{hide:function(){this.isShown=!1,this.settings.set("exampleAnnotations",!1)},show:function(){this.isShown=!0,this.settings.delete("exampleAnnotations")}},watch:{isShown:function(e){biigle.$require("events").$emit("settings.exampleAnnotations",e)}},created:function(){this.settings.has("exampleAnnotations")&&(this.isShown=this.settings.get("exampleAnnotations"))}},biigle.$declare("largo.mixins.largoContainer",{mixins:[biigle.$require("core.mixins.loader")],components:{labelTrees:biigle.$require("labelTrees.components.labelTrees"),sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),dismissImageGrid:biigle.$require("largo.components.dismissImageGrid"),relabelImageGrid:biigle.$require("largo.components.relabelImageGrid")},data:{labelTrees:[],step:0,selectedLabel:null,annotationsCache:{}},computed:{isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step},annotations:function(){return this.selectedLabel&&this.annotationsCache.hasOwnProperty(this.selectedLabel.id)?this.annotationsCache[this.selectedLabel.id]:[]},allAnnotations:function(){var e=[];for(var i in this.annotationsCache)this.annotationsCache.hasOwnProperty(i)&&Array.prototype.push.apply(e,this.annotationsCache[i]);return e},hasNoAnnotations:function(){return this.selectedLabel&&!this.loading&&0===this.annotations.length},dismissedAnnotations:function(){return this.allAnnotations.filter(function(e){return e.dismissed})},annotationsWithNewLabel:function(){return this.dismissedAnnotations.filter(function(e){return!!e.newLabel})},hasDismissedAnnotations:function(){return this.dismissedAnnotations.length>0},dismissedToSave:function(){for(var e=this.dismissedAnnotations,i={},t=e.length-1;t>=0;t--)i.hasOwnProperty(e[t].label_id)?i[e[t].label_id].push(e[t].id):i[e[t].label_id]=[e[t].id];return i},changedToSave:function(){for(var e=this.annotationsWithNewLabel,i={},t=e.length-1;t>=0;t--)i[e[t].id]=e[t].newLabel.id;return i},toDeleteCount:function(){return this.dismissedAnnotations.length-this.annotationsWithNewLabel.length},events:function(){return biigle.$require("events")}},methods:{getAnnotations:function(e){if(!this.annotationsCache.hasOwnProperty(e.id)){var i=this;Vue.set(i.annotationsCache,e.id,[]),this.startLoading(),this.queryAnnotations(e).then(function(t){i.gotAnnotations(e,t.data)},biigle.$require("messages.store").handleErrorResponse).finally(this.finishLoading)}},gotAnnotations:function(e,i){i=i.map(function(i){return{id:i,label_id:e.id,blob:null,dismissed:!1,newLabel:null}}),Vue.set(this.annotationsCache,e.id,i)},handleSelectedLabel:function(e){this.selectedLabel=e,this.isInDismissStep&&this.getAnnotations(e)},handleDeselectedLabel:function(){this.selectedLabel=null},handleDismissedImage:function(e){e.dismissed=!0},handleUndismissedImage:function(e){e.dismissed=!1,e.newLabel=null},goToRelabel:function(){this.step=1},goToDismiss:function(){this.step=0,this.selectedLabel&&this.getAnnotations(this.selectedLabel)},handleRelabelledImage:function(e){this.selectedLabel&&(e.newLabel=this.selectedLabel)},handleUnrelabelledImage:function(e){this.selectedLabel&&e.newLabel.id!==this.selectedLabel.id?e.newLabel=this.selectedLabel:e.newLabel=null},save:function(){this.loading||this.toDeleteCount>0&&!confirm("This will attempt to delete "+this.toDeleteCount+" annotations. Continue?")||this.performSave(this.dismissedToSave,this.changedToSave).then(this.saved,biigle.$require("messages.store").handleErrorResponse).finally(this.finishLoading)},saved:function(){biigle.$require("messages.store").success("Saved. You can now start a new re-evaluation session."),this.step=0;for(var e in this.annotationsCache)this.annotationsCache.hasOwnProperty(e)&&delete this.annotationsCache[e];this.handleSelectedLabel(this.selectedLabel)}},watch:{annotations:function(e){this.events.$emit("annotations-count",e.length)},dismissedAnnotations:function(e){this.events.$emit("dismissed-annotations-count",e.length)},step:function(e){this.events.$emit("step",e)}}});