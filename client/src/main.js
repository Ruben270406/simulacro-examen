import './style.css'

// Versión simple y directa: no dependemos de clases externas.
async function fetchGenres() {
    const res = await fetch('http://localhost:3000/genres')
    if (!res.ok) throw new Error('Error al obtener géneros: ' + res.status)
    const data = await res.json()
    const list = Array.isArray(data) ? data : data.genres || []
    // Normalizar a { value, text }
    return list.map(item => ({ value: item.value ?? item.id ?? '', text: item.text ?? item.name ?? '' }))
}

function fillGenres(selectEl, items) {
    if (!selectEl) return
    selectEl.innerHTML = ''
    const ph = document.createElement('option')
    ph.value = ''
    ph.textContent = 'Select genre'
    selectEl.appendChild(ph)
    items.forEach(it => {
        const opt = document.createElement('option')
        opt.value = it.value
        opt.textContent = it.text
        selectEl.appendChild(opt)
    })
}

async function fetchBooksByGenre(genre) {
    const res = await fetch('http://localhost:3001/books?genre=' + encodeURIComponent(genre))
    if (!res.ok) {
        console.error('Error al obtener libros:', res.status)
        return []
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : data.books || []
    // Normalizar a { id, title }
    return list.map(b => ({ id: b.book_id ?? b.id ?? '', title: b.name ?? b.title ?? '' }))
}

function fillBooks(selectEl, books) {
    if (!selectEl) return
    selectEl.innerHTML = ''
    const ph = document.createElement('option')
    ph.value = ''
    ph.textContent = 'Select book'
    selectEl.appendChild(ph)
    books.forEach(b => {
        const opt = document.createElement('option')
        opt.value = b.id
        opt.textContent = b.title
        selectEl.appendChild(opt)
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    const genreSelect = document.querySelector('.selectors-container select[name="genres"]')
    const bookSelect = document.querySelector('.selectors-container select[name="books"]')
    if (!genreSelect || !bookSelect) return

    try {
        const genres = await fetchGenres()
        fillGenres(genreSelect, genres)
    } catch (err) {
        console.error('No se pudieron cargar los géneros:', err)
    }

    genreSelect.addEventListener('change', async () => {
        const val = genreSelect.value
        if (!val) {
            bookSelect.innerHTML = '<option value="">Select book</option>'
            return
        }
        const books = await fetchBooksByGenre(val)
        fillBooks(bookSelect, books)
    })
})

