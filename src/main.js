import axios from 'axios';

const loader = document.getElementById('loader');
const loadingMessage = document.getElementById('loadingMessage');
const categoryInput = document.getElementById('categoryInput');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('results');

// --- CREAZIONE MODAL ---
const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');
const modalContent = document.createElement('div');
modalContent.classList.add('modal-content');
const closeBtn = document.createElement('button');
closeBtn.textContent = '×';
closeBtn.classList.add('modal-close');

modalContent.appendChild(closeBtn);
modalOverlay.appendChild(modalContent);
document.body.appendChild(modalOverlay);

closeBtn.addEventListener('click', () => modalOverlay.style.display = 'none');
modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) modalOverlay.style.display = 'none';
});

// --- RICERCA LIBRI ---
searchBtn.addEventListener('click', () => {
    const category = categoryInput.value.trim();
    if (!category) return;

    loadingMessage.classList.remove("hidden");
    searchBtn.disabled = true;
    resultsSection.innerHTML = '';

    const url = `https://openlibrary.org/subjects/${category}.json`;

    // USIAMO AXIOS!
    axios.get(url)
        .then(response => {
            const data = response.data; // I dati sono già qui!

            if (!data.works || data.works.length === 0) {
                resultsSection.innerHTML = `<p class="no-results">Nessun risultato... 😕</p>`;
                return;
            }

            data.works.forEach(work => {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book');

                const img = document.createElement('img');
                img.src = work.cover_id
                    ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
                    : 'https://via.placeholder.com/150x220?text=No+Cover';
                bookDiv.appendChild(img);

                const title = document.createElement('h3');
                title.textContent = work.title;
                bookDiv.appendChild(title);

                const authors = document.createElement('p');
                authors.textContent = (work.authors && work.authors.length > 0)
                    ? 'Autori: ' + work.authors.map(a => a.name).join(', ')
                    : 'Autore sconosciuto';
                bookDiv.appendChild(authors);

                const toggleBtn = document.createElement('button');
                toggleBtn.textContent = 'Mostra descrizione';

                toggleBtn.addEventListener('click', () => {
                    const bookUrl = `https://openlibrary.org${work.key}.json`;

                    // Altro giro con Axios per la descrizione
                    axios.get(bookUrl)
                        .then(res => {
                            const bookData = res.data; // Anche qui, niente .json()

                            modalContent.innerHTML = '';
                            modalContent.appendChild(closeBtn);

                            const modalTitle = document.createElement('h3');
                            modalTitle.textContent = work.title;
                            modalContent.appendChild(modalTitle);

                            const desc = document.createElement('p');
                            if (bookData.description) {
                                desc.textContent = typeof bookData.description === 'string'
                                    ? bookData.description
                                    : bookData.description.value;
                            } else {
                                desc.textContent = 'Descrizione non disponibile';
                            }
                            modalContent.appendChild(desc);
                            modalOverlay.style.display = 'flex';
                        })
                        .catch(err => console.error('Errore descrizione:', err));
                });

                bookDiv.appendChild(toggleBtn);
                resultsSection.appendChild(bookDiv);
            });
        })
        .catch(error => {
            console.error('Errore:', error);
            resultsSection.innerHTML = `<p class="no-results">Errore nel caricamento dei dati 😕</p>`;
        })
        .finally(() => {
            loadingMessage.classList.add("hidden");
            searchBtn.disabled = false;
        });
});

categoryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});