<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Ձեր տոմսը</title>
    <style>
        @page {
            margin: 0;
        }
        * {
            font-family: "DejaVu Sans", sans-serif !important;
        }
        body, table, td, span, div, h1, h2, h3, p {
            font-family: "DejaVu Sans", sans-serif !important;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #0f172a; /* Deep dark background */
            color: #f1f5f9;
        }
        .ticket-wrapper {
            padding: 40px;
        }
        .ticket {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background-color: #1e293b;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid #334155;
            position: relative;
        }
        .ticket-header {
            background: linear-gradient(to right, #6366f1, #a855f7, #ec4899);
            padding: 30px;
            text-align: center;
        }
        .ticket-header h1 {
            margin: 0;
            font-size: 26px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 900;
            color: #ffffff;
        }
        .ticket-body {
            padding: 40px;
            position: relative;
        }
        .event-title {
            font-size: 28px;
            font-weight: bold;
            color: #818cf8;
            margin-bottom: 20px;
            border-bottom: 2px solid #334155;
            padding-bottom: 10px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 20px 0;
            vertical-align: top;
        }
        .label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 5px;
            display: block;
        }
        .value {
            font-size: 18px;
            font-weight: 600;
            color: #f8fafc;
        }
        .divider {
            border-top: 2px dashed #334155;
            margin: 20px 0;
            position: relative;
        }
        .divider:before, .divider:after {
            content: '';
            position: absolute;
            top: -15px;
            width: 30px;
            height: 30px;
            background-color: #0f172a;
            border-radius: 50%;
        }
        .divider:before { left: -55px; }
        .divider:after { right: -55px; }

        .ticket-footer {
            background-color: #0f172a;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #334155;
        }
        .barcode-area {
            text-align: center;
            padding: 20px 0;
        }
        .barcode-text {
            font-family: monospace;
            font-size: 20px;
            letter-spacing: 10px;
            color: #6366f1;
        }
        .scan-instruction {
            font-size: 10px;
            color: #64748b;
            margin-top: 5px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    @foreach($tickets as $ticket)
    <div class="ticket-wrapper">
        <div class="ticket">
            <div class="ticket-header">
                <h1>ՄՈՒՏՔԻ ՏՈՄՍ</h1>
            </div>
            
            <div class="ticket-body">
                <div class="event-title">{{ $ticket->event_title }}</div>
                
                <table class="info-table">
                    <tr>
                        <td width="60%">
                            <span class="label">Ամսաթիվ և Ժամ</span>
                            <div class="value">
                                @if($ticket->showtime)
                                    {{ \Carbon\Carbon::parse($ticket->showtime->start_time)->translatedFormat('l, F d, Y') }}<br>
                                    <span style="color: #818cf8; font-size: 22px;">{{ \Carbon\Carbon::parse($ticket->showtime->start_time)->format('H:i') }}</span>
                                @else
                                    -
                                @endif
                            </div>
                        </td>
                        <td width="40%">
                            <span class="label">Վայր</span>
                            <div class="value">{{ $ticket->showtime->venue->name ?? '-' }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label">Տեղեկություն տեղի մասին</span>
                            <div class="value" style="color: #fbbf24; font-size: 22px;">
                                @if($ticket->seat)
                                    Շարք {{ $ticket->seat->row }}, Տեղ {{ $ticket->seat->number }}
                                @elseif($ticket->venueSeat)
                                    {{ $ticket->venueSeat->label ?: 'Ընդհանուր մուտք' }}
                                @else
                                    -
                                @endif
                            </div>
                        </td>
                        <td>
                            <span class="label">Գին</span>
                            <div class="value">{{ number_format($ticket->price, 0) }} AMD</div>
                        </td>
                    </tr>
                </table>

                <div class="divider"></div>

                <table class="info-table">
                    <tr>
                        <td width="50%">
                            <span class="label">Մասնակից</span>
                            <div class="value">{{ $ticket->buyer_name ?: $ticket->user->name }}</div>
                        </td>
                        <td width="50%" align="right">
                            <span class="label">Տոմսի ID</span>
                            <div class="value" style="font-family: monospace;">#{{ str_pad($ticket->id, 8, '0', STR_PAD_LEFT) }}</div>
                        </td>
                    </tr>
                </table>

                <div class="barcode-area">
                    <div class="barcode-text">*{{ $ticket->id }}*</div>
                    <div class="scan-instruction">ՍԿԱՆԱՎՈՐԵՔ ԱՅՍ ԿՈԴԸ ՄՈՒՏՔԻ ՄՈՏ</div>
                </div>
            </div>

            <div class="ticket-footer">
                <div style="font-size: 12px; color: #94a3b8;">
                    Այս տոմսը եզակի է և վավեր է մեկանգամյա մուտքի համար: Միջոցառման մեկնարկից հետո վերադարձ չի իրականացվում:
                </div>
            </div>
        </div>
    </div>
    @if(!$loop->last)
        <div class="page-break"></div>
    @endif
    @endforeach
</body>
</html>
