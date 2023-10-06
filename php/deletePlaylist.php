<?php
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (isset($data['playlistId']) && !empty($data['playlistId'])) {
    $playlistId = $data['playlistId'];

    $playlists = json_decode(file_get_contents("..\database\playlists.json"), true);
    
    unset($playlists[$playlistId]);


    $jsonContent = json_encode($playlists, JSON_PRETTY_PRINT);

    file_put_contents("..\database\playlists.json", $jsonContent);

    echo "Done";
} else {
    echo "Error.";
}

?>
