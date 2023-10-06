export default class get {

    // Aquesta funció retorna un array amb totes les cançons
    static async songs() {
        return getJSON('songs');
    }

    // Aquesta funció retorna un array amb totes les playlists
    static async playlists() {
        return getJSON('playlists');
    }
}

// Aquesta funció retorna un contingut JSON
async function getJSON(name) {
    const response = await fetch(`database/${name}.json`);
    return response.json();
}