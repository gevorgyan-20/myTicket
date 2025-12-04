<!-- resources/views/movies/index.blade.php -->

<!DOCTYPE html>
<html lang="hy">
<head>
    <meta charset="UTF-8">
    <title>Ֆիլմերի ցանկ</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f2f2f2;
            padding: 40px;
        }
        .container {
            max-width: 800px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        h1 {
            margin-bottom: 20px;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        a {
            text-decoration: none;
            color: #007bff;
            font-size: 18px;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Ֆիլմերի ցանկ</h1>

        <ul>
            @foreach($movies as $movie)
                <li>
                    <a href="/movies/{{ $movie->id }}">
                        {{ $movie->title }} ({{ $movie->genre }})
                    </a>
                </li>
            @endforeach
        </ul>
    </div>
</body>
</html>
