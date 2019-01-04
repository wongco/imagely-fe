import { APP_API_BASE_URL, SONG_API_BASE } from '../app/config.js';

// callback to run after image file is uploaded
export function previewFile() {
  const preview = document.querySelector('img');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();

  let encodedImg;
  // create even listener to process file upload

  reader.addEventListener(
    'load',
    async () => {
      preview.src = reader.result;
      // base64 encoded message
      encodedImg = reader.result.split(',')[1];

      // event listener to send to getRelations function
      const uploadSubmitButtonEl = document.querySelector('#upload--submit');
      uploadSubmitButtonEl.addEventListener(
        'click',
        getRelations.bind(null, encodedImg)
      );

      const previewContainer = document.querySelector('#preview--container');
      previewContainer.classList.add('show');
      previewContainer.classList.remove('hide');
    },
    false
  );

  if (file) {
    // if file exists, execute callback
    reader.readAsDataURL(file);
  }
}

// callback for submit event - function to retrieve info from API
async function getRelations(encodedImg) {
  // get clarifai results
  const relationsList = await getClarifaiResults(encodedImg);
  console.log(relationsList);
  const firstTerm = relationsList[0].association;

  // get related song results
  const songsResults = await getPlaylist(firstTerm);

  const songsList = songsResults.playlist;
  const queryInfo = songsResults.info;

  // render to dom
  updateDom(songsList, firstTerm, queryInfo);
}

// send clarifai base64 encoded img and get back list of relations
async function getClarifaiResults(encodedImg) {
  console.log(`Sending stuff to ${APP_API_BASE_URL} via AJAX:`);
  console.log(encodedImg);

  const url = `${APP_API_BASE_URL}/images/`;
  const method = 'POST';
  console.log(`API METHOD: ${method}`);
  console.log(`API URL: ${url}`);
  const data = {
    encodedpic: encodedImg
  };
  const apiResponse = await $.ajax({
    url,
    method,
    data,
    error: () => {
      console.log('Error sending base64 image to API!');
    }
  });
  return apiResponse.relations;
}

async function getPlaylist(name) {
  const url = `${SONG_API_BASE}/song/`;
  const method = 'GET';
  console.log(`API METHOD: ${method}`);
  console.log(`API URL: ${url}`);
  const data = {
    name
  };
  const apiResponse = await $.ajax({
    url,
    method,
    data,
    error: () => {
      console.log('Error sending base64 image to API!');
    }
  });

  return apiResponse;
}

// update Front End with results
function updateDom(playlist, keyterm, queryInfo) {
  console.log(keyterm);
  console.log(playlist);
  console.log(` Query Tag by jon: ${queryInfo}`);

  // add code to send Query Info to Dom

  const maxLength = playlist.length > 5 ? 5 : playlist.length;
  for (let i = 0; i < maxLength; i++) {
    const songObj = playlist[i];
    const { song, artist, albumIMG } = songObj;
    renderSongToDOM(song, artist, albumIMG);
  }
}

function renderSongToDOM(song, artist, albumUrl) {
  // const $songsContainer = $('#songs-container');

  const songContainerEl = document.querySelector('#songs-container');
  songContainerEl.classList.add('show');

  const songDiv = document.createElement('div');
  songDiv.classList.add('row', 'py-2', 'border', 'align-items-center');

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('col-9', 'h4');
  titleSpan.innerText = `${song}`;

  const albumDiv = document.createElement('div');
  albumDiv.classList.add('col-3', 'row', 'justify-content-end');

  // image Element
  const imageEl = document.createElement('img');
  imageEl.setAttribute('src', albumUrl);

  // artist name div
  const artistDiv = document.createElement('div');
  artistDiv.innerText = artist;

  // append both to albumDiv
  albumDiv.appendChild(imageEl);
  albumDiv.appendChild(artistDiv);

  // append title and album info to songDiv
  songDiv.appendChild(titleSpan);
  songDiv.appendChild(albumDiv);

  // append content to songContainerEl
  songContainerEl.appendChild(songDiv);
}
