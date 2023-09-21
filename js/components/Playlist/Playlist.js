import Component from "../Component.js";
import { songs } from "../../app.js";

export default class Playlist extends Component {
    constructor(playlist) {
        super();
        this.container.classList.add("Playlist__playlist");

        this.HTML = `
            <div class="Playlist__info">
                <img src="assets\\img\\svg\\playlist.svg">
                <div class="Playlist__name">${playlist.name}</div>
            </div>
            <div class="Playlist__songs">
                ${playlist.songs.map(song => `
                    <div class="Playlist__song" song-id="${song}">
                        <img src="${songs[song].cover}" alt="${songs[song].title}">
                        <div class="Playlist__song__text__container">
                            <div class="Playlist__song__text">${songs[song].artist} - ${songs[song].title}</div>
                            <div class="Playlist__song__text">${songs[song].artist} - ${songs[song].title}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        this.container.innerHTML = this.HTML;

        this.container.querySelector(".Playlist__info").onclick = () => {
            const playlistSongs = this.container.querySelector(".Playlist__songs");
            playlistSongs.classList.toggle("expanded");
        }

        this.container.querySelectorAll(".Playlist__song").forEach(song => {
            let mouseOver = false;

            // cR = container rect
            // iR = text info rect
            // cW = container width
            // iW = info width

            let cR;
            let iR;
            let cW;
            let iW;

            let reentering = false;

            let text1left = 0;
            let text2left = 0;

            let lastTime = 0;
            let deltaTime = 0;

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
                    console.log(deltaTime);
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
                        <img src="${song.querySelector("img").src}">
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
                })

                text2.style.visibility = "hidden";

                document.querySelectorAll(".Playlist__floatingCover").forEach(floatingCover => {
                    floatingCover.remove();
                })
            });

            song.addEventListener("click", () => {
                let clickedSong = songs[song.getAttribute("song-id")];
            });

        });
    }
}
