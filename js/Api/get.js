export default class get {
    static async songs() {
        return getJSON('songs');
    }

    static async playlists() {
        return getJSON('playlists');
    }
}

async function getJSON(name) {
    const response = await fetch(`database/${name}.json`);
    return response.json();
}