!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=0)}({0:function(t,e,n){n("WfG0"),t.exports=n("zcrr")},WfG0:function(t,e,n){"use strict";n.r(e);function i(t,e,n,i,o,s,a,l){var r,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),i&&(u.functional=!0),s&&(u._scopeId="data-v-"+s),a?(r=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=r):o&&(r=l?function(){o.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:o),r)if(u.functional){u._injectStyles=r;var d=u.render;u.render=function(t,e){return r.call(e),d(t,e)}}else{var h=u.beforeCreate;u.beforeCreate=h?[].concat(h,r):[r]}return{exports:t,options:u}}var o=i({computed:{id:function(){return this.image.id},uuid:function(){return this.image.uuid},type:function(){return this.image.type},patchPrefix:function(){return this.uuid[0]+this.uuid[1]+"/"+this.uuid[2]+this.uuid[3]+"/"+this.uuid},urlTemplate:function(){return biigle.$require("largo.patchUrlTemplate")}},methods:{getThumbnailUrl:function(){return"videoAnnotation"===this.type?this.urlTemplate.replace(":prefix",this.patchPrefix).replace(":id","v-".concat(this.id)):this.urlTemplate.replace(":prefix",this.patchPrefix).replace(":id",this.id)}},created:function(){"imageAnnotation"===this.type?this.showAnnotationRoute=biigle.$require("largo.showImageAnnotationRoute"):this.showAnnotationRoute=biigle.$require("largo.showVideoAnnotationRoute")}},void 0,void 0,!1,null,null,null).exports,s=i({mixins:[o],props:{id:{type:String,required:!0},uuid:{type:String,required:!0},label:{type:Object,required:!0},emptySrc:{type:String,required:!0},urlTemplate:{type:String,required:!0}},data:function(){return{url:""}},computed:{title:function(){return"Example annotation for label "+this.label.name},src:function(){return this.url||this.emptySrc}},methods:{showEmptyImage:function(){this.url=""}},created:function(){this.url=this.getThumbnailUrl()}},void 0,void 0,!1,null,null,null).exports,a=Vue.resource("api/v1/volumes{/id}/largo",{},{queryImageAnnotations:{method:"GET",url:"api/v1/volumes{/id}/image-annotations/filter/label{/label_id}"},queryVideoAnnotations:{method:"GET",url:"api/v1/volumes{/id}/video-annotations/filter/label{/label_id}"},queryExampleAnnotations:{method:"GET",url:"api/v1/volumes{/id}/image-annotations/examples{/label_id}"}}),l=biigle.$require("events"),r=biigle.$require("messages").handleErrorResponse,u=biigle.$require("volumes.components.imageGrid"),d=biigle.$require("volumes.components.imageGridImage"),h=biigle.$require("annotations.components.labelsTabPlugins"),c=biigle.$require("labelTrees.components.labelTrees"),m=biigle.$require("core.mixins.loader"),p=biigle.$require("messages"),g=biigle.$require("core.components.powerToggle"),f=biigle.$require("annotations.components.settingsTabPlugins"),b=biigle.$require("core.components.sidebar"),v=biigle.$require("core.components.sidebarTab"),A=i({mixins:[m],components:{annotationPatch:s},props:{label:{default:null},volumeId:{type:Number,required:!0},count:{type:Number,default:3}},data:function(){return{exampleLabel:null,exampleAnnotations:[],cache:{},shown:!0}},computed:{isShown:function(){return this.shown&&null!==this.label},hasExamples:function(){return this.exampleLabel&&this.exampleAnnotations&&Object.keys(this.exampleAnnotations).length>0}},methods:{parseResponse:function(t){return t.data},setExampleAnnotations:function(t){(!t[0].hasOwnProperty("annotations")||Object.keys(t[0].annotations).length<this.count)&&delete this.cache[t[1]],t[0].hasOwnProperty("label")&&t[0].label.id===t[1]||delete this.cache[t[1]],this.label&&this.label.id===t[1]&&(this.exampleAnnotations=t[0].annotations,this.exampleLabel=t[0].label)},updateShown:function(t){this.shown=t},updateExampleAnnotations:function(){this.exampleAnnotations=[],this.isShown&&(this.startLoading(),this.cache.hasOwnProperty(this.label.id)||(this.cache[this.label.id]=a.queryExampleAnnotations({id:this.volumeId,label_id:this.label.id,take:this.count}).then(this.parseResponse)),Vue.Promise.all([this.cache[this.label.id],this.label.id]).then(this.setExampleAnnotations).finally(this.finishLoading))}},watch:{label:function(){this.updateExampleAnnotations()},shown:function(){this.updateExampleAnnotations()}},created:function(){l.$on("settings.exampleAnnotations",this.updateShown)}},void 0,void 0,!1,null,null,null).exports;h&&(h.exampleAnnotations=A);var w=i({components:{powerButton:g},props:{settings:{type:Object,required:!0}},data:function(){return{isShown:!0}},methods:{hide:function(){this.isShown=!1,this.settings.set("exampleAnnotations",!1)},show:function(){this.isShown=!0,this.settings.delete("exampleAnnotations")}},watch:{isShown:function(t){l.$emit("settings.exampleAnnotations",t)}},created:function(){this.settings.has("exampleAnnotations")&&(this.isShown=this.settings.get("exampleAnnotations"))}},void 0,void 0,!1,null,null,null).exports;f&&(f.exampleAnnotations=w),biigle.$declare("largo.mixins.annotationPatch",o);var y=i({mixins:[d,o],data:function(){return{showAnnotationRoute:null}},computed:{showAnnotationLink:function(){return this.showAnnotationRoute?this.showAnnotationRoute+this.image.id:""}},created:function(){"imageAnnotation"===this.type?this.showAnnotationRoute=biigle.$require("annotationCatalog.showImageAnnotationRoute"):this.showAnnotationRoute=biigle.$require("annotationCatalog.showVideoAnnotationRoute")}},(function(){var t=this.$createElement,e=this._self._c||t;return e("figure",{staticClass:"image-grid__image image-grid__image--catalog",class:this.classObject},[this.showAnnotationLink?e("a",{attrs:{href:this.showAnnotationLink,target:"_blank",title:"Show the annotation in the annotation tool"}},[e("img",{attrs:{src:this.srcUrl},on:{error:this.showEmptyImage}})]):e("img",{attrs:{src:this.srcUrl},on:{error:this.showEmptyImage}})])}),[],!1,null,null,null),_=i({mixins:[u],components:{imageGridImage:y.exports}},void 0,void 0,!1,null,null,null).exports,x=Vue.resource("api/v1/labels{/id}",{},{queryImageAnnotations:{method:"GET",url:"api/v1/labels{/id}/image-annotations"},queryVideoAnnotations:{method:"GET",url:"api/v1/labels{/id}/video-annotations"}}),S=i({mixins:[d,o],data:function(){return{showAnnotationRoute:null}},computed:{showAnnotationLink:function(){return this.showAnnotationRoute?this.showAnnotationRoute+this.image.id:""},selected:function(){return this.image.dismissed},title:function(){return this.selected?"Undo dismissing this annotation":"Dismiss this annotation"}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("figure",{staticClass:"image-grid__image",class:t.classObject,attrs:{title:t.title}},[t.selectable?n("div",{staticClass:"image-icon"},[n("i",{staticClass:"fas",class:t.iconClass})]):t._e(),t._v(" "),n("img",{attrs:{src:t.srcUrl},on:{click:t.toggleSelect,error:t.showEmptyImage}}),t._v(" "),t.showAnnotationLink?n("div",{staticClass:"image-buttons"},[n("a",{staticClass:"image-button",attrs:{href:t.showAnnotationLink,target:"_blank",title:"Show the annotation in the annotation tool"}},[n("span",{staticClass:"fa fa-external-link-square-alt",attrs:{"aria-hidden":"true"}})])]):t._e()])}),[],!1,null,null,null),C=i({mixins:[u],components:{imageGridImage:S.exports}},void 0,void 0,!1,null,null,null).exports,I=Vue.resource("api/v1/largo-jobs{/id}"),T=i({mixins:[d,o],data:function(){return{showAnnotationRoute:null}},computed:{showAnnotationLink:function(){return this.showAnnotationRoute?this.showAnnotationRoute+this.image.id:""},selected:function(){return this.image.newLabel},title:function(){return this.selected?"Revert changing the label of this annotation":"Change the label of this annotation"},newLabelStyle:function(){return{"background-color":"#"+this.image.newLabel.color}}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("figure",{staticClass:"image-grid__image image-grid__image--relabel",class:t.classObject,attrs:{title:t.title}},[t.selectable?n("div",{staticClass:"image-icon"},[n("i",{staticClass:"fas",class:t.iconClass})]):t._e(),t._v(" "),n("img",{attrs:{src:t.srcUrl},on:{click:t.toggleSelect,error:t.showEmptyImage}}),t._v(" "),t.showAnnotationLink?n("div",{staticClass:"image-buttons"},[n("a",{staticClass:"image-button",attrs:{href:t.showAnnotationLink,target:"_blank",title:"Show the annotation in the annotation tool"}},[n("span",{staticClass:"fa fa-external-link-square-alt",attrs:{"aria-hidden":"true"}})])]):t._e(),t._v(" "),t.selected?n("div",{staticClass:"new-label"},[n("span",{staticClass:"new-label__color",style:t.newLabelStyle}),t._v(" "),n("span",{staticClass:"new-label__name",domProps:{textContent:t._s(t.image.newLabel.name)}})]):t._e()])}),[],!1,null,null,null),L=i({mixins:[u],components:{imageGridImage:T.exports}},void 0,void 0,!1,null,null,null),q=i({mixins:[m],components:{labelTrees:c,sidebar:b,sidebarTab:v,powerToggle:g,dismissImageGrid:C,relabelImageGrid:L.exports},data:function(){return{labelTrees:[],step:0,selectedLabel:null,annotationsCache:{},lastSelectedImage:null,forceChange:!1}},computed:{isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step},annotations:function(){return this.selectedLabel&&this.annotationsCache.hasOwnProperty(this.selectedLabel.id)?this.annotationsCache[this.selectedLabel.id]:[]},allAnnotations:function(){var t=[];for(var e in this.annotationsCache)this.annotationsCache.hasOwnProperty(e)&&Array.prototype.push.apply(t,this.annotationsCache[e]);return t},hasNoAnnotations:function(){return this.selectedLabel&&!this.loading&&0===this.annotations.length},dismissedAnnotations:function(){return this.allAnnotations.filter((function(t){return t.dismissed}))},annotationsWithNewLabel:function(){return this.dismissedAnnotations.filter((function(t){return!!t.newLabel}))},hasDismissedAnnotations:function(){return this.dismissedAnnotations.length>0},dismissedImageAnnotationsToSave:function(){return this.packDismissedToSave(this.dismissedAnnotations.filter((function(t){return"imageAnnotation"===t.type})))},dismissedVideoAnnotationsToSave:function(){return this.packDismissedToSave(this.dismissedAnnotations.filter((function(t){return"videoAnnotation"===t.type})))},changedImageAnnotationsToSave:function(){return this.packChangedToSave(this.annotationsWithNewLabel.filter((function(t){return"imageAnnotation"===t.type})))},changedVideoAnnotationsToSave:function(){return this.packChangedToSave(this.annotationsWithNewLabel.filter((function(t){return"videoAnnotation"===t.type})))},toDeleteCount:function(){return this.dismissedAnnotations.length-this.annotationsWithNewLabel.length},saveButtonClass:function(){return this.forceChange?"btn-danger":"btn-success"}},methods:{getAnnotations:function(t){var e=this;this.annotationsCache.hasOwnProperty(t.id)||(Vue.set(this.annotationsCache,t.id,[]),this.startLoading(),this.queryAnnotations(t).then((function(n){return e.gotAnnotations(t,n)}),r).finally(this.finishLoading))},gotAnnotations:function(t,e){var n=e[0].data,i=e[1].data,o=[];n&&(o=o.concat(this.initAnnotations(t,n,"imageAnnotation"))),i&&(o=o.concat(this.initAnnotations(t,i,"videoAnnotation"))),o=o.sort((function(t,e){return e.id-t.id})),Vue.set(this.annotationsCache,t.id,o)},initAnnotations:function(t,e,n){return Object.keys(e).map((function(i){return{id:i,uuid:e[i],label_id:t.id,dismissed:!1,newLabel:null,type:n}}))},handleSelectedLabel:function(t){this.selectedLabel=t,this.isInDismissStep&&this.getAnnotations(t)},handleDeselectedLabel:function(){this.selectedLabel=null},handleSelectedImageDismiss:function(t,e){t.dismissed?(t.dismissed=!1,t.newLabel=null):(t.dismissed=!0,e.shiftKey&&this.lastSelectedImage?this.dismissAllImagesBetween(t,this.lastSelectedImage):this.lastSelectedImage=t)},goToRelabel:function(){this.step=1,this.lastSelectedImage=null},goToDismiss:function(){this.step=0,this.lastSelectedImage=null,this.selectedLabel&&this.getAnnotations(this.selectedLabel)},handleSelectedImageRelabel:function(t,e){t.newLabel?this.selectedLabel&&t.newLabel.id!==this.selectedLabel.id?t.newLabel=this.selectedLabel:t.newLabel=null:this.selectedLabel&&(t.newLabel=this.selectedLabel,e.shiftKey&&this.lastSelectedImage?this.relabelAllImagesBetween(t,this.lastSelectedImage):this.lastSelectedImage=t)},save:function(){var t=this;this.loading||this.toDeleteCount>0&&!confirm("This might delete ".concat(this.toDeleteCount," annotation(s). Continue?"))||(this.startLoading(),this.performSave({dismissed_image_annotations:this.dismissedImageAnnotationsToSave,changed_image_annotations:this.changedImageAnnotationsToSave,dismissed_video_annotations:this.dismissedVideoAnnotationsToSave,changed_video_annotations:this.changedVideoAnnotationsToSave,force:this.forceChange}).then(this.waitForJobToFinish,(function(e){t.finishLoading(),r(e)})))},waitForJobToFinish:function(t){var e=this,n=t.body.id;!function t(){window.setTimeout((function(){I.get({id:n}).then(t,e.saved)}),2e3)}()},saved:function(){for(var t in this.finishLoading(),p.success("Saved. You can now start a new re-evaluation session."),this.step=0,this.annotationsCache)this.annotationsCache.hasOwnProperty(t)&&delete this.annotationsCache[t];this.handleSelectedLabel(this.selectedLabel)},performOnAllImagesBetween:function(t,e,n){var i=this.allAnnotations.indexOf(t),o=this.allAnnotations.indexOf(e);if(o<i){var s=o;o=i,i=s}for(var a=i+1;a<o;a++)n(this.allAnnotations[a])},dismissAllImagesBetween:function(t,e){this.performOnAllImagesBetween(t,e,(function(t){t.dismissed=!0}))},relabelAllImagesBetween:function(t,e){var n=this.selectedLabel;this.performOnAllImagesBetween(t,e,(function(t){t.dismissed&&(t.newLabel=n)}))},enableForceChange:function(){this.forceChange=!0},disableForceChange:function(){this.forceChange=!1},packDismissedToSave:function(t){for(var e={},n=t.length-1;n>=0;n--)e.hasOwnProperty(t[n].label_id)?e[t[n].label_id].push(t[n].id):e[t[n].label_id]=[t[n].id];return e},packChangedToSave:function(t){for(var e={},n=t.length-1;n>=0;n--)e.hasOwnProperty(t[n].newLabel.id)?e[t[n].newLabel.id].push(t[n].id):e[t[n].newLabel.id]=[t[n].id];return e}},watch:{annotations:function(t){l.$emit("annotations-count",t.length)},dismissedAnnotations:function(t){l.$emit("dismissed-annotations-count",t.length)},step:function(t){l.$emit("step",t)},selectedLabel:function(){this.isInDismissStep&&this.$refs.dismissGrid.setOffset(0)}},created:function(){var t=this;window.addEventListener("beforeunload",(function(e){if(t.hasDismissedAnnotations)return e.preventDefault(),e.returnValue="","This page is asking you to confirm that you want to leave - data you have entered may not be saved."}))}},void 0,void 0,!1,null,null,null).exports,$=i({mixins:[q],components:{catalogImageGrid:_},data:function(){return{labelTrees:[]}},methods:{queryAnnotations:function(t){var e=x.queryImageAnnotations({id:t.id}),n=x.queryVideoAnnotations({id:t.id});return Vue.Promise.all([e,n])}},created:function(){var t=biigle.$require("annotationCatalog.labelTree");this.labelTrees=[t]}},void 0,void 0,!1,null,null,null).exports,O=i({mixins:[q],data:function(){return{volumeId:null,labelTrees:[],mediaType:""}},methods:{queryAnnotations:function(t){var e,n;return"image"===this.mediaType?(e=a.queryImageAnnotations({id:this.volumeId,label_id:t.id}),n=Vue.Promise.resolve([])):(e=Vue.Promise.resolve([]),n=a.queryVideoAnnotations({id:this.volumeId,label_id:t.id})),Vue.Promise.all([e,n])},performSave:function(t){return a.save({id:this.volumeId},t)}},created:function(){this.volumeId=biigle.$require("largo.volumeId"),this.labelTrees=biigle.$require("largo.labelTrees"),this.mediaType=biigle.$require("largo.mediaType")}},void 0,void 0,!1,null,null,null).exports,E=i({data:function(){return{step:0,count:0,dismissedCount:0}},computed:{shownCount:function(){return this.isInDismissStep?this.count:this.dismissedCount},isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step}},methods:{updateStep:function(t){this.step=t},updateCount:function(t){this.count=t},updateDismissedCount:function(t){this.dismissedCount=t}},created:function(){l.$on("annotations-count",this.updateCount),l.$on("dismissed-annotations-count",this.updateDismissedCount),l.$on("step",this.updateStep)}},void 0,void 0,!1,null,null,null).exports,R=Vue.resource("api/v1/projects{/id}/largo",{},{queryImageAnnotations:{method:"GET",url:"api/v1/projects{/id}/image-annotations/filter/label{/label_id}"},queryVideoAnnotations:{method:"GET",url:"api/v1/projects{/id}/video-annotations/filter/label{/label_id}"}}),k=i({mixins:[q],data:function(){return{projectId:null,labelTrees:[]}},methods:{queryAnnotations:function(t){var e=R.queryImageAnnotations({id:this.projectId,label_id:t.id}),n=R.queryVideoAnnotations({id:this.projectId,label_id:t.id});return Vue.Promise.all([e,n])},performSave:function(t){return R.save({id:this.projectId},t)}},created:function(){this.projectId=biigle.$require("largo.projectId"),this.labelTrees=biigle.$require("largo.labelTrees")}},void 0,void 0,!1,null,null,null).exports;biigle.$mount("annotation-catalog-container",$),biigle.$mount("largo-container",O),biigle.$mount("largo-title",E),biigle.$mount("project-largo-container",k)},zcrr:function(t,e){}});