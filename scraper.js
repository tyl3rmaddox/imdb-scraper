const fetch = require("node-fetch");
const cheerio = require("cheerio");
const pcheerio = require("pseudo-cheerio");

const searchUrl = "https://www.imdb.com/find?&s=tt&ref_=fn_tt&q=";
const movieUrl = "https://www.imdb.com/title/";

searchCache = {};
movieCache = {};

function searchMovies(searchTerm) {

  if(searchCache[searchTerm]) {
    console.log('Serving search from cache: ' + searchTerm)
    return Promise.resolve(searchCache[searchTerm]);
  }
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
      searchCache[searchTerm] = movies
      return movies;
    });
}

function getPoster (posterUrl) {
  return fetch(posterUrl)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);
      console.log(body)

      const poster = 'hello';
      return poster;
    })
}

function getMovie(imdbID) {

  if(movieCache[imdbID]) {
    console.log('Serving movie from cache: ' + imdbID)
    return Promise.resolve(movieCache[imdbID]);
  }

  return fetch(`${movieUrl}${imdbID}`)
    .then(response => response.text())
    .then(body => {
      const $ = cheerio.load(body);

      function getItems(itemArray) {
        return function(i, elem) {
          const item = $(elem)
            .text()
            .trim();
          itemArray.push(item);
        };
      }

      const $title = $(".title_wrapper h1");
      const title = $title
        .first()
        .contents()
        .filter(function() {
          return this.type === "text";
        })
        .text()
        .trim();

      const rating = $(".subtext")
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .replace(/,/g, "")
        .trim();

      const length = $(".subtext time")
        .text()
        .trim();

      const genres = new Array();
      $(".subtext a")
        .not(".subtext a[title]")
        .each(getItems(genres));

      const release = $(".subtext a[title]").text();
      const score = $('span[itemprop="ratingValue"]').text();
      const poster = $('div[class="poster"] a img').attr("src");
      const summary = $("div.summary_text")
        .text()
        .trim();

      const directors = new Array();
      pcheerio
        .find($, "div.credit_summary_item:first a")
        .each(getItems(directors));

      const writers = new Array();
      pcheerio.find($, ".credit_summary_item:eq(1) a").each(getItems(writers));
      const writersLastIndex = writers[writers.length - 1];
      if (writersLastIndex.indexOf("more credit") !== -1) {
        writers.pop();
      }

      const stars = new Array();
      pcheerio.find($, ".credit_summary_item:eq(2) a").each(getItems(stars));
      const starsLastIndex = stars[stars.length - 1];
      if (starsLastIndex.indexOf("See full cast & crew") !== -1) {
        stars.pop();
      }

      const story = $("#titleStoryLine div p span")
        .text()
        .trim();

      const budget = pcheerio
        .find($, "#titleDetails div.txt-block:eq(6)")
        .contents()
        .filter(function() {
          return this.type === "text";
        })
        .text()
        .trim();

      const trailer = $('div.slate a').attr('href');

      const movie = {
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
        story,
        budget,
        trailer: `https://www.imdb.com${trailer}`
      };

      movieCache[imdbID] = movie;
      return movie;
    });
}

module.exports = {
  searchMovies,
  getMovie
};
