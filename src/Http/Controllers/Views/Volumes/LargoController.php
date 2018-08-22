<?php

namespace Biigle\Modules\Largo\Http\Controllers\Views\Volumes;

use Biigle\Role;
use Biigle\Volume;
use Biigle\LabelTree;
use Illuminate\Contracts\Auth\Guard;
use Biigle\Http\Controllers\Views\Controller;

class LargoController extends Controller
{
    /**
     * Show the the Largo view for a volume.
     *
     * @param Guard $auth
     * @param int $id Volume ID
     * @return \Illuminate\Http\Response
     */
    public function index(Guard $auth, $id)
    {
        $volume = Volume::findOrFail($id);
        $this->authorize('edit-in', $volume);
        $user = $auth->user();

        if ($user->can('sudo')) {
            // Global admins have no restrictions.
            $projects = $volume->projects;
        } else {
            // All projects that the user and the volume have in common
            // and where the user is editor, expert or admin.
            $projects = $user->projects()
                ->whereIn('id', function ($query) use ($volume) {
                    $query->select('project_volume.project_id')
                        ->from('project_volume')
                        ->join('project_user', 'project_volume.project_id', '=', 'project_user.project_id')
                        ->where('project_volume.volume_id', $volume->id)
                        ->whereIn('project_user.project_role_id', [
                            Role::$editor->id,
                            Role::$expert->id,
                            Role::$admin->id,
                        ]);
                })
                ->get();
        }

        // all label trees that are used by all projects which are visible to the user
        $labelTrees = LabelTree::with('labels')
            ->select('id', 'name')
            ->whereIn('id', function ($query) use ($projects) {
                $query->select('label_tree_id')
                    ->from('label_tree_project')
                    ->whereIn('project_id', $projects->pluck('id'));
            })
            ->get();

        return view('largo::show', [
            'user' => $user,
            'volume' => $volume,
            'projects' => $projects,
            'labelTrees' => $labelTrees,
            'target' => $volume,
        ]);
    }
}
