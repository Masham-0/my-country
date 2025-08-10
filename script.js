'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

// const getCountryData = function (countryAlpha) {
//   fetch(`https://restcountries.com/v2/alpha/${countryAlpha}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const getCountryData = function (countryAlpha) {
  // Main country (alpha2 or alpha3 accepted)
  fetch(`https://restcountries.com/v2/alpha/${countryAlpha}`)
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => {
      // render main country
      renderCountry(data);

      const neighbors = data.borders;
      if (!neighbors || neighbors.length === 0) return; // no neighbors

      return Promise.all(
        neighbors.map(code =>
          fetch(`https://restcountries.com/v2/alpha/${code}`).then(res => {
            if (!res.ok) throw new Error(`Neighbor not found (${res.status})`);
            return res.json();
          })
        )
      ).then(neighborDatas => {
        neighborDatas.forEach(nd => renderCountry(nd, 'neighbour'));
      });
    })
    .catch(err => {
      console.error(err);
      renderError(`Something went wrong 💥 ${err.message}. Try again!`);
    });
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

btn.addEventListener('click', function () {
  const locale = navigator.language || navigator.userLanguage; // e.g., 'en-US'
  const countryCode = locale.split('-')[1]; // Extract 'US' from 'en-US'
  countryCode ? countryCode.toUpperCase() : null;
  getCountryData(countryCode);
  btn.style.display = 'none';
});
// getCountryData('PT');
// getCountryData('us');

/*
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/alpha/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    console.log(data);

    const html = `<article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} million people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};


const getCountryAndNeighbor = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/alpha/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    console.log(data);

    // Render country
    getCountryData(data.alpha2Code);

    // Get neighbor country (if exists)
    const neighbor = data.borders;
    console.log(neighbor);
    if (!neighbor) return;

    // Request neighbor country data
    neighbor.forEach(neighborAlpha => {
      getCountryData(neighborAlpha);
    });
  });
};

getCountryAndNeighbor('IN');
*/
