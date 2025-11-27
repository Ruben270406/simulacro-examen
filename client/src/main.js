import './style.css'

// Obtener géneros con Promise (resolve/reject)
function fetchGenres() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/genres')
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener géneros: ' + res.status)
                return res.json()
            })
            .then(data => {
                const list = Array.isArray(data) ? data : data.genres || []; 
                const items = list.map(item => ({ value: item.value ?? item.id ?? '', text: item.text ?? item.name ?? '' }))
                resolve(items)
            })
            .catch(err => reject(err))
    })
}

function fillGenres(selectEl, items) {
    //if (!selectEl) return
    if(selectEl){
        items.forEach(it => {
            const opt = document.createElement('option')
            opt.value = it.value
            opt.textContent = it.text
            selectEl.appendChild(opt)
        })
    }
}

// Obtener libros por género con Promise (resolve/reject)
function fetchBooksByGenre(genre) {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3001/books?genre=' + genre)
            .then(res => {
                if (!res.ok) throw new Error('Error al obtener libros: ' + res.status)
                return res.json()
            })
            .then(data => {
                const list = Array.isArray(data) ? data : data.books || []
                // Incluimos la propiedad cover para poder mostrar la imagen
                const items = list.map(b => ({ id: b.book_id ?? b.id ?? '', title: b.name ?? b.title ?? '', cover: b.cover ?? '' }))
                resolve(items)
            })
            .catch(err => reject(err))
    })
}

function fillBooks(selectEl, books) {
    if (!selectEl) return
    //selectEl.innerHTML = ''
    //const ph = document.createElement('option')
    //ph.value = ''
    //ph.textContent = 'Select book'
    //selectEl.appendChild(ph)
    books.forEach(b => {
        const opt = document.createElement('option')
        opt.value = b.id
        // guardamos la portada en data-cover
        if (b.cover) opt.dataset.cover = b.cover
        opt.textContent = b.title
        selectEl.appendChild(opt)
    })
}








//Empieza y termina la ejecución del codigo 
document.addEventListener('DOMContentLoaded', async () => {
    //consigo los selectores y luego hago un destructuring por posición consiguiente la posicion uno genre select 
    //y lo trasnformo en una contante. 
    const [ genreSelect , bookSelect ] = document.querySelectorAll('select');

    try {
        if (!genreSelect || !bookSelect) throw new Error("No hemos encontrado nada");
        const genres = await fetchGenres();
        fillGenres(genreSelect, genres);
    } catch (err) {
        console.error('Error al cargar géneros:', err)
    }
    //verboso vuelves a recoger el mismo select 
    //const container = document.querySelector('.selectors-container')
    const imgEl = document.getElementById('dynamic-image')
        // Listener para cambios en el selector de géneros (carga libros)
        genreSelect.addEventListener('change', async (e) => {
           
            const val = e.target.value //es lo mismo que: genreSelect.value  
            console.log(val);
            
            try {
                if (!val) {
                    bookSelect.innerHTML = '<option value="">Select book</option>'
                    if (imgEl) imgEl.src = 'default.png'
                    throw new Error("No se puede cargar");
                }
                const books = await fetchBooksByGenre(val)
                fillBooks(bookSelect, books)
            } catch (err) {
                console.error('Error al cargar libros:', err)
            }
            
        })
    
        // Mostrar portada de cada libro una vez cliquemos en ellos
        bookSelect.addEventListener('change', () => {
            const sel = bookSelect.selectedOptions[0]
            const cover = sel ? sel.dataset.cover : null
            if (imgEl) imgEl.src = cover || 'default.png'
        })
})





