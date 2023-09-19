export default class post {
    constructor() {

    }

    static async file(file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = e => {
            const mp3Data = new Uint8Array(e.target.result);
            const formData = new FormData();
            formData.append('mp3', new Blob([mp3Data], { type: 'audio/mpeg' }));
            
            fetch("php/upload.php", {
                method: "POST",
                body: formData
            })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error("Error al subir el archivo:", error);
                });
        };

        reader.readAsArrayBuffer(file);
    }
}
