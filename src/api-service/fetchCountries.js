
const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.status);
    })
}


export default { fetchCountries };
