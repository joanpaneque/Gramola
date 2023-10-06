<?php

    // Rebem les dades del client a traves de php://input
    // en comptes de $_POST degut a un error en la comunicació
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);


    // Desem les dades en variables
    $playlistId = $data['playlistId'];
    $time = time(); // Temps en segons des de 1970

    $time = date("d/m/Y H:i:s", $time); // Convertim el temps a un format llegible
    
    $stats = json_decode(file_get_contents("..\database\infotecnica.json"), true); // Obtenim les estadístiques

    // Actualitzem les estadístiques
    $stats['lastPlaylist'] = $playlistId;
    $stats['time'] = $time;

    // Si la playlist ja ha estat reproduïda, incrementem el nombre de reproduccions
    if (isset($stats['mostPlayed'])) {
        if (isset($stats['mostPlayed'][$playlistId])) {
            $stats['mostPlayed'][$playlistId] += 1;
        } else {
            $stats['mostPlayed'][$playlistId] = 1;
        }
    }


    $jsonContent = json_encode($stats, JSON_PRETTY_PRINT);

    file_put_contents("..\database\infotecnica.json", $jsonContent);

?>