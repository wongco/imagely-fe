import { previewFile } from '../helpers/helpers.js';

// begin App
console.log('Application Started!');

const uploadSubmitButton = document.querySelector('#upload--submit');

const fileInputEl = document.querySelector('#file--input');
// add event listener for image upload
fileInputEl.addEventListener('change', previewFile);
