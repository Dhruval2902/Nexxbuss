const APIkey = 'EUUH1p8yw3KlnQfhFS2R';
const searchInput = document.querySelector('input');
const searchForm = document.querySelector('form');
const searchList = document.querySelector('.streets');
const busList = document.querySelector('tbody');

function search(streetName) {
  fetch(`https://api.winnipegtransit.com/v3/streets.json?api-key=${APIkey}&name=${streetName}&usage=long`)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error('No streets found');
      }
    })
    .then(nameOfstreet => {
      let html = "";
      if (nameOfstreet.streets.length === 0) {
        html = "No street found"
      } else {
        for (let name of nameOfstreet.streets) {
          html += `<a href="#" data-street-key=${name.key}>${name.name}</a>`
        }
      }
      searchList.innerHTML = "";

      searchList.insertAdjacentHTML('afterbegin', html);
    })
}


function getStops(key) {
  let infoOfStops = {};

  fetch(`https://api.winnipegtransit.com/v3/stops.json?api-key=${APIkey}&street=${key}`)
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new Error('No stops found');
      }
    })
    .then(stops => {
      busSchedules(stops);
    })
}

function busSchedules(stop) {
  const busArray = [];
  for (let bus of stop.stops) {
    busArray.push(
      fetch(`https://api.winnipegtransit.com/v3/stops/${bus.key}/schedule.json?api-key=${APIkey}&max-results-per-route=2`)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          } else {
            throw new Error('No stops found');
          }
        })
        .then(busInfo => {
          for (let busDetails in busInfo) {
            return busInfo[busDetails];
          }
        }))
  }

  Promise.all(busArray)
    .then(result => {
      let html = '';
      for (let details of result) {
        for (let time of details["route-schedules"]) {
          html += `
          <tr>
            <td>${details.stop.street.name}</td>
            <td>${details.stop["cross-street"].name}</td>
            <td>${details.stop.direction}</td>
            <td>${time.route.key}</td>
            <td>${changeTime(time["scheduled-stops"][0].times.arrival.estimated)}</td>
          </tr>
          <tr>
            <td>${details.stop.street.name}</td>
            <td>${details.stop["cross-street"].name}</td>
            <td>${details.stop.direction}</td>
            <td>${time.route.key}</td>
            <td>${changeTime(time["scheduled-stops"][1].times.arrival.estimated)}</td>
          </tr>
        `        }
      }
      busList.innerHTML = "";
      busList.insertAdjacentHTML('afterbegin', html);
    })
}

function changeTime(timeToChange) {
  const options = {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit"
  };

  return new Date(timeToChange).toLocaleTimeString("canada", options);
}

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  search(searchInput.value);
  searchInput.value = "";
})

searchList.addEventListener('click', function (e) {
  if (e.target.nodeName === "A") {
    getStops(e.target.dataset.streetKey);
  }
})
