import { API_BASE_URL } from '../app/config.js';

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

// function to retrieve info from API
async function getRelations(encodedImg) {
  console.log(`Sending stuff to ${API_BASE_URL} via AJAX:`);
  console.log(encodedImg);

  const url = `${API_BASE_URL}/images`;
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
  console.log(apiResponse);
}
