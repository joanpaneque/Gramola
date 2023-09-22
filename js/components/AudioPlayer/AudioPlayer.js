import Component from "../Component.js";

export default class AudioPlayer extends Component {
    constructor(songs) {
        super();
        this.songs = songs;
        this.playing = false;
        this.songId = null;
        this.cache = {};
        this.loadSongs();

        this.html = `
            <input type="range" class="AudioPlayer__progress" min="0" max="10000" value="0">
        `;

        this.container.innerHTML = this.html;

        this.progress = this.container.querySelector(".AudioPlayer__progress");

        this.progress.addEventListener("input", () => {
            const currentTime = (this.progress.value / 10000) * this.getDuration();
            this.setCurrentTime(currentTime);
        });
    }

    loadSongs() {
        this.songs.forEach((song, idx) => {
            let audio = new Audio(song.url);
            this.cache[idx] = audio;
            this.cache[idx].addEventListener("timeupdate", () => {
                this.progress.value = (this.getCurrentTime() / this.getDuration()) * 10000;
            });

            this.cache[idx].addEventListener("ended", () => {
                this.progress.value = 0;
                this.playing = false;
                this.songId = null;
                this.clearMediaSessionMetadata();
            });
        });
    }

    play() {
        if (this.songId === null) return false;
        document.title = `${this.songs[this.songId].artist} - ${this.songs[this.songId].title}`;
        this.setMediaSessionMetadata(this.songs[this.songId]);

        this.playing = true;
        this.cache[this.songId].play();
    }

    stop() {
        if (this.songId === null) return false;
        document.title = "Gramola";
        this.playing = false;
        this.cache[this.songId].pause();
        this.cache[this.songId].currentTime = 0;
        this.clearMediaSessionMetadata();
    }

    pause() {
        if (this.songId === null) return false;
        this.playing = false;
        this.cache[this.songId].pause();
    }

    setCurrentTime(time) {
        if (this.songId === null) return false;
        this.cache[this.songId].currentTime = time;
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
}
