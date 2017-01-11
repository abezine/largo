angular.module("biigle.ate",["biigle.transects"]),angular.module("biigle.ate").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),angular.module("biigle.ate").constant("TRANSECT_ID","ate"),angular.module("biigle.ate").constant("TRANSECT_IMAGES",[]),angular.module("biigle.ate").controller("AteController",["$scope","labels","annotations","msg",function(e,n,t,i){"use strict";var a=0,s={DISMISS:0,RELABEL:1},o=function(){document.getElementById("dismiss-mode-title").classList.toggle("ng-hide"),document.getElementById("re-labelling-mode-title").classList.toggle("ng-hide")};e.annotationsExist=t.exist,e.isInDismissMode=function(){return a===s.DISMISS},e.goToDismiss=function(){a=s.DISMISS,o(),t.goToStep(a)},e.isInReLabellingMode=function(){return a===s.RELABEL},e.goToReLabelling=function(){a=s.RELABEL,o(),t.goToStep(a)},e.saveReLabelling=function(){t.save().then(function(){e.goToDismiss(),i.success("Saved. You can now start a new re-evaluation session.")})},e.hasSelectedLabel=n.hasSelectedLabel,e.getSelectedLabelName=function(){return n.getSelectedLabel().name},e.isLoading=t.isLoading,e.isSaving=t.isSaving,e.canContinue=t.canContinue,e.getClass=function(){return{"dismiss-mode":e.isInDismissMode(),"re-labelling-mode":e.isInReLabellingMode()}},e.$watch(n.getSelectedLabel,t.handleSelectedLabel)}]),angular.module("biigle.ate").directive("ateFigure",function(){"use strict";return{restrict:"A",controller:["$scope","annotations","msg",function(e,n,t){e.changedLabel=null;var i=function(){e.changedLabel=n.getChangedLabel(e.id)},a=function(){return n.isDismissed(e.id)},s=function(){return null!==e.changedLabel};e.isChanged=s,e.handleClick=function(t){n.selectAnnotation(e.id),i()},e.getTitle=function(){return e.isInDismissMode()?a()?"Undo dismissing this annotation":"Dismiss this annotation":s()?"Revert changing the label of this annotation":"Change the label of this annotation"},e.getClass=function(){return{"annotation-selected":e.isInDismissMode()&&a()||e.isInReLabellingMode()&&s()}},i()}]}}),angular.module("biigle.ate").factory("Ate",["$resource","URL",function(e,n){"use strict";return e(n+"/api/v1/transects/:transect_id/ate")}]),angular.module("biigle.ate").factory("TransectFilterAnnotationLabel",["$resource","URL",function(e,n){"use strict";return e(n+"/api/v1/transects/:transect_id/annotations/filter/label/:label_id")}]),angular.module("biigle.ate").service("annotations",["TRANSECT_IMAGES","ate","labels","images","msg",function(e,n,t,i,a){"use strict";var s={},o=!1,r=!1,l=!1,u={},c=[],d={},g=0,f={DISMISS:0,RELABEL:1},h=this,L=document.getElementById("annotation-count"),m=function(n){n=n||e.length,L.innerHTML=n},S=function(e){c.indexOf(e)===-1&&c.push(e)},b=function(e){var n=c.indexOf(e);n!==-1&&c.splice(n,1),d.hasOwnProperty(e)&&delete d[e]},p=function(e){r=!1,a.responseError(e)},v=function(){l=!1,s={},u={},c.length=0,d={}},I=function(e){l=!1,D(),a.responseError(e)},E=function(n){r=!1,o=n.length>0,o&&Array.prototype.push.apply(e,n),i.updateFiltering(),m()},A=function(e){var n=t.getSelectedLabel().id;if(u.hasOwnProperty(n)){var i=u[n].indexOf(e);i!==-1?(u[n].splice(i,1),b(e)):(u[n].push(e),S(e))}else u[n]=[e],S(e)},T=function(e){d.hasOwnProperty(e)?delete d[e]:d[e]=t.getSelectedLabel().id},D=function(){e.length=0,E(c),i.scrollToPercent(0)};this.selectAnnotation=function(e){g===f.DISMISS?A(e):T(e)},this.isDismissed=function(e){var n=t.getSelectedLabel().id;return u.hasOwnProperty(n)&&u[n].indexOf(e)!==-1},this.getDismissedIds=function(){return c},this.getChangedLabel=function(e){return d.hasOwnProperty(e)?t.getLabel(d[e]):null},this.handleSelectedLabel=function(t){if(t&&g!==f.RELABEL){var a=t.id;e.length=0,m(),i.updateFiltering(),i.scrollToPercent(0),s.hasOwnProperty(a)?E(s[a]):(r=!0,s[a]=n.getAnnotations(a),s[a].$promise.then(E,p))}},this.exist=function(){return o},this.isLoading=function(){return r},this.isSaving=function(){return l},this.canContinue=function(){return c.length>0},this.goToStep=function(e){g=e,g===f.DISMISS?h.handleSelectedLabel(t.getSelectedLabel()):D()},this.save=function(){l=!0,e.length=0,m(),i.updateFiltering();var t=n.save(u,d).$promise;return t.then(v,I),t}}]),angular.module("biigle.ate").service("ate",["ATE_TRANSECT_ID","TransectFilterAnnotationLabel","Ate",function(e,n,t){"use strict";this.getAnnotations=function(t){return n.query({transect_id:e,label_id:t})},this.save=function(n,i){return t.save({transect_id:e},{dismissed:n,changed:i})}}]),angular.module("biigle.ate").service("labels",["LABEL_TREES",function(e){"use strict";var n=[],t={},i=[],a=null,s=function(){for(var i,a=function(e){var n=e.parent_id;t[i][n]?t[i][n].push(e):t[i][n]=[e]},s=e.length-1;s>=0;s--)i=e[s].name,t[i]={},e[s].labels.forEach(a),n=n.concat(e[s].labels)},o=function(e){for(var t=n.length-1;t>=0;t--)if(n[t].id===e)return n[t];return null},r=function(e){var n=e;if(i.length=0,n)for(;null!==n.parent_id;)i.unshift(n.parent_id),n=o(n.parent_id)};this.getLabel=o,this.getLabels=function(){return n},this.getLabelTrees=function(){return t},this.selectLabel=function(e){r(e),a=e},this.treeItemIsOpen=function(e){return i.indexOf(e.id)!==-1},this.treeItemIsSelected=function(e){return a&&a.id===e.id},this.getSelectedLabel=function(){return a},this.hasSelectedLabel=function(){return null!==a},s()}]);
