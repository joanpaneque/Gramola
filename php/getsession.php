<?php
session_start();

// Retornar el nom d'usuari si existeix a la sessió, o "Anònim" si no
if (isset($_SESSION['username'])) {
    echo $_SESSION['username'];
} else {
    echo "Anònim";
}


?>