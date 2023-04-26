import debounce from 'lodash.debounce';
import API from './api-service/fetchCountries';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 500;

const refs = {
  inputSearch: document.querySelector('#search-box'),
  listCountry: document.querySelector('.country-list'),
  infoCountry: document.querySelector('.country-info')
};

refs.inputSearch.addEventListener('input', debounce(handleQuerySearch, DEBOUNCE_DELAY));

function handleQuerySearch(e) {
  e.preventDefault();

  const inputQuery = e.target.value.trim();

  fetchQuerySearchCountries(inputQuery);
}

function fetchQuerySearchCountries(inputQuery) {
  if (!inputQuery) {
    resetMarkup(refs.listCountry);
    resetMarkup(refs.infoCountry);
    return;
  }
  API.fetchCountries(inputQuery)

    .then(items => {
      if (items.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.', {
          timeout: 1500,
          showOnlyTheLastOne: true,
        });
      } else if (items.length >= 2 && items.length <= 10) {
        resetMarkup(refs.listCountry);
        listCountriesMarkup(items);
        resetMarkup(refs.infoCountry);
      } else {
        resetMarkup(refs.infoCountry);
        infoCountryMarkup(items);
        resetMarkup(refs.listCountry);
      }
    })
    .catch(() => {
      resetMarkup(refs.infoCountry);
      resetMarkup(refs.listCountry);
      Notify.failure('Oops, there is no country with that name', {
        timeout: 1500,
        showOnlyTheLastOne: true,
      });
    })
}

function listCountriesMarkup(items) {
  const markup = items
    .map(({ name, flags }) => {
      return `<li class="list-item">
                 <img src="${flags.svg}" alt="${flags.alt}" class="item-flag">
                 <h3 class="item-name">${name.official}</h3>
              </li>`;
    })
    .join('');
  return refs.listCountry.insertAdjacentHTML('beforeend', markup);
}

function infoCountryMarkup(items) {
  const markup = items
    .map(({ name, flags, capital, population, languages }) => {
      return `
              <div class="country-info__flag">
                <img src="${flags.svg}" alt="${flags.alt}" class="country-info__img">
                <h3 class="country-info__name">${name.official}</h3>
              </div>
              <ul class="blok-info">
                <li class="blok-info__item"> <b>Capital:</b>
                      <span class="blok-info__span">${capital}</span>
                </li>
                <li class="blok-info__item"> <b>Population:</b>
                      <span class="blok-info__span">${population}</span>
                </li>
                <li class="blok-info__item"> <b>Languages:</b>
                      <span class="blok-info__span">${Object.values(languages).join(', ')}</span>
                </li>
               </ul>
              `;
    })
    .join('');
  return refs.infoCountry.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
  el.innerHTML = '';
}