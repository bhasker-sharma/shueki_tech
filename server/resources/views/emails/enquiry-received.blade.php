<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Enquiry Received</title>
    <style>
        /* Reset */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
        }

        .email-wrapper {
            max-width: 640px;
            margin: 0 auto;
            padding: 24px 16px;
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
            color: #ffffff;
            padding: 32px 28px;
            border-radius: 12px 12px 0 0;
            text-align: center;
        }

        .header h1 {
            margin: 0 0 6px 0;
            font-size: 22px;
            font-weight: 700;
        }

        .header .subtitle {
            margin: 0;
            font-size: 14px;
            opacity: 0.85;
        }

        /* Body */
        .email-body {
            background: #ffffff;
            padding: 28px;
            border-radius: 0 0 12px 12px;
            border: 1px solid #e2e8f0;
            border-top: none;
        }

        /* Service Badge */
        .service-badge {
            display: inline-block;
            background: #eff6ff;
            color: #1e40af;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 20px;
            border: 1px solid #bfdbfe;
            margin-bottom: 20px;
        }

        /* Info Card */
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #1e40af;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .info-card h3 {
            margin: 0 0 16px 0;
            font-size: 15px;
            color: #1e40af;
            font-weight: 600;
        }

        .info-row {
            margin: 10px 0;
            font-size: 14px;
        }

        .info-row .label {
            font-weight: 600;
            color: #475569;
            display: inline-block;
            min-width: 100px;
        }

        .info-row .value {
            color: #1e293b;
        }

        /* Message Box */
        .message-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 16px 0;
            font-size: 14px;
            color: #334155;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        /* Meta Info */
        .meta-info {
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
        }

        .meta-info .meta-row {
            margin: 4px 0;
        }

        /* Action Button */
        .action-btn {
            display: inline-block;
            padding: 12px 28px;
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            margin: 20px 0;
        }

        /* Footer */
        .footer {
            text-align: center;
            margin-top: 24px;
            padding: 16px;
            font-size: 12px;
            color: #94a3b8;
        }

        .footer strong {
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <h1>New Enquiry Received</h1>
            <p class="subtitle">Someone has submitted an enquiry on your website</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <!-- Service Type Badge -->
            <div style="text-align: center;">
                <span class="service-badge">
                    {{ $serviceLabels[$enquiry->service_type] ?? $enquiry->service_type }}
                </span>
            </div>

            <!-- Contact Details -->
            <div class="info-card">
                <h3>Contact Details</h3>

                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ $enquiry->full_name }}</span>
                </div>

                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">
                        <a href="mailto:{{ $enquiry->email }}" style="color: #1e40af; text-decoration: none;">
                            {{ $enquiry->email }}
                        </a>
                    </span>
                </div>

                @if($enquiry->phone)
                <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value">{{ $enquiry->phone }}</span>
                </div>
                @endif

                @if($enquiry->company)
                <div class="info-row">
                    <span class="label">Company:</span>
                    <span class="value">{{ $enquiry->company }}</span>
                </div>
                @endif
            </div>

            <!-- Message -->
            <div class="info-card">
                <h3>Message</h3>
                <div class="message-box">{{ $enquiry->message }}</div>
            </div>

            <!-- Action -->
            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/admin/dashboard" class="action-btn">
                    View in Admin Panel
                </a>
            </div>

            <!-- Meta -->
            <div class="meta-info">
                <div class="meta-row"><strong>Submitted:</strong> {{ $enquiry->created_at->format('d M Y, h:i A') }}</div>
                @if($enquiry->ip_address)
                <div class="meta-row"><strong>IP Address:</strong> {{ $enquiry->ip_address }}</div>
                @endif
                <div class="meta-row"><strong>Enquiry ID:</strong> #{{ $enquiry->id }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Shueki Tech</strong> &mdash; Precision Engineering for Global Clients</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
