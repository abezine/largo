angular.module("dias.annotations").controller("AteExamplePatchesController",["$scope","labels","exampleAnnotations",function(n,t,e){"use strict";var a,i,o=[],s=function(n){o=e.getForLabel(n),a=n},r=function(e){i&&i(),i=e?n.$watch(t.getSelected,s):void 0};n.getPatches=function(){return o},n.hasPatches=function(){return o.length>0},n.getLabelName=function(){return a?a.name:""},n.hasLabel=function(){return void 0!==a},n.isLoading=function(){return o.$resolved===!1},n.isEnabled=e.isEnabled,n.$watch(e.isEnabled,r)}]),angular.module("dias.annotations").controller("AteExamplePatchesSettingsController",["$scope","exampleAnnotations","settings",function(n,t,e){"use strict";var a="exampleAnnotations";e.setDefaultSettings(a,!0),n.show=function(){e.setPermanentSettings(a,!0)},n.hide=function(){e.setPermanentSettings(a,!1)},n.shown=function(){return e.getPermanentSettings(a)},n.$watch(n.shown,function(n){n?t.enable():t.disable()})}]),angular.module("dias.annotations").factory("TransectFilterAnnotationLabel",["$resource","URL",function(n,t){"use strict";return n(t+"/api/v1/transects/:transect_id/annotations/filter/label/:label_id")}]),angular.module("dias.annotations").service("exampleAnnotations",["TransectFilterAnnotationLabel","TRANSECT_ID",function(n,t){"use strict";var e=3,a={},i=!0;this.getForLabel=function(i){return i?((!a.hasOwnProperty(i.id)||a[i.id].length<e)&&(a[i.id]=n.query({transect_id:t,label_id:i.id,take:e})),a[i.id]):[]},this.disable=function(){i=!1},this.enable=function(){i=!0},this.isEnabled=function(){return i}}]);