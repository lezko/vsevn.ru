const liTemplate = document.createElement('li');
liTemplate.classList.add('region__body--item');
liTemplate.innerHTML = `
    <input class="input-region input-region-item" type="checkbox" name="region-item">
    <label class="region-multi"></label>
`;

const categoryTemplate = document.createElement('li');
categoryTemplate.classList.add('punkt__group--item');
categoryTemplate.innerHTML = `
    <input class="input-punkt-group punkt-group-item punkt-item" type="checkbox" name="punkt-group-item">
    <label class="region-multi punkt-group punkt-bold"></label>
`;

const regionCitiesTemplate = document.createElement('li');
regionCitiesTemplate.classList.add('punkt__region--item');
regionCitiesTemplate.innerHTML = `
    <input class="input-punkt-region punkt-region-item" type="checkbox" name="punkt-region-item">
    <label class="region-multi punkt-region punkt-bold"></label>
    <ul class="punkt__region--ul multi"></ul>
`;


// Формирование списка городов быстрого поиска
const searchCityList = document.querySelector('.choose__region .choose__quick-search ul');
const searchCityField = document.querySelector('.choose__region .choose__quick-search input');

const searchCities = [];

function initSearchCities() {
    searchCitiesNames.forEach((c, i) => {
        const newItem = liTemplate.cloneNode(true);
        newItem.querySelector('.input-region').setAttribute('id', `search-city_${i}`);
        newItem.querySelector('.region-multi').setAttribute('for', `search-city_${i}`);
        newItem.classList.add('search-city--hidden');
        newItem.setAttribute('data-name', c);

        searchCities.push(newItem);
    });

    for (const item of searchCities) {
        searchCityList.appendChild(item);
    }
}

searchCityList.classList.add('search-city-list--hidden');

searchCityField.addEventListener('input', () => performCitySearch(searchCityField.value));
document.querySelector('.choose__region .choose__quick-search .cross').addEventListener('click', () => performCitySearch(''));

function performCitySearch(input) {
    input = input.toLowerCase().trim();
    const foundCities = searchCities.filter(c => input.length && c.getAttribute('data-name').toLowerCase().trim().startsWith(input));
    if (foundCities.length) {
        searchCityList.classList.remove('search-city-list--hidden');
        for (const city of searchCities) {
            if (foundCities.includes(city)) {
                city.querySelector('.region-multi').innerHTML = highlightText(city.getAttribute('data-name'), input);
                city.classList.remove('search-city--hidden');
            } else {
                city.classList.add('search-city--hidden');
            }
        }
    } else {
        searchCityList.classList.add('search-city-list--hidden');
    }
}

function highlightText(text, pattern) {
    const match = text.match(new RegExp(pattern, 'ig'))[0];
    text = text.replace(match, `<span class="highlight">${match}</span>`);
    return text;
}

const chooseRegion = document.querySelector('.choose__region');

const submitRegionBtn = document.querySelector('.region__apply');
const regionList = document.querySelector('.choose__region .region__body--ul');
const chooseRegionClose = document.querySelector('.choose__region--close');
const clearRegionsBtn = document.querySelector('.choose__region--region .region__title--reset');
const clearCitiesBtn = document.querySelector('.choose__region--punkt .region__title--reset');
const mainCityList = document.querySelector('.punkt__group');
const regionCityList = document.querySelector('.punkt__region');
const regionsMainLabel = document.querySelector('.region-all');
const regionsMainCheckbox = document.querySelector('.input-region-all');
const citiesMainItem = document.querySelector('.punkt__all');
const citiesMainCheckbox = document.querySelector('.punkt__all input');
const citiesMainLabel = document.querySelector('.punkt__all label');

const regions = [], regionsChecked = [], citiesChecked = [];
let regionsTotal, citiesTotal, searchCitiesNames;

fetch('regions.json').then(data => data.json()).then(initRegions);

function setupRegion(region) {
    region.switchCities = setupRegionCities(region.cities.controller, region.cities.list);
    region.switchMainCity = (checked, updateCheckbox = false) => {
        if (checked && !citiesChecked.includes(region.mainCity)) {
            citiesChecked.push(region.mainCity);
        } else if (!checked && citiesChecked.includes(region.mainCity)) {
            citiesChecked.splice(citiesChecked.indexOf(region.mainCity), 1);
        }

        if (updateCheckbox) {
            region.mainCity.checkbox.checked = checked;
        } else {
            updateCitiesMainCheckbox();
        }

        updateClearBtns();
    };
    region.switch = (checked, updateCheckbox = false) => {
        if (checked && !regionsChecked.includes(region)) {
            regionsChecked.push(region);
        } else if (!checked && regionsChecked.includes(region)) {
            regionsChecked.splice(regionsChecked.indexOf(region), 1);
        }

        if (updateCheckbox) {
            region.checkbox.checked = checked;
        } else {
            updateRegionsMainCheckbox();
        }

        region.cities.container.classList.remove('hide-block');

        if (checked) {
            region.cities.container.classList.remove('hide-block');
            region.mainCity.container.classList.remove('hide-block');
        } else {
            region.cities.container.classList.add('hide-block');
            region.mainCity.container.classList.add('hide-block');
            region.switchCities(false);
            region.switchMainCity(false, true);
        }

        updateClearBtns();
    };

    region.label.addEventListener('click', () => {
        region.switch(!region.checkbox.checked);
        updateCitiesMainItem();
    });

    region.mainCity.label.addEventListener('click', () => region.switchMainCity(!region.mainCity.checkbox.checked));
}

function setupRegionCities(controller, cityList) {
    let checkedCount = 0;

    const switchCity = (city, checked, updateCheckbox = false) => {
        if (updateCheckbox) {
            city.checkbox.checked = checked;
        }

        if (checked && !citiesChecked.includes(city)) {
            citiesChecked.push(city);
            checkedCount++;
        } else if (!checked && citiesChecked.includes(city)) {
            citiesChecked.splice(citiesChecked.indexOf(city), 1);
            checkedCount--
        }
    }

    const updateController = () => {
        controller.checkbox.checked = checkedCount > 0 && checkedCount === cityList.length;
    };

    const switchAll = checked => {
        for (const city of cityList) {
            switchCity(city, checked, true);
        }
    };

    controller.label.addEventListener('click', () => {
        switchAll(!controller.checkbox.checked);
        updateClearBtns();
        updateCitiesMainCheckbox();
    });

    for (const city of cityList) {
        city.label.addEventListener('click', () => {
            switchCity(city, !city.checkbox.checked);
            updateController();
            updateClearBtns();
            updateCitiesMainCheckbox();
        });
    }

    return function (checked) {
        switchAll(checked);
        updateController();
        updateClearBtns();
    };
}

function initRegions(data) {
    regionsTotal = data.length;
    citiesTotal = data.reduce((acc, item) => {
        acc += item.cities.length;
        return acc;
    }, 0);
    searchCitiesNames = data.reduce((arr, reg) => {
        arr.push(reg.main_city);
        for (const city of reg.cities) {
            arr.push(city);
        }
        return arr;
    }, []);
    initSearchCities();

    let citiesCounter = 0;

    for (const [i, region] of data.entries()) {
        const regionObj = {};

        const newRegion = liTemplate.cloneNode(true);
        const regionLabel = newRegion.querySelector('label');
        const regionCheckbox = newRegion.querySelector('input');

        regionLabel.textContent = region.name;
        regionCheckbox.setAttribute('id', `region-item-${i}`);
        regionLabel.setAttribute('for', `region-item-${i}`);

        regionList.appendChild(newRegion);

        regionObj.label = regionLabel;
        regionObj.checkbox = regionCheckbox;

        const mainCity = categoryTemplate.cloneNode(true);
        const mainCityLabel = mainCity.querySelector('label');
        const mainCityCheckbox = mainCity.querySelector('input');

        mainCityLabel.textContent = region.main_city;
        mainCityCheckbox.setAttribute('id', `center-city-item-${i}`);
        mainCityLabel.setAttribute('for', `center-city-item-${i}`);
        mainCity.classList.add('hide-block');

        mainCityList.appendChild(mainCity);

        regionObj.mainCity = {};
        regionObj.mainCity.container = mainCity;
        regionObj.mainCity.label = mainCityLabel;
        regionObj.mainCity.checkbox = mainCityCheckbox;

        const cities = regionCitiesTemplate.cloneNode(true);
        const citiesLabel = cities.querySelector('label');
        const citiesCheckbox = cities.querySelector('input');
        const citiesList = cities.querySelector('ul');
        cities.classList.add('hide-block');

        citiesCheckbox.setAttribute('id', `region-cities-${i}`);
        citiesLabel.setAttribute('for', `region-cities-${i}`);

        regionCityList.appendChild(cities);

        regionObj.cities = {};
        regionObj.cities.container = cities;
        regionObj.cities.controller = {};
        regionObj.cities.controller.label = citiesLabel;
        regionObj.cities.controller.checkbox = citiesCheckbox;
        regionObj.cities.list = [];

        citiesLabel.textContent = region.name;

        for (const [i, cityName] of region.cities.entries()) {
            const city = liTemplate.cloneNode(true);
            const cityLabel = city.querySelector('label');
            const cityCheckbox = city.querySelector('input');

            cityCheckbox.setAttribute('id', `region-city-${citiesCounter}`);
            cityLabel.setAttribute('for', `region-city-${citiesCounter}`);

            citiesCounter++;

            cityLabel.textContent = cityName;

            citiesList.appendChild(city);

            regionObj.cities.list.push({ label: cityLabel, checkbox: cityCheckbox });
        }

        regions.push(regionObj);
        setupRegion(regionObj);
    }
}

function updateClearBtns() {
    if (regionsChecked.length > 0) {
        clearRegionsBtn.classList.add('active');
    } else {
        clearRegionsBtn.classList.remove('active');
    }

    if (citiesChecked.length > 0) {
        clearCitiesBtn.classList.add('active');
    } else {
        clearCitiesBtn.classList.remove('active');
    }
}

function updateCitiesMainItem() {
    if (regionsChecked.length > 0) {
        citiesMainItem.classList.remove('hide-block');
    } else {
        citiesMainItem.classList.add('hide-block');
    }
}

function updateRegionsMainCheckbox() {
    regionsMainCheckbox.checked = regionsChecked.length === regionsTotal;
}

function updateCitiesMainCheckbox() {
    const citiesAvailable = regionsChecked.reduce((n, reg) => {
        n += reg.cities.list.length + 1;
        return n;
    }, 0);
    citiesMainCheckbox.checked = citiesAvailable > 0 && citiesAvailable === citiesChecked.length;
}

regionsMainLabel.addEventListener('click', () => {
    const checked = !regionsMainCheckbox.checked;
    for (const region of regions) {
        region.switch(checked, true);
    }
    updateCitiesMainItem();
});

citiesMainLabel.addEventListener('click', () => {
    const checked = !citiesMainCheckbox.checked;
    for (const region of regionsChecked) {
        region.switchMainCity(checked, true);
        region.switchCities(checked);
    }
});

clearRegionsBtn.addEventListener('click', () => {
    while (regionsChecked.length > 0) {
        const region = regionsChecked.pop();
        region.switch(false, true);
    }
    updateClearBtns();
    updateRegionsMainCheckbox();
    updateCitiesMainItem();
    updateCitiesMainCheckbox();
});

clearCitiesBtn.addEventListener('click', () => {
    for (const region of regionsChecked) {
        region.switchMainCity(false, true);
        region.switchCities(false);
    }
    updateCitiesMainCheckbox();
});

let submitCallback;
function showChooseRegionPopup(callback) {
    chooseRegion.classList.remove('up-block');
    cover.classList.remove('hidden');
    cover.classList.add('bg-dark');
    cover.classList.add('on-top');

    submitCallback = callback;
}

submitRegionBtn.addEventListener('click', () => {
    closeRegions();
});

cover.addEventListener('click', () => {
    if (chooseRegion.classList.contains('up-block')) {
        return;
    }
    closeRegions();
});

function closeRegions() {
    chooseRegion.classList.add('up-block');
    cover.classList.add('hidden');
    cover.classList.remove('bg-dark');
    cover.classList.remove('on-top');

    const regions = regionsChecked.reduce((arr, reg) => {
        arr.push(reg.label.textContent.trim());
        return arr;
    }, []);
    const cities = citiesChecked.reduce((arr, city) => {
        arr.push(city.label.textContent.trim());
        return arr;
    }, []);

    try {
        submitCallback(regions, cities);
        // console.log(regions);
        // console.log(cities);
    } catch (e) {
        console.error(e);
    }
}

chooseRegionClose.onclick = () => closeRegions();
