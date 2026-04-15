<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    // ─── Public ──────────────────────────────────────────────────────────────

    /**
     * Returns published FAQs. Optionally filtered by ?page=home|contact|…
     */
    public function publicIndex(Request $request)
    {
        $query = Faq::where('status', 'published')
            ->orderBy('sort_order')
            ->orderBy('id');

        if ($request->has('page') && $request->query('page')) {
            $query->where('page', $request->query('page'));
        }

        return response()->json(['faqs' => $query->get()]);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    public function index()
    {
        $faqs = Faq::orderBy('page')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json(['faqs' => $faqs]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'question'   => 'required|string',
            'answer'     => 'required|string',
            'page'       => 'required|string|max:60',
            'sort_order' => 'nullable|integer',
            'status'     => 'nullable|in:draft,published',
        ]);

        $faq = Faq::create([
            'question'   => $request->input('question'),
            'answer'     => $request->input('answer'),
            'page'       => $request->input('page'),
            'sort_order' => (int) $request->input('sort_order', 0),
            'status'     => $request->input('status', 'published'),
        ]);

        return response()->json(['faq' => $faq], 201);
    }

    public function update(Request $request, Faq $faq)
    {
        $request->validate([
            'question'   => 'required|string',
            'answer'     => 'required|string',
            'page'       => 'required|string|max:60',
            'sort_order' => 'nullable|integer',
            'status'     => 'nullable|in:draft,published',
        ]);

        $faq->update([
            'question'   => $request->input('question'),
            'answer'     => $request->input('answer'),
            'page'       => $request->input('page'),
            'sort_order' => (int) $request->input('sort_order', $faq->sort_order),
            'status'     => $request->input('status', $faq->status),
        ]);

        return response()->json(['faq' => $faq->fresh()]);
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return response()->json(['message' => 'FAQ deleted successfully']);
    }
}
