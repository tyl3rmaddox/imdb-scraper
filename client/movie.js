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
    setTitle (title);

    const section = document.createElement('section');
    main.appendChild(section);
    console.log(movie.poster)

    section.outerHTML = `
        <section class="row">
            <div class="col-sm-12">
            <h1>${movie.title}</h1>
                <img src="${movie.poster}" class="img-fluid" id="poster"/>
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
    