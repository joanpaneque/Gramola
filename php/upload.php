<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"])) {
    $targetDirectory = "C:/audios"; // Change this to the desired directory
    $targetFile = $targetDirectory . basename($_FILES["file"]["name"]);

    print_r($_FILES);
    
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
        echo "File uploaded successfully.";
    } else {
        echo "Error uploading file.";
    }
} else {
    echo "Invalid request.";
}
?>
