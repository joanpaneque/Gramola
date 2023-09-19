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
                    <div class="Playlist__song" >
                        <img src="${songs[song].cover}" alt="${songs[song].title}">
                        ${songs[song].artist} - ${songs[song].title}
                    </div>
                `).join("")}
            </div>
        `;

        this.container.innerHTML = this.HTML;

        this.container.querySelector(".Playlist__info").onclick = () => {
            // Alternar la clase expanded en el elemento .Playlist__songs
            const playlistSongs = this.container.querySelector(".Playlist__songs");
            playlistSongs.classList.toggle("expanded");
        }

        this.container.querySelectorAll(".Playlist__song").forEach(song => {
            song.addEventListener("mouseenter", () => {
                const rect = song.getBoundingClientRect();
                let floatingCover = document.createElement("div");
                floatingCover.innerHTML = `
                    <div class="Playlist__floatingCover" style="top: ${rect.top + window.scrollY}px; left: ${rect.left + rect.width + 5}px">
                        <img src="${song.querySelector("img").src}">
                    </div>                
                `;
                document.body.appendChild(floatingCover);

                setTimeout(() => {
                    floatingCover.querySelector(".Playlist__floatingCover").classList.toggle("appear");
                });
            });

            song.addEventListener("mouseleave", () => {
                console.log("leave");

                document.querySelectorAll(".Playlist__floatingCover").forEach(floatingCover => {
                    floatingCover.remove();
                })
            });
        });
    }
}
