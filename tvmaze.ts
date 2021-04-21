import axios from "axios"
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const defaultImage: string = 'https://martialartsplusinc.com/wp-content/uploads/2017/04/default-image-720x530.jpg';
const baseUrl: string = 'http://api.tvmaze.com/search/shows?q=';


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

interface Episode {
  id: number;
  name: string;
  season: number;
  number: number;
}

async function getShowsByTerm(term: string){
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(`${baseUrl}${term}`);
  let shows: Show = response.data.map((show) => {return {
    "id": show.show.id, 
    "name":show.show.name, 
    "summary": show.show.summary,
    "image": (show.show.image?.original || defaultImage)
  }});
  console.log("shows", shows);
   return shows;
}

$showsList.on("click", ".Show-getEpisodes", async function(e) {
  let showId = $(e.target).closest(".Show").attr("data-show-id");
	await getEpisodesOfShow(showId)
});

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes" >
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
  const term = $("#searchForm-term").val() as string;
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

async function getEpisodesOfShow(id) {

  const episodesUrl =`http://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(episodesUrl);
  let episodes: Episode = res.data.map((episode) => {return {
    "id": episode.id, 
    "name":episode.name, 
    "season": episode.season,
    "number": episode.number
  }});
  
  console.log(episodes);
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { }