// Config
const CONFIG = {
    jsonPath: 'movies.json',
    postersPath: 'posters/',
    moviesPerPage: 30,
    localStorageKey: 'cinema-profile-v4'
};

// 10 PROFILS (clés JSON du CSV)
const PROFILES = {
    blockbuster: { name: "Cinéphage de Blockbusters", desc: "Tu aimes les films qui se vivent plus qu'ils ne se regardent. Explosion, rythme, scènes cultes : un bon film doit faire dire 'wow'." },
    explorer: { name: "Explorateur de Mondes", desc: "Tu cherches des univers, pas juste des histoires. La science-fiction, la fantasy ou l'étrange nourrissent ton imaginaire." },
    thrillseeker: { name: "Amateur de Tension", desc: "Le cinéma est un sport à sensations. Suspense, malaise, retournements : tu veux ressentir quelque chose, même inconfortable." },
    empath: { name: "Émotif Cinéphile", desc: "Tu te souviens des films qui parlent d'amour, de solitude ou de perte. Le cinéma, pour toi, c'est avant tout une affaire de sentiments." },
    hedonist: { name: "Spectateur Hédoniste", desc: "Tu regardes des films pour passer un bon moment. Rire, sourire, détente : tout n'a pas besoin d'être profond pour être bon." },
    realist: { name: "Réaliste Curieux", desc: "Tu aimes les films qui parlent du vrai monde. Histoires vraies, enjeux sociaux, politique : le cinéma comme miroir." },
    auteurist: { name: "Esthète", desc: "Tu apprécies les silences, les cadres, le temps qui passe. Un film peut être beau avant même d'être spectaculaire." },
    analyst: { name: "Cinéphile Analytique", desc: "Tu aimes comprendre comment un film est construit. Structures, twists, thèmes : tu réfléchis autant que tu ressens." },
    eclectic: { name: "Grand Public Éclectique", desc: "Un peu de tout, tant que c'est bon. Tu n'as pas de chapelle. Un bon film est un bon film, peu importe le genre ou le studio." },
    darkhorse: { name: "Noctambule Sombre", desc: "Tu es attiré par les zones grises. Drames noirs, thrillers psychologiques, personnages cassés : le cinéma comme plongée." }
};

// State
const STATE = {
    allMovies: [],
    originalMovies: [],
    selectedMovieIds: [],
    currentPage: 0
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        showLoader();
        await loadMovies();
        loadSelectedFromLocalStorage();
        setupEventListeners();
        hideLoader();
        showPage('home');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur: Vérifiez que movies.json existe.');
    }
}

async function loadMovies() {
    const response = await fetch(CONFIG.jsonPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    STATE.originalMovies = data.movies || data;
    STATE.allMovies = [...STATE.originalMovies];
    console.log(`✅ ${STATE.allMovies.length} films chargés`);
}

function shuffleMovies() {
    const shuffled = [...STATE.originalMovies];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    STATE.allMovies = shuffled;
}

function loadSelectedFromLocalStorage() {
    const saved = localStorage.getItem(CONFIG.localStorageKey);
    if (saved) {
        try {
            STATE.selectedMovieIds = JSON.parse(saved);
        } catch (error) {
            STATE.selectedMovieIds = [];
        }
    }
}

function saveSelectedToLocalStorage() {
    localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(STATE.selectedMovieIds));
}

function clearLocalStorage() {
    localStorage.removeItem(CONFIG.localStorageKey);
    STATE.selectedMovieIds = [];
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) targetPage.classList.add('active');
    
    if (pageName === 'selection') {
        shuffleMovies();
        STATE.currentPage = 0;
        renderSelectionPage();
    } else if (pageName === 'results') {
        renderResultsPage();
    }
}

function renderSelectionPage() {
    updateProgressBar();
    updateTotalCount();
    renderMoviesGrid();
    updatePagination();
    updateViewProfileButton();
}

function renderMoviesGrid() {
    const grid = document.getElementById('movies-grid');
    const startIndex = STATE.currentPage * CONFIG.moviesPerPage;
    const endIndex = startIndex + CONFIG.moviesPerPage;
    const moviesToDisplay = STATE.allMovies.slice(startIndex, endIndex);
    
    grid.innerHTML = '';
    moviesToDisplay.forEach(movie => {
        const card = createMovieCard(movie);
        grid.appendChild(card);
    });
}

function createMovieCard(movie) {
    const isSelected = STATE.selectedMovieIds.includes(movie.id);
    const card = document.createElement('div');
    card.className = `movie-card ${isSelected ? 'selected' : ''}`;
    card.dataset.id = movie.id;
    
    const posterPath = `${CONFIG.postersPath}${movie.poster}`;
    
    card.innerHTML = `
        <div class="movie-poster-container">
            <img src="${posterPath}" alt="${movie.title}" class="movie-poster" onerror="handlePosterError(this)">
            <div class="poster-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <span class="poster-placeholder-text">${movie.title}</span>
            </div>
        </div>
        <div class="movie-overlay"></div>
        <div class="movie-checkmark">
            <svg class="checkmark-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
        </div>
        <div class="movie-info">
            <p class="movie-title">${movie.title}</p>
            <p class="movie-year">${movie.year}</p>
        </div>
    `;
    
    card.addEventListener('click', () => toggleMovieSelection(movie.id));
    return card;
}

window.handlePosterError = function(img) {
    img.classList.add('hidden');
    const placeholder = img.parentElement.querySelector('.poster-placeholder');
    if (placeholder) placeholder.classList.add('active');
};

function toggleMovieSelection(movieId) {
    const index = STATE.selectedMovieIds.indexOf(movieId);
    if (index > -1) {
        STATE.selectedMovieIds.splice(index, 1);
    } else {
        STATE.selectedMovieIds.push(movieId);
    }
    saveSelectedToLocalStorage();
    updateMovieCardUI(movieId);
    updateProgressBar();
    updateViewProfileButton();
}

function updateMovieCardUI(movieId) {
    const card = document.querySelector(`.movie-card[data-id="${movieId}"]`);
    if (card) {
        card.classList.toggle('selected', STATE.selectedMovieIds.includes(movieId));
    }
}

function updateProgressBar() {
    const progress = (STATE.selectedMovieIds.length / STATE.allMovies.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('selected-count').textContent = STATE.selectedMovieIds.length;
}

function updateTotalCount() {
    document.getElementById('total-count').textContent = STATE.allMovies.length;
}

function updateViewProfileButton() {
    const btn = document.getElementById('btn-view-profile');
    btn.style.display = STATE.selectedMovieIds.length > 0 ? 'block' : 'none';
}

function updatePagination() {
    const totalPages = Math.ceil(STATE.allMovies.length / CONFIG.moviesPerPage);
    document.getElementById('current-page').textContent = STATE.currentPage + 1;
    document.getElementById('total-pages').textContent = totalPages;
    document.getElementById('btn-prev').disabled = STATE.currentPage === 0;
    document.getElementById('btn-next').disabled = STATE.currentPage >= totalPages - 1;
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(STATE.allMovies.length / CONFIG.moviesPerPage);
    STATE.currentPage = Math.max(0, Math.min(pageNumber, totalPages - 1));
    renderMoviesGrid();
    updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// RÉSULTATS avec calcul de profil
function renderResultsPage() {
    const selectedMovies = STATE.allMovies.filter(m => STATE.selectedMovieIds.includes(m.id));
    
    if (selectedMovies.length === 0) {
        alert('Sélectionne au moins un film !');
        showPage('selection');
        return;
    }
    
    const percent = Math.round((selectedMovies.length / STATE.allMovies.length) * 100);
    document.getElementById('profile-count').textContent = selectedMovies.length;
    document.getElementById('profile-plural').textContent = selectedMovies.length > 1 ? 's' : '';
    document.getElementById('profile-percent').textContent = percent;
    
    // Calcul du profil
    const profile = calculateProfile(selectedMovies);
    renderProfile(profile);
    
    // Stats
    const stats = calculateStats(selectedMovies);
    renderStats('genres-stats', stats.genres, 'genre', stats.total);
    renderStats('decades-stats', stats.decades, 'decade', stats.total);
    renderStats('directors-stats', stats.directors, 'director', stats.total);
    renderStats('countries-stats', stats.countries, 'country', stats.total);
    renderStats('actors-stats', stats.actors, 'actor', stats.total);
}

function calculateProfile(movies) {
    const scores = {};
    
    // Calculer le score de chaque profil
    movies.forEach(movie => {
        if (movie.profiles) {
            Object.entries(movie.profiles).forEach(([profileKey, score]) => {
                scores[profileKey] = (scores[profileKey] || 0) + score;
            });
        }
    });
    
    // Trouver le profil dominant
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const mainProfile = sorted[0]?.[0] || 'eclectic';
    
    return {
        main: mainProfile,
        scores: scores,
        total: movies.length
    };
}

function renderProfile(profile) {
    const container = document.getElementById('cinema-profile');
    const profileData = PROFILES[profile.main] || PROFILES.eclectic;
    
    container.innerHTML = `
        <h2 class="profile-name">${profileData.name}</h2>
        <p class="profile-description">${profileData.desc}</p>
    `;
}

function calculateStats(movies) {
    const stats = {
        total: movies.length,
        genres: {},
        decades: {},
        directors: {},
        countries: {},
        actors: {}
    };
    
    movies.forEach(movie => {
        // Genres
        if (movie.genres && Array.isArray(movie.genres)) {
            movie.genres.forEach(genre => {
                stats.genres[genre] = (stats.genres[genre] || 0) + 1;
            });
        }
        
        // Décennies
        if (movie.decade) stats.decades[movie.decade] = (stats.decades[movie.decade] || 0) + 1;
        
        // Réalisateurs
        if (movie.director) stats.directors[movie.director] = (stats.directors[movie.director] || 0) + 1;
        
        // Pays
        if (movie.country && Array.isArray(movie.country)) {
            movie.country.forEach(country => {
                stats.countries[country] = (stats.countries[country] || 0) + 1;
            });
        }
        
        // Acteurs
        if (movie.actors && Array.isArray(movie.actors)) {
            movie.actors.forEach(actor => {
                if (actor && actor.trim()) {
                    stats.actors[actor] = (stats.actors[actor] || 0) + 1;
                }
            });
        }
    });
    
    stats.genres = sortStats(stats.genres);
    stats.decades = sortStats(stats.decades);
    stats.directors = sortStats(stats.directors).slice(0, 3);
    stats.countries = sortStats(stats.countries).slice(0, 5);
    stats.actors = sortStats(stats.actors).slice(0, 3);
    
    return stats;
}

function sortStats(obj) {
    return Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(([key, value]) => ({ label: key, count: value }));
}

function renderStats(containerId, data, type, total) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    data.slice(0, 5).forEach((item, index) => {
        const percentage = (item.count / total) * 100;
        let label = item.label;
        if (type === 'decade') label = `Années ${item.label}s`;
        else if (type === 'director') label = `#${index + 1} ${item.label}`;
        else if (type === 'actor') label = `#${index + 1} ${item.label}`;
        
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <div class="stat-item-header">
                <span class="stat-label">${label}</span>
                <span class="stat-value">${item.count} film${item.count > 1 ? 's' : ''}</span>
            </div>
            <div class="stat-bar-container">
                <div class="stat-bar ${type}" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(statItem);
    });
}

function showLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('loader').classList.add('hidden');
}

function setupEventListeners() {
    document.getElementById('btn-start').addEventListener('click', () => showPage('selection'));
    document.getElementById('btn-prev').addEventListener('click', () => goToPage(STATE.currentPage - 1));
    document.getElementById('btn-next').addEventListener('click', () => goToPage(STATE.currentPage + 1));
    document.getElementById('btn-back-home').addEventListener('click', () => showPage('home'));
    document.getElementById('btn-view-profile').addEventListener('click', () => showPage('results'));
    document.getElementById('btn-back-selection').addEventListener('click', () => showPage('selection'));
    document.getElementById('btn-restart').addEventListener('click', () => {
        if (confirm('Recommencer ? Toutes tes sélections seront effacées.')) {
            clearLocalStorage();
            STATE.currentPage = 0;
            showPage('home');
        }
    });
}
