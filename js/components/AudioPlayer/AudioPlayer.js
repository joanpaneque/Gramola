import { positionElements } from "../../app.js";
import Component from "../Component.js";

export default class AudioPlayer extends Component {
    constructor(songs) {
        super();
        this.songs = songs;
        this.playing = false;
        this.songId = 0;
        this.cache = {};
        this.loadSongs();
        this.loaded = false;


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
                        </div>
                    <div>
                </div>
            </div>
        `;

        this.reloadConstructor();


        setTimeout(() => {
            this.play();
            this.pause();
        });
    }

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

    loadSongs() {
        this.songs.forEach((song, idx) => {
            let audio = new Audio(song.url);
            this.cache[idx] = audio;
            this.cache[idx].addEventListener("timeupdate", () => {
                if (!this.playing) return;
                this.time.innerHTML = `${secondsToMMSS(this.getCurrentTime())} / ${secondsToMMSS(this.getDuration())}`;

                const progressbarRect = this.progressbar.getBoundingClientRect();

                this.positionThumb(progressbarRect.width * (this.getCurrentTime() / this.getDuration()) + progressbarRect.left, false);

            });

            this.cache[idx].addEventListener("ended", () => {
                if (this.mouseDown) return;
                this.stop();

                // this.positionThumb(0);
                // this.playing = false;
                // this.songId = null;
                // this.clearMediaSessionMetadata();
                // this.stopAllSongs();
                
                // this.reloadConstructor();
                // this.time.innerHTML = "--:-- / --:--"
            });
        });
    }




    play() {

        // this.songId = playlist.songs[0];
        // document.querySelectorAll(`[song-id]`).forEach(song => {
        //     song.classList.remove("primary-color");
        // });
        // document.querySelectorAll(`[song-id="${this.songId}"`).forEach(song => {
        //     song.classList.add("primary-color");
        // });
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
        this.clearMediaSessionMetadata();
        this.discImage.style.animation = "";

        // Position the progressbar thumb at the beginning
        this.positionThumb(0);
        // this.discImage.src = "#";
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
    }
}


function secondsToMMSS(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.round(seconds % 60);

    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
    var formattedSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds.toString();

    return formattedMinutes + ":" + formattedSeconds;
}