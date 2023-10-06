<?php
session_start();

// Si s'ha proporcionat un nom d'usuari, guardar-lo a la sessió i redirigir a la pàgina principal
if (isset($_POST['username'])) {
    $username = $_POST['username'];
    // Eliminar etiquetes HTML i PHP
    $username = strip_tags($username);

    // Desar el nom d'usuari a la sessió
    $_SESSION['username'] = $username;

    // Redirigir a la pàgina principal
    header('Location: ../index.html?username=' . $username);
    echo "Sessió iniciada correctament";
    exit();
} else {
    echo "No s'ha proporcionat nom d'usuari";
}

?>
