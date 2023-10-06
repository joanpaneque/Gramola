<?php


    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);


    print_r($data);

    $playlistId = $data['playlistId'];
    $time = time();

    $time = date("d/m/Y H:i:s", $time);
    
    $stats = json_decode(file_get_contents("..\database\infotecnica.json"), true);

    $stats['lastPlaylist'] = $playlistId;
    $stats['time'] = $time;

    if (isset($stats['mostPlayed'])) {
        if (isset($stats['mostPlayed'][$playlistId])) {
            $stats['mostPlayed'][$playlistId] += 1;
        } else {
            $stats['mostPlayed'][$playlistId] = 1;
        }
    }

    print_r($stats);

    $jsonContent = json_encode($stats, JSON_PRETTY_PRINT);

    file_put_contents("..\database\infotecnica.json", $jsonContent);

?>