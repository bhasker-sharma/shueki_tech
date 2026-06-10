<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanySetting;
use Illuminate\Http\Request;

class CompanySettingController extends Controller
{
    private array $defaults = [
        'company_name' => 'Shueki Tech',
        'tagline'      => 'Software for Connected Products and Operations',
        'address'      => 'Opp. UCO Bank, Ground Floor, Hoshiarpur Road',
        'city'         => 'Garhshankar, Punjab – 144527',
        'phone'        => '+91-84271-82071',
        'email'        => '',
        'website'      => 'https://shuekitech.com',
        'gst_number'   => '',
    ];

    public function show()
    {
        $settings = CompanySetting::first();

        if (!$settings) {
            return response()->json(['settings' => $this->defaults]);
        }

        return response()->json(['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'tagline'      => 'nullable|string|max:255',
            'address'      => 'nullable|string',
            'city'         => 'nullable|string|max:150',
            'phone'        => 'nullable|string|max:30',
            'email'        => 'nullable|email|max:255',
            'website'      => 'nullable|url|max:255',
            'gst_number'   => 'nullable|string|max:30',
        ]);

        $settings = CompanySetting::updateOrCreate(
            ['id' => 1],
            [
                'company_name' => $request->input('company_name'),
                'tagline'      => $request->input('tagline'),
                'address'      => $request->input('address'),
                'city'         => $request->input('city'),
                'phone'        => $request->input('phone'),
                'email'        => $request->input('email'),
                'website'      => $request->input('website'),
                'gst_number'   => $request->input('gst_number'),
            ]
        );

        return response()->json(['settings' => $settings]);
    }
}
