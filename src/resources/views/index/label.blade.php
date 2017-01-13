<div class="volume__label" data-ng-controller="ImageLabelController">
    <div class="volume__label-body">
        <div class="labels-search clearfix">
            <span class="pull-right" data-ng-switch="isInDismissMode()">
                <button class="btn btn-success" data-ng-click="goToReLabelling()" title="@{{canContinue() ? 'Go to the re-labelling step' : 'Please select annotations for dismissal first'}}" data-ng-switch-when="true" data-ng-disabled="!canContinue()" disabled="">
                    Continue
                </button>
                <button class="btn btn-default ng-cloak" data-ng-click="goToDismiss()" title="Go back to dismissing annotations" data-ng-switch-default="">
                    Back
                </button>
                <button class="btn btn-success ng-cloak" data-ng-click="saveReLabelling()" title="Save the changes" data-ng-switch-default="" data-ng-disabled="isSaving()">
                    Save
                </button>
            </span>
            <input class="form-control" type="text" data-ng-model="selected.searchLabel" data-uib-typeahead="label.name for label in getLabels() | filter:$viewValue | limitTo:10" data-typeahead-on-select="selectLabel($item)" placeholder="Find label" />
        </div>
        <div class="labels-body">
            <div data-ng-if="hasFavourites()">
                <h4 class="label-tree-name" title="Favourites can be selected with the hotkeys 𝟭-𝟵">Favourites</h4>
                <ol class="label-tree-items list-unstyled">
                    <li class="label-tree-item clearfix" data-ng-class="getClass()" data-ng-repeat="item in getFavourites()" title="Select favourite @{{hotkeysMap[$index]}}"></li>
                </ol>
            </div>
            <div data-ng-if="tree[null]" class="label-trees-list" data-ng-repeat="(name, tree) in getLabelTrees()">
                <h4 class="label-tree-name" data-ng-bind="name"></h4>
                <ul class="label-tree-items list-unstyled">
                    <li class="label-tree-item clearfix" data-ng-class="getClass()" data-ng-repeat="item in tree[null] | orderBy: 'name'"></li>
                </ul>
            </div>
        </div>
    </div>
</div>

<script type="text/ng-template" id="label-tree-item.html">
    <div class="item" data-ng-click="selectLabel(item)">
        <span class="pull-right" data-ng-switch="isFavourite(item)">
            <span data-ng-switch-when="true" class="glyphicon glyphicon-star" aria-hidden="true" title="Remove as favourite" data-ng-click="toggleFavourite($event, item)"></span>
            <span data-ng-switch-default="" data-ng-if="favouritesLeft()" class="glyphicon glyphicon-star-empty" aria-hidden="true" title="Select as favourite" data-ng-click="toggleFavourite($event, item)"></span>
        </span>
        <span class="item__color" data-ng-style="{'background-color': '#' + item.color}"></span>
        <span class="item__name" data-ng-bind="item.name"></span>
    </div>
</script>

<script type="text/ng-template" id="label-subtree.html">
    <ul class="label-subtree list-unstyled">
        <li class="label-tree-item clearfix" data-ng-class="getClass()" data-ng-repeat="item in getSubtree() | orderBy: 'name'"></li>
    </ul>
</script>
