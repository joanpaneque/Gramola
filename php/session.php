<?php
session_start();


if (isset($_POST['username'])) {
    $username = $_POST['username'];
    $username = strip_tags($username);


    $_SESSION['username'] = $username;

    header('Location: ../index.html?username=' . $username);
    echo "Sessió iniciada correctament";
    exit();
} else {
    echo "No s'ha proporcionat nom d'usuari";
}

?>
