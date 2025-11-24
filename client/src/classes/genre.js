class Genre{
    // Atributos privados
    #text;
    #value;

    // Constructor simple: text (nombre) y value (id o valor)
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

    // Crear desde un objeto API (acepta {id,name} o {text,value})
    static from(obj){
        if (!obj) return new Genre('', '')
        const text = obj.name ?? obj.text ?? obj.genre ?? ''
        const value = obj.id ?? obj.value ?? obj._id ?? ''
        return new Genre(text, value)
    }
}

// Convierte datos recibidos en instancias Genre usando Promesas
function parseGenres(data){
    return new Promise((resolve, reject) => {
        if (!Array.isArray(data)){
            reject('Los datos recibidos NO son válidos.')
            return
        }

        try{
            const genres = data.map(item => Genre.from(item))
            resolve(genres)
        } catch(error){
            reject('Error parseando los géneros: ' + error)
        }
    })
}

// Trae los géneros desde la API y devuelve una promesa que resuelve en Genre[]
function fetchGenres(url = 'http://localhost:3000/genres'){
    return fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Error al obtener géneros: ' + res.status)
            return res.json()
        })
        .then(data => {
            // La API puede devolver { genres: [...] } o un array directo
            const list = Array.isArray(data) ? data : (data.genres || [])
            return parseGenres(list)
        })
}

// Rellena un <select> con las opciones de géneros
function fillGenres(genres, selectElement, placeholder = 'Select genre'){
    if (!selectElement) return
    selectElement.innerHTML = ''

    // Opción placeholder
    const ph = document.createElement('option')
    ph.value = ''
    ph.text = placeholder
    selectElement.appendChild(ph)

    genres.forEach(g => {
        const option = document.createElement('option')
        option.value = g.value
        option.text = g.text
        selectElement.appendChild(option)
    })
}

// Exponer funciones globalmente para uso sencillo desde otros scripts
window.Genre = Genre
window.fetchGenres = fetchGenres
window.parseGenres = parseGenres
window.fillGenres = fillGenres





