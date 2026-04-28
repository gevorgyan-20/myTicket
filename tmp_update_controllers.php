<?php

$files = [
    'app/Http/Controllers/MovieController.php',
    'app/Http/Controllers/ConcertController.php',
    'app/Http/Controllers/StandupController.php'
];

foreach ($files as $file) {
    $path = 'c:/Users/Dell/OneDrive/Рабочий стол/myTicket/' . $file;
    if (file_exists($path)) {
        $content = file_get_contents($path);
        
        // Add price to validation in store() and update()
        // We look for 'venue_id' line and append 'price' line after it
        $content = preg_replace(
            "/'venue_id'\s+=>\s+'nullable\|exists:venues,id',/",
            "'venue_id'    => 'nullable|exists:venues,id',\n            'price'       => 'nullable|numeric|min:0',",
            $content
        );
        
        file_put_contents($path, $content);
        echo "Updated $file\n";
    } else {
        echo "File not found: $path\n";
    }
}
