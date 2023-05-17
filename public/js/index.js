/* eslint-disable */

import '@babel/polyfill';
import { login } from './login.js';
import { displayMap } from './leaflet.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const formLogin = document.querySelector('.form');

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
