import Api from "./Api/api.js"
import Playlist from "./components/Playlist/Playlist.js";

export const playlists = await Api.get.playlists();
export const songs = await Api.get.songs();

playlists.forEach(playlist => {
    let PL = new Playlist(playlist);

    document.body.appendChild(PL.container);
})