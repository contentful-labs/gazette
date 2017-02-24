'use strict';

require('es6-promise/auto');

const React = require('react');
const ReactDOM = require('react-dom');
const FontFaceObserver = require('fontfaceobserver');

const App = require('./app.js');

const loaderEl = document.getElementById('pre-app-loader');
const appEl = document.getElementById('app');

ReactDOM.render(<App />, appEl);

Promise.all([
  loadFont('Playfair Display'),
  loadFont('Playfair Display', 700),
  loadFont('Playfair Display', 900),
  loadFont('Playfair Display', 400, 'italic'),
  loadFont('Droid Serif'),
  loadFont('Droid Serif', 700),
  loadFont('Droid Serif', 400, 'italic'),
  loadFont('Droid Serif', 700, 'italic')
]).then(showApp, showApp);

function showApp () {
  loaderEl.style.display = 'none';
  appEl.style.display = 'block';
}

function loadFont (ff, weight = 400, style = 'normal') {
  const font = new FontFaceObserver(ff, {weight, style});
  return font.load(null, 1500);
}
