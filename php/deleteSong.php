<?php

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (isset($data['songId']) && !empty($data['songId'])) {
    $songId = $data['songId'];

    $songs = json_decode(file_get_contents("..\database\songs.json"), true);

    if (isset($songs[$songId])) {
        unset($songs[$songId]);

        // Convertir array asociatiu a numèric
        $songs = array_values($songs);

        $jsonContent = json_encode($songs, JSON_PRETTY_PRINT);

        file_put_contents("..\database\songs.json", $jsonContent);

        echo "OK";
    } else {
        echo "Error: No s'ha trobat la cançó";
    }
} else {
    echo "Error: Input invalid";
}
?>
