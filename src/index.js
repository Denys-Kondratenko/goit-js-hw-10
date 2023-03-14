import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;
let nameOfCountry = '';

const refs = {
  input: document.querySelector('#search-box'),
};

refs.input.addEventListener(
  'input',
  debounce(event => {
    nameOfCountry = event.target.value.trim();

    if (nameOfCountry === '') {
      return;
    }

    console.log(event.target.value);
    fetchCountries(nameOfCountry)
      .then(data => {
        console.log(data);
        data.forEach(value => {
          const country = value.name.official;
          const capital = value.capital[0];
          const population = value.population;
          const flags = value.flags.svg;
          const languages = Object.values(value.languages);
          console.log(country, capital, population, flags, languages);
        });
      })
      .catch(error => {
        console.log('помилка', error);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }, DEBOUNCE_DELAY)
);
