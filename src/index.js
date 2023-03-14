import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

let nameOfCountry = '';

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

clearList();
refs.input.addEventListener(
  'input',
  debounce(event => {
    nameOfCountry = event.target.value.trim();

    if (nameOfCountry === '') {
      clearList();
      return;
    }

    clearList();
    getCountries(nameOfCountry);
  }, DEBOUNCE_DELAY)
);

function getCountries(nameOfCountry) {
  fetchCountries(nameOfCountry)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      data.forEach(value => {
        const country = value.name.official;
        const capital = value.capital[0];
        const population = value.population;
        const flags = value.flags.svg;
        const languages = Object.values(value.languages);
        markup(data, country, flags, capital, population, languages);
      });
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function markup(data, country, flags, capital, population, languages) {
  if (data.length >= 2 && data.length <= 10) {
    refs.list.insertAdjacentHTML(
      'beforeend',
      `<li class="country-item">
        <img src="${flags}" alt="${country}" width="35" />
        <h3>${country}</h3>
      </li>`
    );
  } else if (data.length === 1) {
    refs.list.insertAdjacentHTML(
      'beforeend',
      `<li class="country-item">
        <img src="${flags}" alt="${country}" width="50" />
        <h1>${country}</h1>
      </li>`
    );

    refs.info.insertAdjacentHTML(
      'beforeend',
      `<h2>Capital: <span class="text-info">${capital}</span></h2>
      <h2>Population: <span class="text-info">${population}</span></h2>
      <h2>Languages: <span class="text-info">${languages}</span></h2>`
    );
  }
}

function clearList() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}
