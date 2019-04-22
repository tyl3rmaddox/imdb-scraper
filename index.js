const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'https://www.imdb.com/find?&s=tt&ref_=fn_tt&q='

// 

function searchMovies(searchTerm) {
    return fetch(`${url}${searchTerm}`)
        .then(response => response.text())
}

searchMovies('star wars')
    .then(body => {
        const movies = new Array();
        const $ = cheerio.load(body);
        $('.findResult').each(function(i, element) {
            const $element = $(element);
            const $image = $element.find('td a img');
            const $title = $element.find('td.result_text a');
            const movie = {
                title: $title.text(),
                image: $image.attr('src')
            };
            movies.push(movie);
        });
        console.log(movies);
    })