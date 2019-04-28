const main = document.querySelector('main');
const pageTitle = document.querySelector('title');
const imdbID = window.location.search.match(/imdbID=(.*)/)[1];

const BASE_URL = 'https://tylerimdb.now.sh/'

function getMovie(imdbID) {
    return fetch(`${BASE_URL}movie/${imdbID}`)
        .then(res => res.json());
}

function showMovie(movie) {
    console.log(movie)
    const title = movie.title;
    setTitle(title);

    const section = document.createElement('section');
    main.appendChild(section);
    console.log(movie.poster)

    section.outerHTML = `

    <section class="row">
    <div class="col-sm-3">
        <img src="${movie.poster}" class="img-fluid" id="poster" />
    </div>
    <div class="col-sm-9">
        <h2 id="movieTitle">${movie.title}</h2>
        <dl class="row">

            <dt class="col-sm-4">Trailer:</dt>
            <dd class="col-sm-5"><a href="${movie.trailer}">Link</a></dd>

            <dt class="col-sm-4">Score:</dt>
            <dd class="col-sm-5">${movie.score}</dd>

            <dt class="col-sm-4">Rating:</dt>
            <dd class="col-sm-5">${movie.rating}</dd>
 
            <dt class="col-sm-4">Length:</dt>
            <dd class="col-sm-5">${movie.length}</dd>    
            
            <dt class="col-sm-4">Budget:</dt>
            <dd class="col-sm-5">${movie.budget}</dd>   

            <dt class="col-sm-4">Genre(s):</dt>
            <dd class="col-sm-5">${movie.genres.map(elmt => `${elmt}<br>`).join('')}</dd>
            
            <dt class="col-sm-4">Star(s):</dt>
            <dd class="col-sm-5">${movie.stars.map(elmt => `${elmt}<br>`).join('')}</dd>
 
            <dt class="col-sm-4">Director(s):</dt>
            <dd class="col-sm-5">${movie.directors.map(elmt => `${elmt}<br>`).join('')}</dd>

            <dt class="col-sm-4">Writer(s):</dt>
            <dd class="col-sm-5">${movie.writers.map(elmt => `${elmt}<br>`).join('')}</dd>

            <dt class="col-sm-4">Summary:</dt>
            <dd class="col-sm-5">${movie.summary}</dd>

            <dt class="col-sm-4">Story:</dt>
            <dd class="col-sm-5">${movie.story}</dd>

    </dl>
    </div>
    </section>


    `
}

function setTitle(title) {
    splitTitle = title.split("-")
    pageTitle.textContent = splitTitle[0];
}

getMovie(imdbID)
    .then(showMovie);