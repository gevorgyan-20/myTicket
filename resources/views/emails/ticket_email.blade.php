<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
            <h1>Ձեր տոմսերը պատրաստ են!</h1>
        </div>
        <div class="content">
            <p>Ողջույն <span class="highlight">{{ $user->name }}</span>,</p>
            <p>Հիանալի նորություն: Ձեր վճարումը հաջողությամբ կատարվել է, և ձեր <span class="highlight">myTicket</span> տոմսերն արդեն պատրաստ են:</p>
            <p>Մենք կցել ենք ձեր պաշտոնական տոմսերը PDF ձևաչափով այս էլ. նամակին: Խնդրում ենք պահպանել դրանք և ներկայացնել միջոցառմանը:</p>
            <p>Դուք նաև կարող եք տեսնել ձեր պատվերների պատմությունը և դիտել տոմսերը ցանկացած ժամանակ՝ մուտք գործելով ձեր անձնական էջ:</p>
            
            <a href="{{ url('/profile') }}" class="button">Տեսնել իմ պրոֆիլը</a>
            
            <p style="margin-top: 30px; font-size: 14px;">Կհանդիպենք միջոցառմանը!<br><strong>myTicket թիմ</strong></p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} myTicket. Բոլոր իրավունքները պաշտպանված են:<br>
            Եթե ունեք հարցեր, խնդրում ենք կապվել մեր աջակցման թիմի հետ:
        </div>
    </div>
</body>
</html>
