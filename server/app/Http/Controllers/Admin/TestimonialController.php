<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    // ─── Public ──────────────────────────────────────────────────────────────

    public function publicIndex()
    {
        $testimonials = Testimonial::where('status', 'published')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['testimonials' => $testimonials]);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    public function index()
    {
        $testimonials = Testimonial::orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['testimonials' => $testimonials]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'       => 'required|string|max:100',
            'role'       => 'required|string|max:100',
            'company'    => 'required|string|max:100',
            'text'       => 'required|string',
            'rating'     => 'nullable|integer|min:1|max:5',
            'service'    => 'nullable|string|max:100',
            'initials'   => 'nullable|string|max:3',
            'gradient'   => 'nullable|string|max:100',
            'featured'   => 'nullable',
            'sort_order' => 'nullable|integer',
            'status'     => 'nullable|in:draft,published',
        ]);

        $testimonial = Testimonial::create([
            'name'       => $request->input('name'),
            'role'       => $request->input('role'),
            'company'    => $request->input('company'),
            'text'       => $request->input('text'),
            'rating'     => (int) $request->input('rating', 5),
            'service'    => $request->input('service') ?: null,
            'initials'   => $request->input('initials') ?: $this->computeInitials($request->input('name')),
            'gradient'   => $request->input('gradient', 'from-blue-500 to-cyan-500'),
            'featured'   => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN),
            'sort_order' => (int) $request->input('sort_order', 0),
            'status'     => $request->input('status', 'published'),
        ]);

        return response()->json(['testimonial' => $testimonial], 201);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $request->validate([
            'name'       => 'required|string|max:100',
            'role'       => 'required|string|max:100',
            'company'    => 'required|string|max:100',
            'text'       => 'required|string',
            'rating'     => 'nullable|integer|min:1|max:5',
            'service'    => 'nullable|string|max:100',
            'initials'   => 'nullable|string|max:3',
            'gradient'   => 'nullable|string|max:100',
            'featured'   => 'nullable',
            'sort_order' => 'nullable|integer',
            'status'     => 'nullable|in:draft,published',
        ]);

        $testimonial->update([
            'name'       => $request->input('name'),
            'role'       => $request->input('role'),
            'company'    => $request->input('company'),
            'text'       => $request->input('text'),
            'rating'     => (int) $request->input('rating', 5),
            'service'    => $request->input('service') ?: null,
            'initials'   => $request->input('initials') ?: $this->computeInitials($request->input('name')),
            'gradient'   => $request->input('gradient', $testimonial->gradient),
            'featured'   => filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN),
            'sort_order' => (int) $request->input('sort_order', $testimonial->sort_order),
            'status'     => $request->input('status', $testimonial->status),
        ]);

        return response()->json(['testimonial' => $testimonial->fresh()]);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(['message' => 'Testimonial deleted successfully']);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function computeInitials(string $name): string
    {
        $words = preg_split('/\s+/', trim($name));
        $initials = array_map(fn($w) => strtoupper(substr($w, 0, 1)), $words);
        return implode('', array_slice($initials, 0, 2));
    }
}
