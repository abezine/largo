@extends('app')

@section('title'){{ $volume->name }} @stop

@push('scripts')
    <script src="{{ cachebust_asset('vendor/label-trees/scripts/main.js') }}"></script>
    <script src="{{ cachebust_asset('vendor/largo/scripts/vue.js') }}"></script>
    <script type="text/javascript">
        // angular.module('biigle.largo').constant('LARGO_VOLUME_ID', {{$volume->id}});
        // angular.module('biigle.largo').constant('THUMB_DIMENSION', {WIDTH: {{config('thumbnails.width')}}, HEIGHT: {{config('thumbnails.height')}} });
        // angular.module('biigle.largo').constant('LABEL_TREES', {!!$labelTrees!!});
        biigle.$declare('largo.volumeId', {!! $volume->id !!});
        biigle.$declare('largo.labelTrees', {!! $labelTrees !!});
        biigle.$declare('largo.showAnnotationRoute', '@if(Route::has('show-annotation')){{ route('show-annotation', '') }}/' @else '' @endif);
    </script>
@endpush

@push('styles')
    <link href="{{ cachebust_asset('vendor/label-trees/styles/main.css') }}" rel="stylesheet">
    <link href="{{ cachebust_asset('vendor/largo/styles/main.css') }}" rel="stylesheet">
@endpush

@section('navbar')
<div class="navbar-text navbar-largo-breadcrumbs">
    @include('volumes::partials.projectsBreadcrumb') / <a href="{{route('volume', $volume->id)}}" title="Show volume {{$volume->name}}" class="navbar-link">{{$volume->name}}</a> / <span id="largo-title"><strong v-if="isInDismissStep">Largo - dismiss existing annotations</strong><strong v-cloak v-else>Largo - re-label dismissed annotations</strong> <small>(<span v-text="count">0</span>&nbsp;annotations)</small></span> @include('volumes::partials.annotationSessionIndicator')
</div>
@endsection

@section('content')
<div id="largo-container" class="largo-container">
    <div class="largo-images">
        <div class="largo-images__alerts">
            <div v-if="!selectedLabel" class="alert alert-info">
                Please choose a label in the sidebar.
            </div>
            <div v-cloak v-if="loading" class="alert alert-info">
                <loader :active="true"></loader>
            </div>
            <div v-cloak v-if="hasNoAnnotations" class="alert alert-info">
                There are no annotations with the label <strong v-text="selectedLabel.name"></strong>.
            </div>
        </div>
        <image-grid :images="annotations" empty-url="{{ asset(config('thumbnails.empty_url')) }}" :width="{{config('thumbnails.width')}}" :height="{{config('thumbnails.height')}}" v-on:select="handleDismissedImage" v-on:deselect="handleUndismissedImage"></image-grid>
    </div>
    <sidebar :show-buttons="false" open-tab="labels">
        <sidebar-tab class="largo-tab" slot="tabs" name="labels" icon="tags" title="Label trees">
            <div v-cloak class="largo-tab__button">
                <button class="btn btn-success btn-block" :disabled="!hasDismissedAnnotations" title="Go to the re-labelling step">Continue</button>
            </div>
            <label-trees class="largo-tab__label-trees" :trees="labelTrees" :show-favourites="true" v-on:select="handleSelectedLabel" v-on:deselect="handleDeselectedLabel" v-on:clear="handleDeselectedLabel"></label-trees>
        </sidebar-tab>
    </sidebar>
</div>
@endsection
