import Api from "./Api/api.js"
import Playlist from "./components/Playlist/Playlist.js";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.js";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("upload-form");
    
    form.addEventListener("submit", function (event) {
        // El preventDefault serveix perquè el form no redireccioni a la pàgina PHP 
        event.preventDefault();
        
        const formData = new FormData(form);
        
        fetch(form.action, {
            method: form.method,
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});

// Es carreguen totes les cançons i les playlists al carregar la aplicació.
// CONSIDERACIÓ: Aquest mètode és suficient per aquest projecte però no és una sol·lució escalable
export const playlists = await Api.get.playlists();
export const songs = await Api.get.songs();

// S'afegeix el reproductor d'audio al body
export const audioPlayer = new AudioPlayer(songs);
document.body.appendChild(audioPlayer.container);

// S'afegeixen totes les playlists al contenidor de playlists de index.html
const playlistsContainer = document.getElementById("playlists");
playlists.forEach(playlist => {
    let PL = new Playlist(playlist);
    playlistsContainer.appendChild(PL.container);
});