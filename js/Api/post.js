export default class post {

    // Codi que no s'utilitza però el deixo per si en un futur es vol utilitzar

    // static async file(file) {
    //     if (!file) return;

    //     const reader = new FileReader();

    //     reader.onload = e => {
    //         const mp3Data = new Uint8Array(e.target.result);
    //         const formData = new FormData();
    //         formData.append('mp3', new Blob([mp3Data], { type: 'audio/mpeg' }));
            
    //         fetch("php/upload.php", {
    //             method: "POST",
    //             body: formData
    //         })
    //             .then(response => response.text())
    //             .then(data => {
    //             })
    //             .catch(error => {
    //                 console.error("Error pujar el fitxer:", error);
    //             });
    //     };

    //     reader.readAsArrayBuffer(file);
    // }
}
