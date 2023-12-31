import { positionElements } from "../../app.js";
import Component from "../Component.js";

export default class AudioPlayer extends Component {
    constructor(songs) {
        super();
        
        this.songs = songs;
        this.playing = false;   // Control de reproducció
        this.songId = 0;        // Cançó actual
        this.cache = {};        // Cache de les cançons on es guarden els objectes Audio
        this.loadSongs();       // Carregar les cançons a la cache
        this.loaded = false;    // Control de si les cançons estan carregades


        // HTML del component
        this.html = `
            <div class="AudioPlayer">
                <div class="AudioPlayer__info">
                    <div class="art-box">
                        <img src="assets\\images\\no-image.png">
                    </div>
                </div>
                <div class="AudioPlayer__player disabled">
                    <div class="status-box"></div>
                    <div class="AudioPlayer__progressbar__container">
                        <div class="AudioPlayer__progressbar">
                            <div class="AudioPlayer__progressbar__progress"></div>
                            <!--<div class="AudioPlayer__progressbar__thumb"></div>-->
                        </div>
                    </div>
                    <div class="controls-box">
                        <div class="AudioPlayer__time">--:-- / --:--</div>
                        <div class="AudioPlayer__buttons">
                            <div class="AudioPlayer__backwardsbutton"><img src="assets\\images\\svg\\rewind.svg"></div>
                            <div class="AudioPlayer__playbutton"><img src="assets\\images\\svg\\play.svg"></div>
                            <div class="AudioPlayer__stopbutton"><img src="assets\\images\\svg\\stop.svg"></div>
                            <div class="AudioPlayer__forwardbutton"><img src="assets\\images\\svg\\forward.svg"></div>
                            <div class="AudioPlayer__randombutton"><img src="assets\\images\\svg\\random.svg"></div>
                        </div>
                    <div>
                </div>
            </div>
        `;

        // Inicialitzar el component
        // (S'utilitza un mètode per poder actualitzar el component les vegades que es vulgui)
        this.reloadConstructor();


        // Reproduir la primera cançó
        setTimeout(() => {
            this.play();
            this.pause();
        });
    }

    // Funció per a posicionar la linia de la progressbar
    positionThumb = (x, update = true) => {

        const progressbarRect = this.progressbar.getBoundingClientRect();
        this.barX = x - progressbarRect.left;
        if (this.barX < 0) this.barX = 0;
        if (this.barX > progressbarRect.width) this.barX = progressbarRect.width;
        // this.progressbarThumb.style.left = `${progressbarRect.left + this.barX}px`;
        this.progressbarProgress.style.width = `${this.barX}px`;

        if (update) {
            this.setCurrentTime((this.barX / progressbarRect.width) * this.getDuration());
        }
    }

    // Es carreguen les cançons a la cache
    loadSongs() {
        this.songs.forEach((song, idx) => {
            let audio = new Audio(song.url);
            this.cache[idx] = audio;
            // Cada cop que es carrega una cançó, es crea un event listener per a actualitzar el temps
            this.cache[idx].addEventListener("timeupdate", () => {
                if (!this.playing) return;
                this.time.innerHTML = `${secondsToMMSS(this.getCurrentTime())} / ${secondsToMMSS(this.getDuration())}`;
                const progressbarRect = this.progressbar.getBoundingClientRect();
                this.positionThumb(progressbarRect.width * (this.getCurrentTime() / this.getDuration()) + progressbarRect.left, false);

            });

            // Quan acaba la cançó, es para
            this.cache[idx].addEventListener("ended", () => {
                if (this.mouseDown) return;
                this.stop();
            });
        });
    }

    play(playlist) {
        // Si hi ha una playlist, cada cop que es fa play, es guarda a la base de dades
        // la reproducció de la playlist
        if (this.playlist) {
            var xhr = new XMLHttpRequest();
            var url = "php/saveLastPlaylist.php";
            var params = JSON.stringify({ playlistId: 0 });

            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(params);
        }

        // Si hi ha una playlist, es guarda a la variable playlist
        if (playlist) {
            this.playlist = playlist;
            if (!this.playing) {

                if (this.random) {
                    if (this.playlist.songs.length > 1) {
                        let oldSongId = this.songId;
                        let playlistSongsIds = this.playlist.songs;
                        // S'escull una cançó aleatoria de la playlist
                        do {
                            this.songId = playlistSongsIds[Math.floor(Math.random() * playlistSongsIds.length)];
                        }
                        while (this.songId == oldSongId);
                    }
                }
            }
        }

        const allSongs = document.querySelectorAll(`[song-id]`);
        allSongs.forEach(song => {
            song.querySelectorAll(".Playlist__song__text").forEach(text => text.classList.remove("playing"));
            if (song.getAttribute("song-id") == this.songId) {
                console.log(song.querySelectorAll(".Playlist__song__text"));
                song.querySelectorAll(".Playlist__song__text").forEach(text => text.classList.add("playing"));
                
                // Set the playbutton to pause
                song.querySelector(".Playlist__song__cover__overlay__play").style.display = "none";
                song.querySelector(".Playlist__song__cover__overlay__pause").style.display = "block";
            }
        });

        let play_icon = `<div class="music-icon"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>`;
        this.player.classList.remove("disabled");

        if (this.songId === null) return false;
        document.title = `${this.songs[this.songId].artist} - ${this.songs[this.songId].title}`;
        this.setMediaSessionMetadata(this.songs[this.songId]);
        this.playing = true;
        if (this.loaded) {
            this.cache[this.songId].play();
        }
        this.playbutton.innerHTML = `<img src="assets\\images\\svg\\pause.svg">`;
        this.infoText.innerHTML = `
            <div class="status-box__child">${play_icon}Reproduint <strong>${this.songs[this.songId].title} - ${this.songs[this.songId].artist}</strong>${play_icon}</div>
            <div class="status-box__child">${play_icon}Reproduint <strong>${this.songs[this.songId].title} - ${this.songs[this.songId].artist}</strong>${play_icon}</div>
        `;

        const [text1, text2] = document.querySelectorAll(".status-box__child");

        if (this.text1left == undefined) {
            this.text1left = 0;
        }

        if (this.text2left == undefined) {
            this.text2left = 0;
        }

        const cR = this.infoText.getBoundingClientRect();
        const tR = text1.getBoundingClientRect();

        this.text2left = cR.width - tR.width;
        const speed = 0.5;

        let oldSongId = this.songId;

        let animate = () => {
            this.text1left -= speed;
            this.text2left -= speed;
            text1.style.left = `${this.text1left}px`;
            text2.style.left = `${this.text2left}px`;

            const progressbarRect = this.progressbar.getBoundingClientRect();
            this.positionThumb(progressbarRect.width * (this.getCurrentTime() / this.getDuration()) + progressbarRect.left, false);

            if (this.text2left < -tR.width) {
                this.text1left = 0;
                this.text2left = cR.width - tR.width;
            }
            if (this.playing && this.songId == oldSongId) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        this.infoCover.innerHTML = `
            <img src="${this.songs[this.songId].cover}">
        `;

        this.discImage.src = this.songs[this.songId].cover;
        this.discImage.style.animation = "girar 8s linear infinite";
        this.animationStarted = new Date().getTime();
        
        positionElements(true);
        this.loaded = true;
    }

    stop() {
        if (this.songId === null) return false;
        document.title = "Gramola";
        this.playing = false;
        this.pause();
        this.cache[this.songId].currentTime = 0;
        this.cache[this.songId].pause();
        this.clearMediaSessionMetadata();
        this.discImage.style.animation = "";

        this.positionThumb(0);
        
        this.time.innerHTML = `00:00 / ${secondsToMMSS(this.getDuration())}`;
        positionElements(true);
        // this.reloadConstructor();
        // this.stopAllSongs();
    }

    pause() {
        if (this.songId === null) return false;
        this.playing = false;
        this.cache[this.songId].pause();
        this.playbutton.innerHTML = `<img src="assets\\images\\svg\\play.svg">`;
        document.querySelectorAll(".music-icon").forEach(icon => {
            icon.classList.add("hidden");
        });
        this.discImage.style.animation = "";
        this.discImage.style.transform = `rotate(${(new Date().getTime() - this.animationStarted) / 1000 / 8 * 360}deg)`

    }

    getCurrentTime() {
        if (this.songId === null) return false;
        return this.cache[this.songId].currentTime;
    }

    setCurrentTime(time) {
        if (this.songId === null) return false;

        // Comprovar si la cançó està carregada
        if (this.cache[this.songId].readyState === 0) {
            return false;
        } else {
            this.cache[this.songId].currentTime = time;
        }
    }

    getDuration() {
        if (this.songId === null) return false;
        return this.cache[this.songId].duration;
    }

    setMediaSessionMetadata(song) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist + " | Projecte Gramola",
                artwork: [
                    { src: song.cover, sizes: '96x96', type: 'image/jpeg' },
                ],
            });
        }
    }

    clearMediaSessionMetadata() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = null;
        }
    }

    stopAllSongs() {
        this.player.classList.add("disabled");
        this.playbutton.innerHTML = `<img src="assets\\images\\svg\\play.svg">`;
        const playButtons = document.querySelectorAll(".Playlist__song__cover__overlay__play");
        const pauseButtons = document.querySelectorAll(".Playlist__song__cover__overlay__pause");

        playButtons.forEach(button => {
            button.style.display = "block";
        });

        pauseButtons.forEach(button => {
            button.style.display = "none";
        });
    }

    reloadConstructor() {
        this.container.innerHTML = this.html;

        this.random = false;

        this.playlist;

        this.text1left;
        this.text2left;
        this.time = this.container.querySelector(".AudioPlayer__time");
        this.player = this.container.querySelector(".AudioPlayer__player");
        this.progressbar = this.container.querySelector(".AudioPlayer__progressbar");
        this.progressbarProgress = this.container.querySelector(".AudioPlayer__progressbar__progress");
        // this.progressbarThumb = this.container.querySelector(".AudioPlayer__progressbar__thumb");
        this.mouseDown = false;
        this.progressbar.addEventListener("click", e => this.positionThumb(e.clientX));
        this.progressbar.addEventListener("mousedown", e => {
            this.mouseDown = true;
            this.positionThumb(e.clientX);
        });
        this.stopbutton = this.container.querySelector(".AudioPlayer__stopbutton");
        this.stopbutton.addEventListener("click", () => {
            this.stop();
            document.querySelectorAll(".playing").forEach(song => {
                song.classList.remove("playing");
            })
        });
        this.barX = 0;
        setTimeout(() => {
            this.positionThumb(0);
        })
        window.addEventListener("mouseup", () => {
            this.mouseDown = false;
        });
        window.addEventListener("mousemove", e => {
            if (this.mouseDown) {
                this.positionThumb(e.clientX);
            }
        });
        this.playbutton = this.container.querySelector(".AudioPlayer__playbutton");
        this.playbutton.addEventListener("click", () => {
            if (this.playing) {
                this.pause();
            } else {
                if (this.songId == null) this.songId = 0;
                this.play();
            }
        })

        this.infoText = this.container.querySelector(".status-box");
        this.infoCover = this.container.querySelector(".art-box");
        this.discImage = document.getElementById("disc");
        this.randomButton = this.container.querySelector(".AudioPlayer__randombutton");

        this.randomButton.addEventListener("click", () => {
            this.random = !this.random;

            this.randomButton.classList.toggle("active");

            if (this.random) {
                this.enableForward();
            } else {
                // Check if we are at the last song of the playlist
                if (this.playlist.songs.indexOf(this.songId) == this.playlist.songs.length - 1) {
                    this.disableForward();
                }
            }
        });

        this.nextButton = this.container.querySelector(".AudioPlayer__forwardbutton");
        this.backwardsbutton = this.container.querySelector(".AudioPlayer__backwardsbutton");

        this.nextButton.addEventListener("click", () => {

            // Stop the current song
            this.stop();
    
            if (this.random) {
                if (this.playlist) {
                    let oldSongId = this.songId;
                    do {
                        this.songId = this.playlist.songs[Math.floor(Math.random() * this.playlist.songs.length)];
                    } while (this.songId == oldSongId);
                } else {
                    this.songId = Math.floor(Math.random() * this.songs.length);
                }
                this.stop();
                this.play();
            } else {
                console.log(this.playlist);
                if (this.playlist) {
                    // Si estem a la ultima cançó de la playlist, no fer res
                    if (this.playlist.songs.indexOf(this.songId) == this.playlist.songs.length - 1) return this.disableForward();
                    // Si no, reproduir la següent cançó
                    this.songId = this.playlist.songs[this.playlist.songs.indexOf(this.songId) + 1];
                    this.stop();
                    this.play();
                    // Si estem a la ultima cançó de la llista de cançons fer console.log ultima cançó
                    if (this.playlist.songs.indexOf(this.songId) == this.playlist.songs.length - 1) {
                        this.disableForward();
                    }
                }
            }
        });

        this.backwardsbutton.addEventListener("click", () => {
            // Stop the current song
            if (this.playlist) {
                console.log("hey");
                console.log(this.songId);

                if (this.playlist.songs[0] == this.playlist.songs[this.playlist.songs.indexOf(this.songId)]) return;
                let previous = this.playlist.songs[this.playlist.songs.indexOf(this.songId) - 1]
                if (previous == undefined) return;

                this.songId = previous;
                this.stop();
                this.play();
                this.enableForward();
            }
        });
    }

    

    disableForward() {
        const forwardButton = document.querySelector(".AudioPlayer__forwardbutton");
        forwardButton.style.opacity = "0.5";
        forwardButton.style.cursor = "default";
        forwardButton.style.pointerEvents = "none";
    }

    enableForward() {
        const forwardButton = document.querySelector(".AudioPlayer__forwardbutton");
        forwardButton.style.opacity = "1";
        forwardButton.style.cursor = "pointer";
        forwardButton.style.pointerEvents = "all";
    }
}

function secondsToMMSS(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.round(seconds % 60);

    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds.toString();

    return formattedMinutes + ":" + formattedSeconds;
}