<?php
$stats = json_decode(file_get_contents("database\infotecnica.json"), true);
$playlists = json_decode(file_get_contents("database\playlists.json"), true);

echo "<h1>Última playlist reproduïda:</h1>";
echo "<h2 style='color: blue'>" . $playlists[$stats['lastPlaylist']]['name'] . "</h2>";
echo "<h2 style='color: blue'>" . $stats['time'] . "</h2>";

echo "<h1>Playlists més reproduïdes:</h1>";
function comparePlaylists($a, $b) {
    return strcmp($a['name'], $b['name']);
}

usort($playlists, 'comparePlaylists');

$index = 1;
foreach ($playlists as $playlist) {
    $key = array_search($playlist, $playlists);
    echo "<h2 style='color: blue'>" . $playlist["name"] . " - " . $stats['mostPlayed'][$key]["times"] . " reproduccions</h2>";
    $index++;
}
?>
