<?php

// Es comprova que la sol·licitud sigui vàlida
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["song"]) && isset($_FILES["cover"])) {

    $audioTargetDirectory = "/assets/audio/";
    $imageTargetDirectory = "/assets/images/";


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

        $audioTargetFile = $audioTargetDirectory . $audioFileName;
        $imageTargetFile = $imageTargetDirectory . $imageFileName;

        // Movem els fitxers a la ruta desitjada i ho fem en el mateix if per controlar els possibles errors que poden haver-hi
        if (move_uploaded_file($_FILES["song"]["tmp_name"], $audioTargetFile)) {
            if (move_uploaded_file($_FILES["cover"]["tmp_name"], $imageTargetFile)) {
                echo "Fitxers pujats exitosament.";
            } else {
                echo "Error al pujar el fitxer d'imatge.";
            }
        } else {
            echo "Error al pujar el fitxer d'audio.";
        }
    } else {
        echo "Format de fitxer no vàlid. Assegura't de que el fitxer d'audio és en format mp3 i el fitxer d'imatge és en format PNG";
    }
} else {
    echo "La sol·licitud no és vàlida.";
}
?>
