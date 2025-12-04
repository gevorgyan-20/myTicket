<!DOCTYPE html>
<html lang="hy">
<head>
    <meta charset="UTF-8">
    <title>{{ $movie->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8fafc;
            padding: 40px;
        }
        .container {
            max-width: 700px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 28px;
            margin-bottom: 20px;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
        }
        a {
            display: inline-block;
            margin-top: 20px;
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{ $movie->title }}</h1>

        <p><strong>Տեսակ (ժանր):</strong> {{ $movie->genre }}</p>
        <p><strong>Տևողություն:</strong> {{ $durationInHours }}</p>

        @if($movie->description)
            <p><strong>Նկարագրություն:</strong> {{ $movie->description }}</p>
        @else
            <p><em>Նկարագրություն չկա։</em></p>
        @endif

        <a href="/movies">← Վերադառնալ ֆիլմերի ցանկին</a>
    </div>
</body>
</html>
