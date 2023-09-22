import Api from "./Api/api.js"
import Playlist from "./components/Playlist/Playlist.js";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer.js";

export const playlists = await Api.get.playlists();
export const songs = await Api.get.songs();

console.log(playlists);
console.log(songs);

export const audioPlayer = new AudioPlayer(songs);


document.body.appendChild(audioPlayer.container);


const playlistsContainer = document.getElementById("playlists");

playlists.forEach(playlist => {
    let PL = new Playlist(playlist);

    playlistsContainer.appendChild(PL.container);
});
