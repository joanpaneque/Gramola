import Api from "./Api/api.js"
import Playlist from "./components/Playlist/Playlist.js";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.js"; 


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


// Es crea una playlist amb totes les cançons i s'afegeix al contenidor de totes les cançons
const totesCançons = document.getElementById("totesCançons");
let PL = new Playlist({name: "Cançons", songs: -1});
totesCançons.appendChild(PL.container);


// Elements del DOM
const songform = document.getElementById("upload-song");
const songNameInput = document.getElementById("songname-input");
const songNameOutput = document.getElementById("songname-output")
const artistNameInput = document.getElementById("artistname-input");
const artistNameOutput = document.getElementById("artistname-output");
const songSubmit = document.getElementById("song-submit");
const songFileInput = document.getElementById("song-input");
const coverFileInput = document.getElementById("cover-input");


// Cada input té un event listener que crida a la funció validateSongInput per validar el formulari
artistNameInput.addEventListener("input", () => validateSongInput());
songNameInput.addEventListener("input", () => validateSongInput());
songFileInput.addEventListener("input", () => validateSongInput());
coverFileInput.addEventListener("input", () => validateSongInput());


// Al carregar la pàgina es deshabilita el botó de pujar cançó i es neteja el formulari
artistNameInput.value = "";
songNameInput.value = "";
artistNameOutput.innerHTML = "";
songNameOutput.innerHTML = "";

function validateSongInput() {  
    
    // S'utilitza la variable valid per saber si el formulari és vàlid o no
    // la variable és booleana i per defecte és true. A la que hi hagi un error, es canvia a false i es deshabilita el botó de pujar cançó
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


// Event listener del formulari de pujar cançó
songform.addEventListener("submit", function (event) {

    // Evita que es refresqui la pàgina
    event.preventDefault();

    const formData = new FormData(songform); // Convertim el formulari a un FormData per poder enviar-lo amb fetch
    songform.reset(); // Netejem el formulari
    songNameOutput.innerHTML = "";
    artistNameOutput.innerHTML = "";
    
    fetch(songform.action, {
        method: form.method, // utilitzem el mètode del formulari definit a index.html
        body: formData, // enviem el FormData al body de la petició
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


// Cada cop que es redimensiona la finestra, es crida a la funció positionElements
window.addEventListener("resize", positionElements);
// Quan es carrega la pàgina, es crida a la funció positionElements
positionElements(true);


// La funció position elements fa que depenent del tamany de la gramola
// els elements de la pàgina es posicionin correctament
export function positionElements(redo) {
    const backgroundImage = document.querySelector("img.background");
    const aPlayer = document.querySelector(".AudioPlayer");
    const pContainer = document.querySelector("#dynamic-content");
    const discContainer = document.getElementById("disc-container");
    const discImage = document.getElementById("disc");
    const dynamicContentContainer = document.getElementById("dynamic-content");

    // Es calculen les mides de cada element
    const bgRect = backgroundImage.getBoundingClientRect();
    const apRect = aPlayer.getBoundingClientRect();
    const discContainerRect = discContainer.getBoundingClientRect();


    // Es calculen les posicions de cada element
    const audioPlayerTop = bgRect.width * (720 / 1700);
    const imageHeight = bgRect.width * (800 / 1700);
    const playlistContainerTop = audioPlayerTop + apRect.height;
    const discContainerTop = audioPlayerTop - discContainerRect.height / 2 + bgRect.width * (75 / 1700);
    const dynamicContentHeight = bgRect.width * (700 / 1700);


    // S'apliquen les mides i posicions calculades a cada element
    aPlayer.style.top = audioPlayerTop + "px";
    pContainer.style.top = playlistContainerTop + "px";
    discContainer.style.top = discContainerTop + "px";
    discImage.style.height = imageHeight + "px";
    dynamicContentContainer.style.height = dynamicContentHeight + "px"

    // Si redo és true, es crida a la funció positionElements.
    if (redo) {
        positionElements();
    }
}


// Gestió de modals
const songAddButton = document.getElementById("song-add");
songAddButton.addEventListener("click", () => {
    const songModal = document.getElementById("upload-song");

    songModal.classList.toggle("open");
})

const playlistAddButton = document.getElementById("playlist-add");

playlistAddButton.addEventListener("click", () => {
    const playlistModal = document.getElementById("upload-playlist");

    playlistModal.classList.toggle("open");
});

const playlistForm = document.getElementById("upload-playlist");
const playlistSongs = document.getElementById("playlist-songs");


// Event listener del formulari de pujar playlist
playlistForm.addEventListener("submit", e => {
    // Evita que es refresqui la pàgina
    e.preventDefault();

    const formData = new FormData(playlistForm);
    playlistForm.reset();

    fetch(playlistForm.action, {
        method: playlistForm.method,
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        location.reload();
    })
});

playlistSongs.innerHTML = "";

// Es creen els checkbox de cada cançó i s'afegeixen al formulari de pujar playlist
const inputHiddenSongs = document.getElementById("playlist-songs-array");

// Les cançons seleccionades es guarden en un input hidden per poder enviar-les amb el formulari
inputHiddenSongs.value = "[]";

songs.forEach((song, idx) => {
    let songContainer = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    
    input.type = "checkbox";
    input.name = "songs[]";
    input.value = idx;
    input.classList.add("song-checkbox");
    label.innerHTML += song.title;
    songContainer.appendChild(input);
    songContainer.appendChild(label);
    playlistSongs.appendChild(songContainer);

    // Quan es selecciona una cançó, s'afegeix al input hidden
    input.addEventListener("change", e => {
        console.log(e.target);
        let songs = JSON.parse(inputHiddenSongs.value);
        if (e.target.checked) {
            songs.push(e.target.value);
        } else {
            songs.splice(songs.indexOf(e.target.value), 1);
        }

        inputHiddenSongs.value = JSON.stringify(songs);
    });
})


// Cada cop que es fa click dret a una cançó, es crida a la funció deleteSong
// que envia una petició a deleteSong.php per eliminar la cançó de la base de dades
document.querySelectorAll(".Playlist__song").forEach(song => {
    song.addEventListener("contextmenu", e => {
        const songId = song.getAttribute("song-id");

        var xhr = new XMLHttpRequest();
        var url = "php/deleteSong.php";
        var params = JSON.stringify({ songId: songId });
        
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
                location.reload();
            }
        };

        xhr.send(params);


    });
})

const username = document.getElementById("username");

// Obté el nom d'usuari de la url i el mostra a la pàgina
const urlParams = new URLSearchParams(window.location.search);
const usernameParam = urlParams.get('username');

if (usernameParam) {
    username.innerHTML = usernameParam;
} else {

    fetch("php/getsession.php")
    .then(response => response.text())
    .then(data => {
        // El mateix PHP retorna 'Anònim' si no hi ha cap sessió iniciada
        username.innerHTML = data;
    })
}