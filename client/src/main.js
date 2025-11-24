import './style.css'
import './classes/genre.js'

document.addEventListener('DOMContentLoaded', async () => {
	const genreSelect = document.querySelector('.selectors-container select')
	if (!genreSelect) return

	try {
		const genres = await window.fetchGenres('http://localhost:3000/genres')
		// fetchGenres devuelve una promesa que resuelve en Genre[] (usa parseGenres internamente)
		window.fillGenres(genres, genreSelect, 'Select genre')
	} catch (err) {
		console.error('No se pudieron cargar los géneros:', err)
	}
})

