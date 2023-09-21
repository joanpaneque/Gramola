import Api from "./Api/api.js"
import Playlist from "./components/Playlist/Playlist.js";

export const playlists = await Api.get.playlists();
export const songs = await Api.get.songs();

const playlistsContainer = document.getElementById("playlists");

playlists.forEach(playlist => {
    let PL = new Playlist(playlist);

    playlistsContainer.appendChild(PL.container);
});