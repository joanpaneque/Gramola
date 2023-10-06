<?php

// Es comprova que la sol·licitud sigui vàlida
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST["type"])) {
        if ($_POST["type"] == "playlist") {
            $playlists = json_decode(file_get_contents("..\database\playlists.json"), true);

            $playlistname = $_POST["playlistname"];
            $playlistsongs = $_POST["playlistsongs"];

            $newPlaylist = [
                "name" => $playlistname,
                "songs" => json_decode($playlistsongs)
            ];

            $playlists[] = $newPlaylist;
            $jsonContent = json_encode($playlists, JSON_PRETTY_PRINT);

            file_put_contents("..\database\playlists.json", $jsonContent);

        } else if ($_POST["type"] == "song" && isset($_FILES["song"]) && isset($_FILES["cover"])) {
            $audioTargetDirectory = "C:\Users\Joan\Documents\\2DAW\Gramola\assets\audio\\";
            $imageTargetDirectory = "C:\Users\Joan\Documents\\2DAW\Gramola\assets\images\\";
    
            // Funció que genera un nom de fitxer amb un hash random
            // El motiu d'aquesta funció és per fer que els fitxers que es pujin a dins del servidor tinguin un nom
            // diferent que els que els hi posen l'usuari per tal de que no facin coses malicioses
            function generateRandomFileName($ext) {
                $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                $length = 20;
                $randomString = "";
                for ($i = 0; $i < $length; $i++) {
                    $randomString .= $characters[rand(0, strlen($characters) - 1)];
                }
                return $randomString . '.' . $ext;
            }

            $audioFileExt = pathinfo($_FILES["song"]["name"], PATHINFO_EXTENSION);
            $imageFileExt = pathinfo($_FILES["cover"]["name"], PATHINFO_EXTENSION);
    
            // Comprovem que el fitxer d'audio sigui mp3 i el fitxer d'imatge sigui png
            if ($audioFileExt === "mp3" && $imageFileExt === "png") {
                $audioFileName = generateRandomFileName($audioFileExt);
                $imageFileName = generateRandomFileName($imageFileExt);
    
                $audioTargetFile = $audioTargetDirectory.$audioFileName;
                $imageTargetFile = $imageTargetDirectory.$imageFileName;

    
                if (move_uploaded_file($_FILES["song"]["tmp_name"], $audioTargetFile)) {
                    if (move_uploaded_file($_FILES["cover"]["tmp_name"], $imageTargetFile)) {

                        // Agregar la información al archivo JSON
                        $songname = $_POST["songname"];
                        $artistname = $_POST["artistname"];
                        $url = "assets\audio\\$audioFileName";
                        $cover = "assets\images\\$imageFileName";
    
                        // Leer el contenido actual de songs.json
                        $songs = json_decode(file_get_contents("..\database\songs.json"), true);
    
                        // Crear un nuevo objeto con la información y agregarlo al array
                        $newSong = [
                            "title" => $songname,
                            "artist" => $artistname,
                            "url" => $url,
                            "cover" => $cover
                        ];
    
                        $songs[] = $newSong;
    
                        // Codificar el array actualizado a JSON
                        $jsonContent = json_encode($songs, JSON_PRETTY_PRINT);
    
                        // Guardar el contenido en songs.json
                        file_put_contents("..\database\songs.json", $jsonContent);
    
                        echo json_encode([
                            "status" => "ok",
                            "error" => false,
                            "type" => "song",
                            "newSong" => $newSong
                        ]);
                        header("Location: ../index.html");
                    } else {
                        echo json_encode([
                            "status" => "Error al pujar el fitxer d'imatge.",
                            "error" => true,
                        ]);
                    }
                } else {
                    echo json_encode([
                        "status" => "Error al pujar el fitxer d'audio.",
                        "error" => true,
                    ]);
                }
            } else {
                echo json_encode([
                    "status" => "Format de fitxer no vàlid. Assegura't de que el fitxer d'audio és en format mp3 i el fitxer d'imatge és en format PNG",
                    "error" => true,
                ]);
            }
        } else {
            echo json_encode([
                "status" => "La sol·licitud no és vàlida.",
                "error" => true,
            ]);
        }
    }
}
?>