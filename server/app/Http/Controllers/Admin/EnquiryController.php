<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\EnquiryComment;
use Illuminate\Http\Request;

class EnquiryController extends Controller
{
    public function enquiries(Request $request)
    {
        $serviceType = $request->get('service');
        $status = $request->get('status');

        $query = Enquiry::with('comments.user')->latest();

        if ($serviceType) {
            $query->where('service_type', $serviceType);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $enquiries = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $enquiries,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:new,read,closed',
        ]);

        $enquiry = Enquiry::findOrFail($id);
        $enquiry->status = $request->status;
        $enquiry->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $enquiry,
        ]);
    }

    public function addComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string|min:1',
        ]);

        Enquiry::findOrFail($id);

        $comment = EnquiryComment::create([
            'enquiry_type' => 'enquiry',
            'enquiry_id' => $id,
            'comment' => $request->comment,
            'user_id' => $request->user()->id,
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => $comment,
        ]);
    }

    public function delete($id)
    {
        $enquiry = Enquiry::findOrFail($id);

        EnquiryComment::where('enquiry_type', 'enquiry')
            ->where('enquiry_id', $id)
            ->delete();

        $enquiry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Enquiry deleted successfully',
        ]);
    }

    public function stats()
    {
        $serviceTypes = [
            'web-development',
            'machine-integration',
            'ai-pipelines',
            'pcb-designing',
            'app-development',
            'rd-consultancy',
            'general',
        ];

        $byService = [];
        foreach ($serviceTypes as $type) {
            $byService[$type] = [
                'total' => Enquiry::where('service_type', $type)->count(),
                'new' => Enquiry::where('service_type', $type)->where('status', 'new')->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total' => Enquiry::count(),
                'new' => Enquiry::where('status', 'new')->count(),
                'today' => Enquiry::whereDate('created_at', today())->count(),
                'by_service' => $byService,
                'recent' => Enquiry::latest()->take(10)->get(),
            ],
        ]);
    }
}
