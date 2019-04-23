const fetch = require("node-fetch");
const cheerio = require("cheerio");

const searchUrl = "https://www.imdb.com/find?&s=tt&ref_=fn_tt&q=";
const movieUrl = "https://www.imdb.com/title/"

//

function searchMovies(searchTerm) {
  return fetch(`${searchUrl}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const movies = new Array();
      const $ = cheerio.load(body);
      $(".findResult").each(function(i, element) {
        const $element = $(element);
        const $image = $element.find("td a img");
        const $title = $element.find("td.result_text a");
        const imdbID = $title.attr("href").match(/title\/(.*)\//)[1];
        const movie = {
          title: $title.text(),
          image: $image.attr("src"),
          imdbID: imdbID
        };
        movies.push(movie);
      });
      return movies;
    });
}

function getMovie(imdbID) {
    return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body => {
        const $ = cheerio.load(body);
        const $title = $('.title_wrapper h1')
        const title = $title.first().contents().filter(function() {
            return this.type === 'text';
        }).text().trim();
        const rating = 	
        $(".subtext")
		    .clone()	
		    .children()	
		    .remove()	
		    .end()	      
            .text()
            .replace(/,/g, '')
            .trim();
        const length = $('.subtext time').text().trim()
        const genres = new Array();
        $('.subtext a').not('.subtext a[title]').each(function(i, elem) {
            const genre = $(elem).text();
            genres.push(genre);
        })
            	
        return {
            title,
            rating,
            length,
            genres
        };
    });
}

module.exports = {
    searchMovies,
    getMovie
};

// searchMovies("star wars");
