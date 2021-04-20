import axios from "axios"
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const defaultImage: string = 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fblackmantkd.com%2Fwp-content%2Fuploads%2F2017%2F04%2Fdefault-image-620x600.jpg&imgrefurl=https%3A%2F%2Fblackmantkd.com%2Fhome%2Fdefault-image%2F&tbnid=E__DFTIbn9J8IM&vet=12ahUKEwiLiff-843wAhXalIQIHagZCsQQMygAegUIARDOAQ..i&docid=3Spo0_G2kBrVVM&w=620&h=600&q=default%20image&ved=2ahUKEwiLiff-843wAhXalIQIHagZCsQQMygAegUIARDOAQ'
const baseUrl: string = 'http://api.tvmaze.com/search/shows?q='


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

interface Show {
  id: number;
  name: string;
  summary: string;
  image: string;
}

async function getShowsByTerm(term: string){
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(`${baseUrl}${term}`);
  let shows = response.data.map((show) => {return {
    "id": show.show.id, 
    "name":show.show.name, 
    "summary": show.show.summary,
    "image": show.show.image.original
  }});
  console.log("shows", shows);
   return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${defaultImage}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }