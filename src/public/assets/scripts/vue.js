biigle.$viewModel("largo-container",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("largo.api.volumes"),n=biigle.$require("largo.volumeId"),s=biigle.$require("largo.stores.events");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],components:{labelTrees:biigle.$require("labelTrees.components.labelTrees"),sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),dismissImageGrid:biigle.$require("largo.components.dismissImageGrid"),relabelImageGrid:biigle.$require("largo.components.relabelImageGrid")},data:{labelTrees:biigle.$require("largo.labelTrees"),step:0,selectedLabel:null,annotationsCache:{}},computed:{isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step},annotations:function(){return this.selectedLabel&&this.annotationsCache.hasOwnProperty(this.selectedLabel.id)?this.annotationsCache[this.selectedLabel.id]:[]},allAnnotations:function(){var e=[];for(var t in this.annotationsCache)this.annotationsCache.hasOwnProperty(t)&&Array.prototype.push.apply(e,this.annotationsCache[t]);return e},hasNoAnnotations:function(){return this.selectedLabel&&!this.loading&&0===this.annotations.length},dismissedAnnotations:function(){return this.allAnnotations.filter(function(e){return e.dismissed})},hasDismissedAnnotations:function(){return this.dismissedAnnotations.length>0},dismissedToSave:function(){for(var e=this.dismissedAnnotations,t={},i=e.length-1;i>=0;i--)t.hasOwnProperty(e[i].label_id)?t[e[i].label_id].push(e[i].id):t[e[i].label_id]=[e[i].id];return t},changedToSave:function(){for(var e=this.dismissedAnnotations.filter(function(e){return!!e.newLabel}),t={},i=e.length-1;i>=0;i--)t[e[i].id]=e[i].newLabel.id;return t}},methods:{getAnnotations:function(e){if(!this.annotationsCache.hasOwnProperty(e.id)){var s=this;Vue.set(s.annotationsCache,e.id,[]),this.startLoading(),i.queryAnnotations({id:n,label_id:e.id}).then(function(t){s.gotAnnotations(e,t.data)},t.handleErrorResponse).finally(this.finishLoading)}},gotAnnotations:function(e,t){t=t.map(function(t){return{id:t,label_id:e.id,blob:null,dismissed:!1,newLabel:null}}),Vue.set(this.annotationsCache,e.id,t)},handleSelectedLabel:function(e){this.selectedLabel=e,this.isInDismissStep&&this.getAnnotations(e)},handleDeselectedLabel:function(){this.selectedLabel=null},handleDismissedImage:function(e){e.dismissed=!0},handleUndismissedImage:function(e){e.dismissed=!1,e.newLabel=null},goToRelabel:function(){this.step=1},goToDismiss:function(){this.step=0,this.selectedLabel&&this.getAnnotations(this.selectedLabel)},handleRelabelledImage:function(e){this.selectedLabel&&(e.newLabel=this.selectedLabel)},handleUnrelabelledImage:function(e){this.selectedLabel&&e.newLabel.id!==this.selectedLabel.id?e.newLabel=this.selectedLabel:e.newLabel=null},save:function(){this.loading||(this.loading=!0,i.save({id:n},{dismissed:this.dismissedToSave,changed:this.changedToSave}).then(this.saved,t.handleErrorResponse).finally(this.finishLoading))},saved:function(){t.success("Saved.  You can now start a new re-evaluation session."),this.step=0;for(var e in this.annotationsCache)this.annotationsCache.hasOwnProperty(e)&&delete this.annotationsCache[e];this.handleSelectedLabel(this.selectedLabel)}},watch:{annotations:function(e){s.$emit("annotations-count",e.length)},dismissedAnnotations:function(e){s.$emit("dismissed-annotations-count",e.length)},step:function(e){s.$emit("step",e)}},created:function(){}})}),biigle.$viewModel("largo-title",function(e){var t=biigle.$require("largo.stores.events");new Vue({el:e,data:{step:0,count:0,dismissedCount:0},computed:{shownCount:function(){return this.isInDismissStep?this.count:this.dismissedCount},isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step}},methods:{updateStep:function(e){this.step=e},updateCount:function(e){this.count=e},updateDismissedCount:function(e){this.dismissedCount=e}},created:function(){t.$on("annotations-count",this.updateCount),t.$on("dismissed-annotations-count",this.updateDismissedCount),t.$on("step",this.updateStep)}})}),biigle.$declare("largo.api.annotations",Vue.resource("api/v1/annotations{/id}/patch")),biigle.$declare("largo.api.volumes",Vue.resource("api/v1/volumes{/id}/largo",{},{queryAnnotations:{method:"GET",url:"api/v1/volumes{/id}/annotations/filter/label{/label_id}"}})),biigle.$component("largo.components.dismissImageGrid",{mixins:[biigle.$require("largo.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.dismissImageGridImage")}}),biigle.$component("largo.components.dismissImageGridImage",{mixins:[biigle.$require("largo.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--dismiss" :class="classObject" :title="title"><img @click="toggleSelect" :src="url || emptyUrl"><div v-if="showAnnotationLink" class="image-buttons"><a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.dismissed},title:function(){return this.selected?"Undo dismissing this annotation":"Dismiss this annotation"}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$component("largo.components.imageGrid",{template:'<div class="image-grid" @wheel="scroll"><div class="image-grid__images" ref="images"><image-grid-image v-for="image in displayedImages" :key="image.id" :image="image" :empty-url="emptyUrl" @select="emitSelect" @deselect="emitDeselect"></image-grid-image></div><image-grid-progress :progress="progress" @top="jumpToStart" @prev-page="reversePage" @prev-row="reverseRow" @jump="jumpToPercent" @next-row="advanceRow" @next-page="advancePage" @bottom="jumpToEnd"></image-grid-progress></div>',data:function(){return{clientWidth:0,clientHeight:0,privateOffset:0}},components:{imageGridImage:biigle.$require("largo.components.imageGridImage"),imageGridProgress:biigle.$require("largo.components.imageGridProgress")},props:{images:{type:Array,required:!0},emptyUrl:{type:String,required:!0},width:{type:Number,default:135},height:{type:Number,default:180},margin:{type:Number,default:8}},computed:{columns:function(){return Math.floor(this.clientWidth/(this.width+this.margin))},rows:function(){return Math.floor(this.clientHeight/(this.height+this.margin))},displayedImages:function(){return this.images.slice(this.offset,this.offset+this.columns*this.rows)},offset:{get:function(){return this.privateOffset},set:function(e){this.privateOffset=Math.max(0,Math.min(this.lastRow*this.columns,e))}},progress:function(){return this.offset/(this.columns*this.lastRow)},lastRow:function(){return Math.ceil(this.images.length/this.columns)-this.rows}},methods:{updateDimensions:function(){this.clientHeight=this.$refs.images.clientHeight,this.clientWidth=this.$refs.images.clientWidth,this.offset=this.offset},scrollRows:function(e){this.offset=this.offset+this.columns*e},scroll:function(e){this.scrollRows(e.deltaY>=0?1:-1)},advanceRow:function(){this.scrollRows(1)},advancePage:function(){this.scrollRows(this.rows)},reverseRow:function(){this.scrollRows(-1)},reversePage:function(){this.scrollRows(-this.rows)},jumpToPercent:function(e){this.offset=this.columns*Math.round(this.lastRow*e)},jumpToStart:function(){this.jumpToPercent(0)},jumpToEnd:function(){this.jumpToPercent(1)},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)}},created:function(){window.addEventListener("resize",this.updateDimensions);var e=biigle.$require("labelTrees.stores.keyboard");e.on(38,this.reverseRow),e.on(40,this.advanceRow),e.on(37,this.reversePage),e.on(33,this.reversePage),e.on(39,this.advancePage),e.on(34,this.advancePage),e.on(36,this.jumpToStart),e.on(35,this.jumpToEnd)},mounted:function(){this.$nextTick(this.updateDimensions)}}),biigle.$component("largo.components.imageGridImage",{template:'<figure class="image-grid__image" :class="classObject"><img @click="toggleSelect" :src="url || emptyUrl"></figure>',data:function(){return{url:"",timeout:null}},props:{image:{type:Object,required:!0},emptyUrl:{type:String,required:!0}},computed:{classObject:function(){return{"image-grid__image--selected":this.selected}},selected:function(){return!1}},methods:{toggleSelect:function(){this.selected?this.$emit("deselect",this.image):this.$emit("select",this.image)}},created:function(){if(this.image.blob)this.url=this.image.blob;else if(this.getBlob){var e=this;this.timeout=setTimeout(function(){e.getBlob().then(function(t){var i=window.URL||window.webkitURL;e.url=i.createObjectURL(t.body),e.image.blob=e.url})},50)}},beforeDestroy:function(){clearTimeout(this.timeout)}}),biigle.$component("largo.components.imageGridProgress",{template:'<div class="image-grid-progress"><div class="btn-group-vertical"><button type="button" class="btn btn-default btn-xs" title="Go to top 𝗛𝗼𝗺𝗲" @click="top" :disabled="isAtTop"><span class="glyphicon glyphicon-fast-backward"></span></button><button type="button" class="btn btn-default btn-xs" title="Previous page 𝗣𝗮𝗴𝗲 𝘂𝗽/𝗔𝗿𝗿𝗼𝘄 𝗹𝗲𝗳𝘁" @click="prevPage" :disabled="isAtTop"><span class="glyphicon glyphicon-step-backward"></span></button><button type="button" class="btn btn-default btn-xs" title="Previous row 𝗔𝗿𝗿𝗼𝘄 𝘂𝗽" @click="prevRow" :disabled="isAtTop"><span class="glyphicon glyphicon-triangle-left"></span></button></div><div class="image-grid-progress__bar" @mousedown="beginScrolling" @mouseup="stopScrolling" @mouseleave="stopScrolling" @mousemove.prevent="scroll" @click="jump"><div class="image-grid-progress__wrapper"><div class="image-grid-progress__inner" :style="{height: progressHeight}"></div></div></div><div class="btn-group-vertical"><button type="button" class="btn btn-default btn-xs" title="Next row 𝗔𝗿𝗿𝗼𝘄 𝗱𝗼𝘄𝗻" @click="nextRow" :disabled="isAtBottom"><span class="glyphicon glyphicon-triangle-right"></span></button><button type="button" class="btn btn-default btn-xs" title="Next page 𝗣𝗮𝗴𝗲 𝗱𝗼𝘄𝗻/𝗔𝗿𝗿𝗼𝘄 𝗿𝗶𝗴𝗵𝘁" @click="nextPage" :disabled="isAtBottom"><span class="glyphicon glyphicon-step-forward"></span></button><button type="button" class="btn btn-default btn-xs" title="Go to bottom 𝗘𝗻𝗱" @click="bottom" :disabled="isAtBottom"><span class="glyphicon glyphicon-fast-forward"></span></button></div></div>',data:function(){return{scrolling:!1}},props:{progress:{type:Number,required:!0}},computed:{isAtTop:function(){return 0===this.progress},isAtBottom:function(){return 1===this.progress},progressHeight:function(){return 100*this.progress+"%"}},methods:{top:function(){this.$emit("top")},prevPage:function(){this.$emit("prev-page")},prevRow:function(){this.$emit("prev-row")},beginScrolling:function(){this.scrolling=!0},stopScrolling:function(){this.scrolling=!1},scroll:function(e){this.scrolling&&this.jump(e)},jump:function(e){var t=e.target.getBoundingClientRect();this.$emit("jump",(e.clientY-t.top)/t.height)},nextRow:function(){this.$emit("next-row")},nextPage:function(){this.$emit("next-page")},bottom:function(){this.$emit("bottom")}}}),biigle.$component("largo.components.relabelImageGrid",{mixins:[biigle.$require("largo.components.imageGrid")],components:{imageGridImage:biigle.$require("largo.components.relabelImageGridImage")}}),biigle.$component("largo.components.relabelImageGridImage",{mixins:[biigle.$require("largo.components.imageGridImage")],template:'<figure class="image-grid__image image-grid__image--relabel" :class="classObject" :title="title"><img @click="toggleSelect" :src="url || emptyUrl"><div v-if="showAnnotationLink" class="image-buttons"><a :href="showAnnotationLink" target="_blank" class="image-button" title="Show the annotation in the annotation tool"><span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></div><div v-if="selected" class="new-label"><span class="new-label__color" :style="newLabelStyle"></span> <span class="new-label__name" v-text="image.newLabel.name"></span></div></figure>',computed:{showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.newLabel},title:function(){return this.selected?"Revert changing the label of this annotation":"Change the label of this annotation"},newLabelStyle:function(){return{"background-color":"#"+this.image.newLabel.color}}},methods:{getBlob:function(){return biigle.$require("largo.api.annotations").get({id:this.image.id})}}}),biigle.$declare("largo.stores.events",new Vue);