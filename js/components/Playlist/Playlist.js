import Component from "../Component.js";
import { songs, audioPlayer } from "../../app.js";

export default class Playlist extends Component {
    constructor(playlist) {
        super();
        this.container.classList.add("Playlist__playlist");
        this.HTML = `
            <div class="Playlist__info">
                <img src="assets\\img\\svg\\playlist.svg">
                <div class="Playlist__name">${playlist.name}</div>
                <div class="Playlist__info__right">
                    <div class="Playlist__play"><img src="assets\\img\\svg\\play.svg"></div>
                    <div class="Playlist__unfold"><img src="assets\\img\\svg\\arrow-right.svg"></div>
                </div>
            </div>
            <div class="Playlist__songs">
                ${playlist.songs.map(song => `
                    <div class="Playlist__song" song-id="${song}">
                        <div class="Playlist__song__cover__container">
                            <div class="Playlist__song__cover__overlay">
                                <img src="assets\\img\\svg\\play.svg" class="Playlist__song__cover__overlay__play">
                                <img src="assets\\img\\svg\\pause.svg" class="Playlist__song__cover__overlay__pause">
                            </div>
                            <img src="${songs[song].cover}" alt="${songs[song].title}" class="Playlist__song__cover__floating">
                        </div>
                        <div class="Playlist__song__text__container">
                            <div class="Playlist__song__text">${songs[song].artist} - ${songs[song].title}</div>
                            <div class="Playlist__song__text">${songs[song].artist} - ${songs[song].title}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        this.container.innerHTML = this.HTML;

        this.playButton = this.container.querySelector(".Playlist__play");
        this.unfoldButton = this.container.querySelector(".Playlist__unfold");

        this.playlistName = this.container.querySelector(".Playlist__name");

        this.playlistInfo = this.container.querySelector(".Playlist__info");

        this.playlistInfo.addEventListener("mouseenter", () => {
            this.playButton.classList.remove("hover");
            this.unfoldButton.classList.add("hover");
        });

        this.playlistInfo.addEventListener("mouseleave", () => {
            this.playButton.classList.remove("hover");
            this.unfoldButton.classList.remove("hover");
        });

        this.playButton.addEventListener("click", e => {
            document.querySelectorAll(".Playlist__name").forEach(element => {
                // element.style.color = "#fff";
            });

            const root = document.documentElement;
            const primary_color = getComputedStyle(root).getPropertyValue("--primary-color");
            this.playlistName.style.color = primary_color;

            const img = this.playButton.querySelector("img");
            if (img.src.includes("play.svg")) {
                document.querySelectorAll(".Playlist__play").forEach(icon => {
                    icon.innerHTML = `<img src="assets\\img\\svg\\play.svg">`;
                })
                this.playButton.innerHTML = `<img src="assets\\img\\svg\\pause.svg">`;
                audioPlayer.play(playlist);
            } else {
                this.playButton.innerHTML = `<img src="assets\\img\\svg\\play.svg">`;
                // this.playlistName.style.color = "#fff";
            }



            e.stopPropagation();
        });

        this.playButton.addEventListener("mouseenter", () => {
            this.playButton.classList.add("hover");
            this.unfoldButton.classList.remove("hover");
        });

        this.playButton.addEventListener("mouseleave", () => {
            this.playButton.classList.remove("hover");
            this.unfoldButton.classList.add("hover");
        });

        this.unfoldButton.addEventListener("mouseenter", () => {
            this.unfoldButton.classList.add("hover");
        });

        this.unfoldButton.addEventListener("mouseleave", () => {
            this.unfoldButton.classList.remove("hover");
        });

        // Cada playlist té una animació de desplegament al fer clic que funciona mitjançant CSS
        this.container.querySelector(".Playlist__info").onclick = () => {
            const playlistSongs = this.container.querySelector(".Playlist__songs");
            playlistSongs.classList.toggle("expanded");
            this.unfoldButton.classList.toggle("folded");  
        }

        // Lògica de cada cançó d'una playlist
        this.container.querySelectorAll(".Playlist__song").forEach(song => {

            // Quan el text d'una cancó a dins d'una playlist no cap, aquest es mourà cap a l'esquerra:
            // Variables necessàries per realitzar aquesta lògica:

            let mouseOver = false;  // Variable necessària per al moviment del text

            // cR = container rect  | rect de this.container
            // iR = text info rect  | rect del nom + artista de la cançó 
            // cW = container width | cR.width - iR.left - cR.left (Mida del text)
            // iW = info width      | iR.width (Mida del espai màxim possible per al text)

            let cR;
            let iR;
            let cW;
            let iW;

            // Per realitzar la il·lusió del text en moviment, en realitat utilitzarem dos texts, i per defecte
            // estaràn a la seva posició inicial (0)

            //  0px         0px
            //   |           |
            //   |           |
            //  \/          \/
            //   primertext  segontext
            let text1left = 0; // px
            let text2left = 0; // px

            // Variables necessàries per calcular el deltaTime.

            // deltaTime és una variable en la que guardarem el temps que passa entre cada fotograma del monitor.
            // aquesta variable canviarà depenent de la velocitat de refresc en Hz del monitor.
            // Per defecte les pantalles solen ser de 60Hz, però existeixen pantalles de 75, 120, 144, 240, 360 Hz...
            // Per tant la variable serà actualitzada la quantitat de Hz que tingui l'usuari per segon.
            // deltaTime no només és necessari per la quantitat de Hz de la pantalla del client. El client també
            // pot patir baixades de rendiment per culpa d'aplicacións de tercers i el refresc de fotogrames per segon
            // es pot veure afectat i ser inferior als Hz de la pantalla

            //  Acum.  |  0.016  | 0.0316  | 0.486   |  0.636     |
            //         |---------|---------|---------|------------|
            //  Temps  |  0.016  | 0.0156  |  0.017  | 0.015      |
            //         |---------|---------|---------|------------|
            //  Frame  | FRAME 1 | FRAME 2 | FRAME 3 | FRAME 4... |

            let lastTime = 0;
            let deltaTime = 0;

            // Velocitat del text quan està en moviment

            // !! Aquesta no és la velocitat real, la real es calcula fent speed * deltaTime
            // d'aquesta manera la velocitat serà la mateixa en qualsevol tipus de pantalla
            // Si utilitzem una velocitat constant de 30px per frame en una pantalla de 60Hz avançarem 1800px en un segon
            // En canvi si utilitzem la mateixa velocitat en una pantalla de 120Hz avançarem 3600px
            // 
            // La solució a aquest problema és la que està plantejada anteriorment.
            const speed = 30;

            const [text1, text2] = song.querySelectorAll(".Playlist__song__text");

            const infoContainer = song.querySelector(".Playlist__song__text__container");

            function animate(timestamp) {
                deltaTime = (timestamp - lastTime) / 1000;
                lastTime = timestamp

                if (deltaTime > 1) {
                    text1left -= 0.3;
                    text2left -= 0.3;
                } else {
                    text1left -= speed * deltaTime;
                    text2left -= speed * deltaTime;
                }

                const t1R = text1.getBoundingClientRect();
                const t2R = text2.getBoundingClientRect();

                const icR = infoContainer.getBoundingClientRect();

                if (icR.left - t1R.left > t1R.width) {
                    text1left = t1R.width + 20;
                }

                if (icR.left - t2R.left > t2R.width) {
                    text2left = 10;
                    text1left = 10;
                }

                text1.style.left = `${text1left}px`;
                text2.style.left = `${text2left}px`;

                if (mouseOver) requestAnimationFrame(animate);
            }

            song.addEventListener("mouseenter", () => {
                cR = this.container.getBoundingClientRect();
                iR = song.querySelector(".Playlist__song__text").getBoundingClientRect();
                cW = cR.width - iR.left - cR.left;
                iW = iR.width;
                mouseOver = true;

                if (cW < iW) {
                    text2.style.visibility = "visible";
                    requestAnimationFrame(animate);
                }
                const rect = song.getBoundingClientRect();
                let floatingCover = document.createElement("div");
                floatingCover.innerHTML = `
                    <div class="Playlist__floatingCover" style="top: ${rect.top + window.scrollY}px; left: ${rect.left + rect.width + 15}px">
                        <img src="${song.querySelector(".Playlist__song__cover__floating").src}">
                    </div>                
                `;
                document.body.appendChild(floatingCover);

                setTimeout(() => {
                    floatingCover.querySelector(".Playlist__floatingCover").classList.add("appear");
                });
            });

            song.addEventListener("mouseleave", () => {
                mouseOver = false;

                setTimeout(() => {
                    text1.style.left = 0;
                    text2.style.left = 0;
                    text1left = 0;
                    text2left = 0;
                });

                text2.style.visibility = "hidden";

                document.querySelectorAll(".Playlist__floatingCover").forEach(floatingCover => {
                    floatingCover.remove();
                });
            });

            song.addEventListener("click", () => {
                let songId = song.getAttribute("song-id");

                const playButtons = document.querySelectorAll(`.Playlist__song[song-id="${songId}"] .Playlist__song__cover__overlay__play`);
                const pauseButtons = document.querySelectorAll(`.Playlist__song[song-id="${songId}"] .Playlist__song__cover__overlay__pause`);

                const currentSongsText = document.querySelectorAll(`.Playlist__song[song-id="${songId}"] .Playlist__song__text`);
                const songsText = document.querySelectorAll(`.Playlist__song__text`);


                songsText.forEach(text => {
                    text.classList.remove("playing");
                });

                currentSongsText.forEach(text => {
                    text.classList.add("playing");
                })

                if (songId != audioPlayer.songId) {
                    audioPlayer.playing = false;
                    audioPlayer.stop();
                }

                if (audioPlayer.playing) {
                    audioPlayer.pause();
                    audioPlayer.playing = false;
                    playButtons.forEach(button => button.style.display = "block");
                    pauseButtons.forEach(button => button.style.display = "none");
                } else {
                    audioPlayer.songId = songId;
                    audioPlayer.playing = true;
                    audioPlayer.play();
                    this.stopAllSongs();    
                    playButtons.forEach(button => button.style.display = "none");
                    pauseButtons.forEach(button => button.style.display = "block");
                }
            });

        });
    }

    stopAllSongs() {
        const playButtons = document.querySelectorAll(".Playlist__song__cover__overlay__play");
        const pauseButtons = document.querySelectorAll(".Playlist__song__cover__overlay__pause");

        playButtons.forEach(button => {
            button.style.display = "block";
        });

        pauseButtons.forEach(button => {
            button.style.display = "none";
        });
    }
}
