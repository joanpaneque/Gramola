// Tots els components que es facin s'extenen d'aquest.
// Cada component partirà d'un div que anomenat container,
// des del javascript s'escriurà el contingut de cada component

export default class Component {
    constructor() {
        this.container = document.createElement("div");
    }
}