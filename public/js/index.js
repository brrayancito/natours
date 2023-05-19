/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login.js';
import { updateUserData } from './updateSettings.js';
import { displayMap } from './leaflet.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const formLogin = document.querySelector('.form--login');
const formUpdateUser = document.querySelector('.form-user-data');
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

if (formUpdateUser) {
  formUpdateUser.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    updateUserData(name, email);
  });
}
