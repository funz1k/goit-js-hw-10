import './css/styles.css';
import Notiflix, { Loading } from 'notiflix';
import "notiflix/dist/notiflix-3.2.5.min.css";
var debounce = require('lodash.debounce');
import fetchCountry from './API';
import baseCountryTpl from "./templates/baseCounty.hbs";
import fullCountryTpl from "./templates/fullCountry.hbs";

const DEBOUNCE_DELAY = 300;

const refs = {
    searchInput: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
}

const renderCountries = (data) => {
    if (data.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
        return
    }
    if (data.length > 1) {
        clearIntarface()
        // const markup = data.map(({ name, flags }) => {
        //     return `
        //     <li>
        //     <img src="${flags.svg}" width="25" class="country-preview">
        //     <span>
        //     ${name.official}</li>
        //     </span>
        //     `
        // }).join('');
        refs.countryList.innerHTML = baseCountryTpl(data)
    }
    if (data.length === 1) {
        clearIntarface()
        // const markup = data.map(({ name, capital, population, flags, languages }) => {
        //     return `
        //     <p>
        //     <img src="${flags.svg}" width="30" class="country-preview">
        //     <span class="country-name">
        //     ${name.common}
        //     </span>
        //     </p>
        //     <ul>
        //     <li><span class="country-info">Capital:</span> ${capital}</li>
        //     <li><span class="country-info">Population:</span> ${population}</li>
        //     <li><span class="country-info">Languages:</span> ${Object.values(languages).map((language) => ` ${language}`)}</li>
        //     </ul>
        //     `
        // }).join('');
        refs.countryInfo.innerHTML = fullCountryTpl(data)
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
            clearIntarface()
            Notiflix.Notify.failure('Oops, there is no country with that name')
        })
    } else (
        clearIntarface()
    )
}

refs.searchInput.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));
