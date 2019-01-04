import { APP_API_BASE_URL, SONG_API_BASE } from '../app/config.js';

// callback to run after image file is uploaded
export function previewFile() {
  const preview = document.querySelector('#upload-preview');
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
async function getRelations(base64Img) {
  // get clarifai results
  const relatedWordList = await getClarifaiResults(base64Img);

  console.log('Relationships from Clarifai');
  console.log(relatedWordList);

  // take first result from clarifai
  const choice = Math.floor(Math.random() * relatedWordList.length);
  console.log(choice);
  const searchTerm = relatedWordList[choice].association;

  const keytermContainer = document.querySelector('#keyterm--container');
  keytermContainer.classList.add('show');
  keytermContainer.classList.remove('hide');

  const keyterm = document.querySelector('#keyterm');
  keyterm.innerText = searchTerm;

  const songResults = await getSongSuggestions(searchTerm);

  console.log('Results from SongAPI:');
  console.log(songResults);

  const { playlist, info } = songResults;

  // render to dom
  updateDom(playlist, info);
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

// get playList from SongAPI
async function getSongSuggestions(name) {
  const apiResponse = await $.ajax({
    url: `${SONG_API_BASE}/song/`,
    method: 'GET',
    data: {
      name
    },
    error: () => {
      console.log('Error obtaining info from SongAPI');
    }
  });

  return apiResponse;
}

// update Front End with results
function updateDom(playlist, info) {
  // add code to send Query Info to Dom

  const queryTerm = document.querySelector('#queryterm--container');
  queryTerm.classList.add('show');
  queryTerm.classList.remove('hide');

  const queryterm = document.querySelector('#queryterm');
  queryterm.innerText = info;

  const maxLength = playlist.length > 5 ? 5 : playlist.length;
  for (let i = 0; i < maxLength; i++) {
    const songObj = playlist[i];
    const { song, artist, albumIMG } = songObj;
    renderSongToDOM(song, artist, albumIMG);
  }
}

// render individual song to DOM
function renderSongToDOM(song, artist, albumUrl) {
  // const $songsContainer = $('#songs-container');

  const songContainerEl = document.querySelector('#songs-container');
  songContainerEl.classList.add('show');

  const songDiv = document.createElement('div');
  songDiv.classList.add(
    'row',
    'my-2',
    'py-2',
    'border',
    'align-items-center',
    'song--container'
  );

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('col-8', 'h4');
  titleSpan.innerText = `${song}`;

  const albumDiv = document.createElement('div');
  albumDiv.classList.add('col-4', 'row', 'justify-content-end');

  // artist name div
  const artistDiv = document.createElement('div');
  artistDiv.classList.add('text-center', 'mr-1');
  artistDiv.innerText = artist;

  // image Element
  const imageEl = document.createElement('img');
  imageEl.classList.add('album--art', 'mr-1');
  imageEl.setAttribute('src', albumUrl);

  // append both to albumDiv
  albumDiv.appendChild(artistDiv);
  albumDiv.appendChild(imageEl);

  // append title and album info to songDiv
  songDiv.appendChild(titleSpan);
  songDiv.appendChild(albumDiv);

  // append content to songContainerEl
  songContainerEl.appendChild(songDiv);
}
