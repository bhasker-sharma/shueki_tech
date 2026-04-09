<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    // ─── Public ──────────────────────────────────────────────────────────────

    public function publicIndex()
    {
        $projects = Project::where('status', 'published')
            ->orderBy('sort_order')
            ->orderByDesc('year')
            ->get()
            ->map(fn($p) => $this->formatProject($p));

        return response()->json(['projects' => $projects]);
    }

    public function publicShow(Project $project)
    {
        if ($project->status !== 'published') {
            abort(404);
        }
        return response()->json(['project' => $project->toArray()]);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    public function index()
    {
        $projects = Project::orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($p) => $this->formatProject($p));

        return response()->json(['projects' => $projects]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'client'       => 'nullable|string|max:255',
            'industry'     => 'required|string|max:255',
            'service_type' => 'required|string|max:100',
            'problem'      => 'required|string',
            'result'       => 'required|string',
            'tech'         => 'nullable|string',
            'year'         => 'nullable|integer|min:2000|max:2100',
            'featured'     => 'nullable',
            'status'       => 'nullable|in:draft,published',
            'gradient'     => 'nullable|string|max:100',
            'sort_order'   => 'nullable|integer',
            'link'         => 'nullable|url|max:500',
            'images.*'     => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $project = Project::create([
            'title'        => $request->input('title'),
            'client'       => $request->input('client') ?? '',
            'industry'     => $request->input('industry'),
            'service_type' => $request->input('service_type'),
            'problem'      => $request->input('problem'),
            'result'       => $request->input('result'),
            'tech'         => $this->parseTech($request->input('tech')),
            'images'       => [],
            'featured'     => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN),
            'year'         => $request->input('year') ?? now()->year,
            'status'       => $request->input('status', 'published'),
            'gradient'     => $request->input('gradient', 'from-blue-500 to-cyan-500'),
            'sort_order'   => (int) $request->input('sort_order', 0),
            'link'         => $request->input('link') ?: null,
        ]);

        $images = $this->uploadImages($request, $project->id);
        if (!empty($images)) {
            $project->update(['images' => $images]);
        }

        return response()->json(['project' => $this->formatProject($project->fresh())], 201);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'client'          => 'nullable|string|max:255',
            'industry'        => 'required|string|max:255',
            'service_type'    => 'required|string|max:100',
            'problem'         => 'required|string',
            'result'          => 'required|string',
            'tech'            => 'nullable|string',
            'year'            => 'nullable|integer|min:2000|max:2100',
            'featured'        => 'nullable',
            'status'          => 'nullable|in:draft,published',
            'gradient'        => 'nullable|string|max:100',
            'sort_order'      => 'nullable|integer',
            'link'            => 'nullable|url|max:500',
            'existing_images' => 'nullable|string', // JSON array of paths to keep
            'images.*'        => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        // Determine which existing images to keep
        $keepPaths = json_decode($request->input('existing_images', '[]'), true) ?? [];

        // Delete removed images from storage
        foreach ($project->images ?? [] as $oldPath) {
            if (!in_array($oldPath, $keepPaths)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        // Upload new images
        $newPaths = $this->uploadImages($request, $project->id);

        $allImages = array_values(array_slice(
            array_merge($keepPaths, $newPaths),
            0,
            5
        ));

        $project->update([
            'title'        => $request->input('title'),
            'client'       => $request->input('client') ?? '',
            'industry'     => $request->input('industry'),
            'service_type' => $request->input('service_type'),
            'problem'      => $request->input('problem'),
            'result'       => $request->input('result'),
            'tech'         => $this->parseTech($request->input('tech')),
            'images'       => $allImages,
            'featured'     => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN),
            'year'         => $request->input('year') ?? $project->year,
            'status'       => $request->input('status', $project->status),
            'gradient'     => $request->input('gradient', $project->gradient),
            'sort_order'   => (int) $request->input('sort_order', $project->sort_order),
            'link'         => $request->input('link') ?: null,
        ]);

        return response()->json(['project' => $this->formatProject($project->fresh())]);
    }

    public function destroy(Project $project)
    {
        // Remove all stored images
        foreach ($project->images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }
        Storage::disk('public')->deleteDirectory("projects/{$project->id}");

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function uploadImages(Request $request, int $projectId): array
    {
        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $paths[] = $file->store("projects/{$projectId}", 'public');
            }
        }
        return $paths;
    }

    private function parseTech(?string $input): array
    {
        if (!$input) {
            return [];
        }
        return array_values(array_filter(
            array_map('trim', explode(',', $input))
        ));
    }

    /**
     * Return project as array with image paths (relative, not full URLs).
     * Frontend constructs full URLs using STORAGE_URL env var.
     */
    private function formatProject(Project $project): array
    {
        return $project->toArray();
    }
}
