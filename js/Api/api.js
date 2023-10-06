import get from "./get.js";
import post from "./post.js";

// Clase per a fer les crides a la API
export default class Api {
    static get = get;
    static post = post; // Aquest no s'utilitza però el
                        // deixo per si en un futur es
                        // vol utilitzar
}