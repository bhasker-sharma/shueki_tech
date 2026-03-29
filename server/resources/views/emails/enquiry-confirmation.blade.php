<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enquiry Confirmation — Shueki Tech</title>
    <style>
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

        .email-body {
            background: #ffffff;
            padding: 28px;
            border-radius: 0 0 12px 12px;
            border: 1px solid #e2e8f0;
            border-top: none;
        }

        .greeting {
            font-size: 16px;
            color: #1e293b;
            margin-bottom: 16px;
        }

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

        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #1e40af;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }

        .info-card h3 {
            margin: 0 0 12px 0;
            font-size: 15px;
            color: #1e40af;
            font-weight: 600;
        }

        .info-row {
            margin: 8px 0;
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

        .message-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 8px 0 0 0;
            font-size: 14px;
            color: #334155;
            white-space: pre-wrap;
            word-wrap: break-word;
        }

        .promise-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-left: 4px solid #16a34a;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 20px 0;
            font-size: 14px;
            color: #15803d;
        }

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

        .footer a {
            color: #1e40af;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
            <h1>Thank You for Reaching Out!</h1>
            <p class="subtitle">We have received your enquiry and will get back to you shortly</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <p class="greeting">Hi {{ $enquiry->full_name }},</p>
            <p style="font-size: 14px; color: #475569;">
                Thank you for contacting <strong>Shueki Tech</strong>. We have successfully received your enquiry regarding:
            </p>

            <div style="text-align: center;">
                <span class="service-badge">
                    {{ $serviceLabels[$enquiry->service_type] ?? $enquiry->service_type }}
                </span>
            </div>

            <!-- Summary of what they submitted -->
            <div class="info-card">
                <h3>Your Enquiry Summary</h3>

                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">{{ $enquiry->full_name }}</span>
                </div>

                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">{{ $enquiry->email }}</span>
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

                <div class="info-row" style="margin-top: 12px;">
                    <span class="label" style="display: block; margin-bottom: 6px;">Your Message:</span>
                    <div class="message-box">{{ $enquiry->message }}</div>
                </div>
            </div>

            <!-- What happens next -->
            <div class="promise-box">
                Our team will review your enquiry and get back to you within <strong>1–2 business days</strong>.
                If you need urgent assistance, you can also reach us directly at
                <a href="mailto:info@shuekitech.com" style="color: #15803d; font-weight: 600;">info@shuekitech.com</a>.
            </div>

            <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
                Enquiry Reference: <strong>#{{ $enquiry->id }}</strong> &mdash;
                Submitted on {{ $enquiry->created_at->format('d M Y, h:i A') }}
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Shueki Tech</strong> &mdash; Precision Engineering for Global Clients</p>
            <p>Bangalore, Karnataka, India &mdash; <a href="mailto:info@shuekitech.com">info@shuekitech.com</a></p>
            <p style="margin-top: 8px; color: #cbd5e1;">This is an automated confirmation. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
