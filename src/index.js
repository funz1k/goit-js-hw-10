import './css/styles.css';
import Notiflix, { Loading } from 'notiflix';
import "notiflix/dist/notiflix-3.2.5.min.css";
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

const URL = 'https://restcountries.com/v3.1/name'

function fetchCountry(name) {
    return fetch(`${URL}/${name}?fields=name,capital,population,flags,languages`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
}

const renderCountries = (data) => {
    if (data.length > 10) {
        Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.')
        return
    }
    if (data.length > 1) {
        clearIntarface()
        const markup = data.map(({ name, flags }) => {
            return `
            <li>
            <img src="${flags.svg}" width="25" class="country-preview">
            <span>
            ${name.official}</li>
            </span>
            `
        }).join('');
        refs.countryList.innerHTML = markup
    }
    if (data.length === 1) {
        clearIntarface()
        const markup = data.map(({ name, capital, population, flags, languages }) => {
            return `
            <p>
            <img src="${flags.svg}" width="30" class="country-preview">
            <span class="country-name">
            ${name.common}
            </span>
            </p>
            <ul>
            <li><span class="country-info">Capital:</span> ${capital}</li>
            <li><span class="country-info">Population:</span> ${population}</li>
            <li><span class="country-info">Languages:</span> ${Object.values(languages).map((language) => ` ${language}`)}</li>
            </ul>
            `
        }).join('');
        refs.countryInfo.innerHTML = markup
    }

}

const clearIntarface = () => {
    refs.countryList.innerHTML = ''
    refs.countryInfo.innerHTML = ''
}

const onSearchCountry = (e) => {
    let searchQuery = e.target.value.trim()
    if (searchQuery) {
        fetchCountry(searchQuery).then(renderCountries).catch(error => {
            Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.')
        })
    } else (
        clearIntarface()
    )
}

refs.searchInput.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));
