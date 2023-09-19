<?php

$config = require('./config.php');

// Maneig d'errors

// El fitxer de cançons no existeix
if (!file_exists($_SERVER['DOCUMENT_ROOT'] . $config['paths']['songs_json_path'])) {
    http_response_code(500);
    die(json_encode([
        'message' => $config['errors']['songs_json_not_found']
    ]));
}

// Aquesta variable s'utilitzarà tant com en el GET com en el POST
$songs = file_get_contents($_SERVER['DOCUMENT_ROOT'] . $config['paths']['songs_json_path']);


////////////////////
//   PETICIÓ GET  //
////////////////////

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    die($songs);
}