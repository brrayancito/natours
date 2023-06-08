/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { displayMap } from './leaflet.js';
import { bookTour } from './stripe.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const formUpdateData = document.querySelector('.form-user-data');
const formUpdatePassword = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const bookBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (formUpdateData) {
  formUpdateData.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save--setting').textContent = 'Updating...';

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // console.log(form);

    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    await updateSettings(form, 'data');

    document.querySelector('.btn--save--setting').textContent = 'Save settings';
  });
}

if (formUpdatePassword) {
  formUpdatePassword.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--save--password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save--password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const tourId = e.target.dataset.tourId;
    await bookTour(tourId);
  });
}
