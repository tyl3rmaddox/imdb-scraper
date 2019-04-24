const fetch = require("node-fetch");
const cheerio = require("cheerio");
const pcheerio = require('pseudo-cheerio');

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

        const release = $('.subtext a[title]').text();
        const score = $('span[itemprop="ratingValue"]').text();
        const poster = $('div[class="poster"] a img').attr('src');
        const summary = $('div.summary_text').text().trim();

        const directors = new Array();
        pcheerio.find($, "div.credit_summary_item:first a").each(function(i, elem) {
          const director = $(elem).text();
          directors.push(director);
        });

        // const writers = new Array();
        // pcheerio.find($, "div.plot_summary:nth-child(2) a").each(function(i, elem) {
        //   const writer = $(elem).text();
        //   writers.push(director);
        // }); 
        
        const writers = new Array();
        pcheerio.find($, ".credit_summary_item:eq(1) a").each(function(i, elem) {
          const writer = $(elem).text();
          writers.push(writer);
          const lastIndex = writers[writers.length -1];
          if(lastIndex.indexOf('more credits') !== -1) {
            writers.pop();
          }
          return writers;
        });

        const stars = new Array();
        pcheerio.find($, ".credit_summary_item:eq(2) a").each(function(i, elem) {
          const star = $(elem).text();
          stars.push(star);
          const lastIndex = stars[stars.length -1];
          if(lastIndex.indexOf('See full cast & crew') !== -1) {
            stars.pop();
          }
          return stars;
        });

        const story = $('#titleStoryLine div p span').text().trim();

        return {
          imdbID,
          title,
          rating,
          length,
          genres,
          release,
          score,
          poster,
          summary,
          directors,
          writers,
          stars,
          story
        };
    });
}

module.exports = {
    searchMovies,
    getMovie
};

// searchMovies("star wars");
