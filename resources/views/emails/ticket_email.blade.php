<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .wrapper {
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #6366f1, #a855f7);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px;
        }
        .content p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #475569;
        }
        .highlight {
            color: #6366f1;
            font-weight: 700;
        }
        .footer {
            padding: 30px;
            background-color: #f1f5f9;
            text-align: center;
            font-size: 13px;
            color: #64748b;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #6366f1;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Your Tickets are Ready!</h1>
        </div>
        <div class="content">
            <p>Hello <span class="highlight">{{ $user->name }}</span>,</p>
            <p>Great news! Your payment was successful and your tickets for <span class="highlight">myTicket</span> are now ready for you.</p>
            <p>We've attached your official tickets as a PDF to this email. Please keep them safe and bring them with you to the event.</p>
            <p>You can also access your order history and view your tickets at any time by logging into your dashboard.</p>
            
            <a href="{{ url('/profile') }}" class="button">View My Profile</a>
            
            <p style="margin-top: 30px; font-size: 14px;">See you at the event!<br><strong>The myTicket Team</strong></p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} myTicket. All rights reserved.<br>
            If you have any questions, please contact our support team.
        </div>
    </div>
</body>
</html>
