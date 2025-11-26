class Genre{
    // Atributos privados
    #text;
    #value;

    // Constructor simple: text (nombre) y value (id)
    constructor(text, value){
        this.#text = text;
        this.#value = value;
    }

    // Getters
    get text(){
        return this.#text;
    }

    get value(){
        return this.#value;
    }

}

window.Genre = Genre;