import Api from "./Api/api.js"
import Playlist from "./components/Playlist/Playlist.js";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.js"; 

// const modals = document.querySelectorAll("form.modal");

// modals.forEach(modal => {
//     document.body.addEventListener("click", () => {
//         modal.classList.toggle("open");
//         if (modal.classList.contains("open")) {
//             modal.style.animation = "";
//         } else {
//             modal.style.animation = "hideModal 0.2s ease forwards";
//         }
//     })

// })

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

const totesCançons = document.getElementById("totesCançons");
let PL = new Playlist({name: "Cançons", songs: -1});
totesCançons.appendChild(PL.container);




const form = document.getElementById("upload-form");
const songNameInput = document.getElementById("songname-input");
const songNameOutput = document.getElementById("songname-output")
const artistNameInput = document.getElementById("artistname-input");
const artistNameOutput = document.getElementById("artistname-output");
const songSubmit = document.getElementById("song-submit");

const songFileInput = document.getElementById("song-input");
const coverFileInput = document.getElementById("cover-input");

artistNameInput.addEventListener("input", () => validateSongInput());
songNameInput.addEventListener("input", () => validateSongInput());
songFileInput.addEventListener("input", () => validateSongInput());
coverFileInput.addEventListener("input", () => validateSongInput());

artistNameInput.value = "";
songNameInput.value = "";
artistNameOutput.innerHTML = "";
songNameOutput.innerHTML = "";

function validateSongInput() {    
    let valid = true;
    if (artistNameInput.value.length == 0) {
        artistNameOutput.innerHTML = "";
        valid = false;
    } else if (artistNameInput.value.length < 4) {
        artistNameOutput.innerHTML = `<span style="color: red">El nom de l'artista és massa curt</span>`;
        valid = false;
    } else {
        artistNameOutput.innerHTML = `<span style="color: lightgreen">Disponible</span>`;
    }

    if (songNameInput.value.length == 0) {
        songNameOutput.innerHTML = "";
        valid = false;
    } else if (songNameInput.value.length < 4) {
        songNameOutput.innerHTML = `<span style="color: red">El nom de la cançó és massa curt</span>`;
        valid = false;
    } else if (songs.map(song => song.title.toUpperCase()).includes(songNameInput.value.toUpperCase())) {
        songNameOutput.innerHTML = `<span style="color: red">El nom d'aquesta cançó no està disponible</span>`
        valid = false;
    } else {
        songNameOutput.innerHTML = `<span style="color: lightgreen">Disponible</span>`
    }

    if (songFileInput.files.length == 0) {
        valid = false;
    }

    if (coverFileInput.files.length == 0) {
        valid = false;
    }

    if (valid) {
        songSubmit.removeAttribute("disabled");
    } else {
        songSubmit.setAttribute("disabled","");
        songSubmit.disabled = true;
    }
}

const playlistNameInput = document.getElementById("playlistname-input");
const playlistNameOutput = document.getElementById("playlistname-output");
const playlistSubmit = document.getElementById("playlist-submit");

playlistNameInput.addEventListener("input", e => {
    if (e.target.value.length == 0) {
        playlistNameOutput.innerHTML = "";
        playlistSubmit.setAttribute("disabled","");
        playlistSubmit.disabled = true;
    } else if (e.target.value.length < 5) {
        playlistNameOutput.innerHTML = `<span style="color: red">El nom de la playlist és massa curt</span>`;
        playlistSubmit.setAttribute("disabled","");
        playlistSubmit.disabled = true;
    } else if (playlists.map(playlist => playlist.name.toUpperCase()).includes(e.target.value.toUpperCase())) {
        playlistNameOutput.innerHTML = `<span style="color: red">El nom d'aquesta playlist no està disponible</span>`;
        playlistSubmit.setAttribute("disabled","");
        playlistSubmit.disabled = true;
    } else {
        playlistNameOutput.innerHTML = `<span style="color: lightgreen">Nom de playlist disponible</span>`;
        playlistSubmit.removeAttribute("disabled");
    }
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    form.reset();
    songNameOutput.innerHTML = "";
    artistNameOutput.innerHTML = "";
    
    fetch(form.action, {
        method: form.method,
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.type == "song") {
            songs.push(data.newSong)
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});


window.addEventListener("resize", positionElements);
positionElements(true);

export function positionElements(redo) {


    const backgroundImage = document.querySelector("img.background");
    const aPlayer = document.querySelector(".AudioPlayer");
    const pContainer = document.querySelector("#dynamic-content");
    const discContainer = document.getElementById("disc-container");
    const discImage = document.getElementById("disc");
    const dynamicContentContainer = document.getElementById("dynamic-content");


    const bgRect = backgroundImage.getBoundingClientRect();
    const apRect = aPlayer.getBoundingClientRect();
    const discContainerRect = discContainer.getBoundingClientRect();


    const audioPlayerTop = bgRect.width * (720 / 1700);
    const imageHeight = bgRect.width * (800 / 1700);
    const playlistContainerTop = audioPlayerTop + apRect.height;
    const discContainerTop = audioPlayerTop - discContainerRect.height / 2 + bgRect.width * (75 / 1700);
    const dynamicContentHeight = bgRect.width * (600 / 1700);

    aPlayer.style.top = audioPlayerTop + "px";
    pContainer.style.top = playlistContainerTop + "px";
    discContainer.style.top = discContainerTop + "px";
    discImage.style.height = imageHeight + "px";
    dynamicContentContainer.style.height = dynamicContentHeight + "px"

    if (redo) {
        positionElements();
    }
}