const URL = 'https://restcountries.com/v3.1/name'

export default function fetchCountry(name) {
    return fetch(`${URL}/${name}?fields=name,capital,population,flags,languages`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        })
}