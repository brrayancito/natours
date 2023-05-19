/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { displayMap } from './leaflet.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const formUpdateData = document.querySelector('.form-user-data');
const formUpdatePassword = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');

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

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    await updateSettings({ name, email }, 'data');

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
