/**************Выбор региона************************** */

const regions = ['Вся Россия', 'Алтайский край', 'Амурская область', 'Архангельская область', 'Астраханская область', 'Белгородская область', 'Брянская область', 'Владимирская область', 'Волгоградская область', 'Вологодская область', 'Воронежская область', 'Москва', 'Еврейская автономная область', 'Забайкальский край', 'Ивановская область', 'Иные территории, включая город и космодром Байконур', 'Иркутская область', 'Кабардино-Балкарская Республика', 'Калининградская область', 'Калужская область', 'Камчатский край', 'Карачаево-Черкесская Республика', 'Кемеровская область', 'Кировская область', 'Костромская область', 'Краснодарский край', 'Красноярский край', 'Курганская область', 'Курская область', 'Ленинградская область', 'Липецкая область', 'Магаданская область', 'Московская область', 'Мурманская область', 'Ненецкий автономный округ', 'Нижегородская область', 'Новгородская область', 'Новосибирская область', 'Омская область', 'Оренбургская область', 'Орловская область', 'Пензенская область', 'Пермский край', 'Приморский край', 'Псковская область', 'Республика Адыгея (Адыгея)', 'Республика Алтай', 'Республика Башкортостан', 'Республика Бурятия', 'Республика Дагестан', 'Республика Ингушетия', 'Республика Калмыкия', 'Республика Карелия', 'Республика Коми', 'Республика Крым', 'Республика Марий Эл', 'Республика Мордовия', 'Республика Саха (Якутия)', 'Республика Северная Осетия - Алания', 'Республика Татарстан (Татарстан)', 'Республика Тыва', 'Республика Хакасия', 'Ростовская область', 'Рязанская область', 'Самарская область', 'Санкт-Петербург', 'Саратовская область', 'Сахалинская область', 'Свердловская область', 'Севастополь', 'Смоленская область', 'Ставропольский край', 'Тамбовская область', 'Тверская область', 'Томская область', 'Тульская область', 'Тюменская область', 'Удмуртская Республика', 'Ульяновская область', 'Хабаровский край', 'Ханты-Мансийский автономный округ - Югра', 'Челябинская область', 'Чеченская Республика', 'Чувашская Республика - Чувашия', 'Чукотский автономный округ', 'Ямало-Ненецкий автономный округ', 'Ярославская область'];

const leningradRegion = ['Ленинградская область', 'Агалатово', 'Аннино', 'Бегуницы', 'Бокситогорск', 'Большая Вруда', 'Большая Ижора', 'Большие Колпаны', 'Бугры', 'Будогощь', 'Важины', 'Виллози', 'Винницы', 'Вознесенье', 'Войскорово', 'Волосово', 'Волхов', 'Всеволожск', 'Выборг', 'Вырица', 'Высоцк', 'Гатчина', 'Глажево', 'Горбунки', 'Гостилицы', 'Дружная Горка', 'Дубровка', 'Елизаветино', 'Ефимовский', 'Заклинье', 'Зеленогорск', 'Ивангород', 'Каменка', 'Каменногорск', 'Кингисепп', 'Кипень', 'Кириши', 'Кировск', 'Кобралово', 'Колпино', 'Колтуши', 'Колчаново', 'Коммунар', 'Котельский', 'Красное Село', 'Красный Бор', 'Кронштадт', 'Кудрово', 'Кузнечное', 'Кузьмоловский', 'Лаголово', 'Лебяжье', 'Лесколово', 'Лесогорский', 'Лодейное Поле', 'Ломоносов', 'Луга', 'Любань', 'Малое Верево', 'Малое Карлино', 'Мга', 'Мельниково', 'Металлострой', 'Мурино', 'Назия', 'Низино', 'Никольский', 'Никольское', 'Новая Ладога', 'Новое Девяткино', 'Новоселье', 'Новый Свет', 'Новый Учхоз', 'Нурма', 'Озерки (Всеволожский район)', 'Оредеж', 'Оржицы', 'Отрадное', 'Павловск', 'Парголово', 'Паша', 'пгт имени Свердлова', 'Первомайское', 'Петергоф', 'Пикалево', 'Подпорожье', 'посёлок имени Морозова', 'Приладожский', 'Приморск', 'Приозерск', 'Пудомяги', 'Пушкин', 'Разметелево', 'Рахья', 'Репино', 'Романовка', 'Ромашкинское сельское поселение', 'Рощино', 'Русско-Высоцкое', 'Рябово', 'Светогорск', 'Селезнёво', 'Сельцо (посёлок, Волосовский район)', 'Семрино', 'Сертолово', 'Сестрорецк', 'Сиверский', 'Синявино', 'Славянка', 'Сланцы', 'Советский', 'Сосново', 'Сосновый Бор', 'Старая', 'Старая Ладога', 'Стрельна', 'Сусанино', 'Суходолье', 'Сясьстрой', 'Тайцы', 'Тельмана', 'Тихвин', 'Токсово', 'Толмачёво', 'Тосно', 'Ульяновка', 'Усть-Луга', 'Форносово', 'Шлиссельбург', 'Шушары', 'Ям-Ижора', 'Янино-'];

const nijegorodRegion = ['Нижегородская область', 'Ардатов', 'Арзамас', 'Арья', 'Афанасьево', 'Афонино', 'Балахна', 'Богородск', 'Большое Болдино', 'Большое Козино', 'Большое Мурашкино', 'Бор', 'Буревестник', 'Бутурлино', 'Вад', 'Варнавино', 'Вахтан', 'Вача', 'Ветлуга', 'Виля', 'Вознесенское', 'Володарск', 'Воротынец', 'Ворсма', 'Воскресенское', 'Выездное', 'Выкса', 'Гагино', 'Гидроторф', 'Горбатов', 'Горбатовка', 'Городец', 'Гремячево', 'Дальнее Константиново', 'Дзержинск', 'Дивеево', 'Досчатое', 'Дружба', 'Ждановский', 'Заволжье', 'Ильиногорск', 'Княгинино', 'Ковернино', 'Красные Баки', 'Кстово', 'Кулебаки', 'Линда', 'Лукино', 'Лукоянов', 'Лысково', 'Мулино', 'Мухтолово', 'Навашино', 'Нижний Новгород', 'Новосмолинский', 'Павлово', 'Первомайск', 'Перевоз', 'Пижма', 'Пильна', 'посёлок Память Парижской Коммуны', 'поселок Степана Разина', 'Починки', 'Решетиха', 'Саваслейка', 'Саров', 'Сатис', 'Семенов', 'Сергач', 'Сеченово', 'Сокольское', 'Сосновское', 'Спасское', 'Суроватиха', 'Сухобезводное', 'Сява', 'Тонкино', 'Тоншаево', 'Тумботино', 'Урень', 'Федяково', 'Центральный', 'Чернуха', 'Чкаловск', 'Шаранга', 'Шатки', 'Шахунья', 'Шиморское', 'Югане'];


//Формирование списка регионов на странице
const regionBodyUl = document.querySelector('.region__body--ul');
//в качестве шаблона для списка берем первый элемент
const templ1 = regionBodyUl.firstElementChild;
for (let i = 2; i < regions.length; i++) {
    let newItem = templ1.cloneNode(true);
    let atribDigit = String(i).padStart(3, '0');
    newItem.querySelector('.input-region').setAttribute('id', `region${atribDigit}`);
    newItem.querySelector('.region-multi').setAttribute('for', `region${atribDigit}`);
    newItem.querySelector('.region-multi').innerText = regions[i];
    regionBodyUl.append(newItem);
}

let regionsChecked = {}; //объект для фиксации выбранных регионов
for (let item of regions) {
    regionsChecked[item] = false; //изначально никакой регион не выбран
}

//Формирование списка населенных пунктов
const punktRegionUls = document.querySelectorAll('.punkt__region--ul');
//в качестве шаблона для списка берем первый элемент

//Ленинградская область

const templ2 = punktRegionUls[0].firstElementChild;
for (let i = 2; i < leningradRegion.length; i++) {
    let newItem = templ2.cloneNode(true);
    let atribDigit = String(i).padStart(3, '0');
    newItem.querySelector('.input-region').setAttribute('id', `punkt1_${atribDigit}`);
    newItem.querySelector('.region-multi').setAttribute('for', `punkt1_${atribDigit}`);
    newItem.querySelector('.region-multi').innerText = leningradRegion[i];
    punktRegionUls[0].append(newItem);
}

//Нижегородская область

const templ3 = punktRegionUls[1].firstElementChild;
for (let i = 2; i < nijegorodRegion.length; i++) {
    let newItem = templ3.cloneNode(true);
    let atribDigit = String(i).padStart(3, '0');
    newItem.querySelector('.input-region').setAttribute('id', `punkt2_${atribDigit}`);
    newItem.querySelector('.region-multi').setAttribute('for', `punkt2_${atribDigit}`);
    newItem.querySelector('.region-multi').innerText = nijegorodRegion[i];
    punktRegionUls[1].append(newItem);
}


// Формирование списка городов быстрого поиска
const searchCityList = document.querySelector('.choose__region .choose__quick-search ul');
const searchCityField = document.querySelector('.choose__region .choose__quick-search input');

const searchCitiesNames = [
    'Красный яр (Алтайский край)',
    'Красный яр (Амурская область)',
    'Красный яр (Архангельская область)',
    'Красный яр (Астраханская область)',
    'Красный яр (Башкортостан)',
    'Красный яр (Нижегородская область)',
    'Красный яр (Омская область)',
    'Красный яр (Самарская область)',
];

const searchCities = [];
searchCitiesNames.forEach((c, i) => {
    const newItem = templ3.cloneNode(true);
    const atribDigit = String(i).padStart(3, '0');
    newItem.querySelector('.input-region').setAttribute('id', `search-city_${atribDigit}`);
    newItem.querySelector('.region-multi').setAttribute('for', `search-city_${atribDigit}`);
    newItem.classList.add('search-city--hidden');
    newItem.setAttribute('data-name', c);

    searchCities.push(newItem);
});

searchCityList.classList.add('search-city-list--hidden');

for (const item of searchCities) {
    searchCityList.appendChild(item);
}

searchCityField.addEventListener('input', () => performCitySearch(searchCityField.value));
document.querySelector('.choose__region .choose__quick-search .cross').addEventListener('click', () => performCitySearch(''));

function performCitySearch(input) {
    input = input.toLowerCase().trim();
    const foundCities = searchCities.filter(c => input.length && c.getAttribute('data-name').toLowerCase().trim().includes(input));
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
    const match = text.match(new RegExp(pattern, 'ig'));
    console.log(match);
    for (const str of match) {
        text = text.replaceAll(str, `<span class="highlight">${str}</span>`);
    }
    return text;
}

const chooseRegion = document.querySelector('.choose__region');

const chooseRegionClose = document.querySelector('.choose__region--close');
const regionWork = document.querySelector('#region');
const regionStaff = document.querySelector('#region1');
const regionAny = document.querySelector('#region2');
const regionApply = document.querySelector('.region__apply');
const punktGroup = document.querySelector('.punkt__group');
const punktRegion = document.querySelector('.punkt__region');
const regionAll = document.querySelector('.region__all');
const punktAll = document.querySelector('.punkt__all');
const labelPunktAll = document.querySelector('.punkt-all');
const inputRegionAll = document.querySelector('.input-region-all');
const inputPunktAll = document.querySelector('.input-punkt-all');
const regionItems = document.querySelectorAll('.input-region-item');
const punktGroupItems = document.querySelectorAll('.punkt__group--item');
const inputPunktGroups = document.querySelectorAll('.input-punkt-group');
const inputPunktRegions = document.querySelectorAll('.input-punkt-region');
const punktRegionItems = document.querySelectorAll('.punkt__region--item');
const regionBody = document.querySelector('.region__body');
const regionBodyItems = document.querySelectorAll('.region__body--item');
const regionBodyUlItems = regionBodyUl.querySelectorAll('.region__body--item');
const itemLefts = document.querySelectorAll('.item-left');
const itemRights = document.querySelectorAll('.item-right');
const punktItems = document.querySelectorAll('.punkt-item');
const regionResets = document.querySelectorAll('.region__title--reset');
const leningradRegions = document.querySelectorAll('.leningrad-region');
const nnovgorodRegions = document.querySelectorAll('.nnovgorod-region');
let leningradChoosed = false;
let nnovgorodChoosed = false;
let allRegionChoosed = false;
let sumRegCheck = false;

//Показать список регионов
let outRegion;

regionWork.addEventListener('click', handl0);
// regionStaff.addEventListener('click', handl1);
// regionAny.addEventListener('click', handl2);

function handl0() {
    outRegion = document.getElementById('region');
    chooseRegion.classList.remove('up-block');
    cover.classList.remove('hidden');
    cover.classList.add('bg-dark');
    cover.classList.add('on-top');
    cover.addEventListener('click', () => {
        closeRegions();
    });
}

function handl1() {
    outRegion = document.getElementById('region1');
    chooseRegion.classList.remove('up-block');
}

function handl2() {
    outRegion = document.getElementById('region2');
    chooseRegion.classList.remove('up-block');
}

let closeRegions = function () {
    //деактивировать все чекбоксы и спрятать попап
    chooseRegion.classList.add('up-block');
    punktRegion.classList.add('hide-block');
    punktGroup.classList.add('hide-block');
    punktAll.classList.add('hide-block');
    labelPunktAll.classList.remove('color-black');
    inputPunktAll.checked = false;
    for (let item of inputPunktGroups) {
        item.checked = false;
    }
    chooseRegion.checked = false;
    punktRegion.checked = false;
    punktGroup.checked = false;
    inputRegionAll.checked = false;
    for (let item of regionItems) {
        item.checked = false;
    }
    for (let item of document.querySelectorAll('.white-font')) {
        item.classList.remove('white-font');
    }
    for (let item of document.querySelectorAll('.zindex50')) {
        item.classList.remove('zindex50');
    }

    cover.classList.add('hidden');
    cover.classList.remove('bg-dark');
    cover.classList.remove('on-top');
};

function clearRegions() {
    punktGroup.classList.add('hide-block');
    punktRegion.classList.add('hide-block');
    for (let item of regionItems) {
        item.checked = false;
    }
    for (let item of punktGroupItems) {
        item.classList.add('hide-block');
    }
    for (let item of punktRegionItems) {
        item.classList.add('hide-block');
    }
}
chooseRegionClose.onclick = () => closeRegions();

//Все регионы
regionAll.onclick = (e) => {
    if (e.target.tagName !== 'LABEL') {
        allRegionChoosed = !allRegionChoosed;
        if (allRegionChoosed) {
            punktAll.classList.remove('hide-block');
            //leningradChoosed = true;
            //nnovgorodChoosed = true;
            regionResets[0].classList.add('active');
            //sumRegCheck = true;
        } else {
            punktAll.classList.add('hide-block');
            leningradChoosed = false;
            nnovgorodChoosed = false;
            regionResets[0].classList.remove('active');
            sumRegCheck = false;
            for (let item of regions) {
                regionsChecked[item] = false; //никакой регион не выбран
            }
        }
    }
    punktRegion.classList.remove('hide-block');
    punktGroup.classList.remove('hide-block');
    labelPunktAll.classList.add('color-black');
    for (let item of punktGroupItems) {
        item.classList.remove('hide-block');
    }
    for (let item of punktRegionItems) {
        item.classList.remove('hide-block');
    }
    if (inputRegionAll.checked === true) {
        inputRegionAll.checked = false;
        clearRegions();
    } else {
        inputRegionAll.checked = true;
        for (let item of regionBodyItems) {
            if (item.querySelector('.region-left')) {
                item.querySelector('.region-left').checked = true;
            }
        }
    }
};

/****************Выбор региона************ */
for (let item of itemLefts) {
    item.addEventListener('click', chooseOneRegion);
}

function chooseOneRegion(e) {
    if (e.currentTarget.querySelector('input')) {
        let targ = e.currentTarget.querySelector('input');
        targ.checked = !targ.checked;
    } //обработка нажатия на квадратик

    if (e.target.tagName !== 'LABEL') {
        let regionCheck = e.currentTarget.querySelector('.region-multi').innerText;

        //Активировать/дезактивировать кнопку ОЧИСТИТЬ в регионах
        regionsChecked[regionCheck] = !regionsChecked[regionCheck];
        for (let key in regionsChecked) {
            sumRegCheck = sumRegCheck || regionsChecked[key];
        }
        if (sumRegCheck) {
            regionResets[0].classList.add('active');
            punktAll.classList.remove('hide-block');
        } else {
            regionResets[0].classList.remove('active');
            //punktAll.classList.add('hide-block');
        }
        sumRegCheck = false;
        //конец Активировать/дезактивировать кнопку ОЧИСТИТЬ в регионах

        //Показать/спрятать кнопку Все населенные пункты при выборе
        //Ленинградской или Нижегородской областей
        if (regionCheck === 'Ленинградская область') {
            leningradChoosed = !leningradChoosed;
        }
        if (regionCheck === 'Нижегородская область') {
            nnovgorodChoosed = !nnovgorodChoosed;
        }
        if (leningradChoosed || nnovgorodChoosed) {
            regionResets[0].classList.add('active');
            punktAll.classList.remove('hide-block');
        }
        if (!leningradChoosed && !nnovgorodChoosed && !allRegionChoosed) {
            punktAll.classList.add('hide-block');
        }
        //Конец Показать/спрятать кнопку Все населенные пункты

        //Показать/спрятать населенные пункты при выборе
        //Ленинградской или Нижегородской областей
        if (e.currentTarget.querySelector('.region-left').checked) {
            for (let item of punktGroupItems) {
                if (item.getAttribute('data-region') === regionCheck) {
                    punktGroup.classList.remove('hide-block');
                    punktRegion.classList.remove('hide-block');
                    item.classList.remove('hide-block');
                }
            }
            for (let item of punktRegionItems) {
                if (item.getAttribute('data-region') === regionCheck) {
                    item.classList.remove('hide-block');
                }
            }
        } else {
            for (let item of punktGroupItems) {
                if (item.getAttribute('data-region') === regionCheck) {
                    item.classList.add('hide-block');
                }
            }
            for (let item of punktRegionItems) {
                if (item.getAttribute('data-region') === regionCheck) {
                    item.classList.add('hide-block');
                }
            }
        }
    }
}
/**************Конец выбор региона**********/


//Очистить регионы
//const regionResets = document.querySelectorAll('.region__title--reset');//Определено выше
regionResets[0].onclick = (e) => {
    e.target.classList.remove('active');
    punktAll.classList.add('hide-block');
    inputRegionAll.checked = false;
    allRegionChoosed = false;
    leningradChoosed = false;
    nnovgorodChoosed = false;
    sumRegCheck = false;
    for (let key in regionsChecked) {
        regionsChecked[key] = false;
    }
    clearRegions();
    document.getElementById('punkt-all').checked = false;
    for (let item of inputPunktGroups) {
        item.checked = false;
    }
    for (let item of inputPunktRegions) {
        item.checked = false;
    }
};

// Работа с пунктами*********************
let punktsLeningradChecked = {}; //объект для фиксации выбранных пунктов Ленинградской обл
for (let item of leningradRegion) {
    punktsLeningradChecked[item] = false; //изначально никакой пункт не выбран
}
let punktsNnovgorodChecked = {}; //объект для фиксации выбранных пунктов Нижегородской обл
for (let item of nijegorodRegion) {
    punktsNnovgorodChecked[item] = false; //изначально никакой пункт не выбран
}
let sumLeningradCheck = false;
let sumNnovgorodCheck = false;

//Кнопка Все населенные пункты
punktAll.onclick = (e) => {
    if (inputPunktAll.checked === true) {
        regionResets[1].classList.remove('active');
        inputPunktAll.checked = false;
        for (let item of itemRights) {
            item.firstElementChild.checked = false;
        }
        for (let item of inputPunktGroups) {
            item.checked = false;
        }
        for (let item of inputPunktRegions) {
            item.checked = false;
        }
    } else {
        inputPunktAll.checked = true;
        regionResets[1].classList.add('active');
        for (let item of itemRights) {
            item.firstElementChild.checked = true;
        }
        for (let item of inputPunktGroups) {
            item.checked = true;
        }
        for (let item of inputPunktRegions) {
            item.checked = true;
        }
    }
};

//Обработка нажатий на города и области
let app = {};
app.state = false;

for (let item of punktGroupItems) {
    item.addEventListener('click', handlerReg);
}
for (let item of punktRegionItems) {
    item.addEventListener('click', handlerReg1);
}

for (let item of leningradRegions) {
    item.addEventListener('click', handlerReg2);
}
for (let item of nnovgorodRegions) {
    item.addEventListener('click', handlerReg3);
}

function isAnyPunktChecked() {
    let sum1 = false;
    let sum2 = false;
    let cond0 = inputPunktGroups[0].checked;
    let cond1 = inputPunktGroups[1].checked;
    let cond2 = inputPunktAll.checked;
    let cond3 = document.querySelectorAll('.punkt-region-item')[0].checked;
    let cond4 = document.querySelectorAll('.punkt-region-item')[1].checked;

    for (let key in punktsLeningradChecked) {
        sum1 = sum1 || punktsLeningradChecked[key];
    }
    for (let key in punktsNnovgorodChecked) {
        sum2 = sum2 || punktsNnovgorodChecked[key];
    }
    if (!sum1 && !sum2 && !cond0 && !cond1 && !cond2 && !cond3 && !cond4) {
        regionResets[1].classList.remove('active');
    }
}

function handlerReg(e) {
    let targ = e.currentTarget.querySelector('input');
    targ.checked = !targ.checked;
    //активировать/дезактивировать кнопку ОЧИСТИТЬ в пунктах
    if (targ.checked) {
        regionResets[1].classList.add('active');
    } else {
        isAnyPunktChecked();
    }
}

function handlerReg1(e) {
    if (app.state) {
        return;
    }
    let targ = e.currentTarget.children[1];
    targ.checked = !targ.checked;

    for (let item of e.currentTarget.querySelectorAll('.punkt-item')) {
        item.checked = true;
        if (!targ.checked) {
            item.checked = false;
        }
    }
    //активировать/дезактивировать кнопку ОЧИСТИТЬ в пунктах
    if (targ.checked) {
        regionResets[1].classList.add('active');

        //Ленинградская область
        if (e.currentTarget.getAttribute('data-region') == 'Ленинградская область') {
            for (let key in punktsLeningradChecked) {
                punktsLeningradChecked[key] = true;
            }
        }
        //Нижегородская область
        if (e.currentTarget.getAttribute('data-region') == 'Нижегородская область') {
            for (let key in punktsNnovgorodChecked) {
                punktsNnovgorodChecked[key] = true;
            }
        }
    } else {
        //Ленинградская область
        if (e.currentTarget.getAttribute('data-region') == 'Ленинградская область') {
            for (let key in punktsLeningradChecked) {
                punktsLeningradChecked[key] = false;
            }
        }
        //Нижегородская область
        if (e.currentTarget.getAttribute('data-region') == 'Нижегородская область') {
            for (let key in punktsNnovgorodChecked) {
                punktsNnovgorodChecked[key] = false;
            }
        }
        isAnyPunktChecked();
    }
}

function handlerReg2(e) {
    let targ = e.currentTarget.firstElementChild;
    targ.checked = !targ.checked;
    app.state = true;
    setTimeout(() => {
        app.state = false;
    }, 1000);
    //пункты Ленинградской области
    if (e.target.tagName !== 'LABEL') {
        let punktCheck = e.currentTarget.querySelector('.region-multi').innerText;

        //активировать/дезактивировать кнопку ОЧИСТИТЬ в пунктах
        punktsLeningradChecked[punktCheck] = !punktsLeningradChecked[punktCheck];
        for (let key in punktsLeningradChecked) {
            sumLeningradCheck = sumLeningradCheck || punktsLeningradChecked[key];
        }
        if (sumLeningradCheck) {
            regionResets[1].classList.add('active');
        } else {
            isAnyPunktChecked();
        }
    }
    sumLeningradCheck = false;
}

function handlerReg3(e) {
    let targ = e.currentTarget.firstElementChild;
    targ.checked = !targ.checked;
    app.state = true;
    setTimeout(() => {
        app.state = false;
    }, 1000);
    //пункты Нижегородской области
    if (e.target.tagName !== 'LABEL') {
        let punktCheck = e.currentTarget.querySelector('.region-multi').innerText;

        //активировать/дезактивировать кнопку ОЧИСТИТЬ в пунктах
        punktsNnovgorodChecked[punktCheck] = !punktsNnovgorodChecked[punktCheck];
        for (let key in punktsNnovgorodChecked) {
            sumNnovgorodCheck = sumNnovgorodCheck || punktsNnovgorodChecked[key];
        }
        if (sumNnovgorodCheck) {
            regionResets[1].classList.add('active');
        } else {
            isAnyPunktChecked();
        }
    }
    sumNnovgorodCheck = false;
}

//Очистить пункты
regionResets[1].onclick = (e) => {
    e.target.classList.remove('active');
    for (let item of inputPunktGroups) {
        item.checked = false;
    }
    for (let item of inputPunktRegions) {
        item.checked = false;
    }
    for (let item of regionItems) {
        if (item.parentNode.parentNode.classList.contains('punkt__region--ul')) {
            item.checked = false;
        }
    }
    document.getElementById('punkt-all').checked = false;
};

//Нажатие на кнопку Выбрать
let outRegionText = '';
let outPunktText = '';
let outText = '';
regionApply.addEventListener('click', handlerRegApply);

function handlerRegApply() {
    for (let item of document.querySelectorAll('.white-font')) {
        item.classList.remove('white-font');
    }
    for (let item of document.querySelectorAll('.zindex50')) {
        item.classList.remove('zindex50');
    }
    chooseRegion.classList.add('up-block');

    //посчитать число выбранных регионов и пунктов
    let countRegion = 0;
    let countPunkt = 0;
    for (let item of itemLefts) {
        if (item.querySelector('.input-region').checked) {
            outRegionText = item.querySelector('label').innerText + ' ';
            countRegion++;
        }
    }
    if (!countRegion) {
        closeRegions();
        return;
    }

    for (let item of punktItems) {
        if (item.checked) {
            outPunktText = item.nextElementSibling.innerText;
            countPunkt++;
        }
    }

    if (countRegion > 1) {
        outRegionText = countRegion + ' Региона, ';
    }

    if (countPunkt == 0) {
        outPunktText = 0 + ' Насел. пункта';
    }
    if (countPunkt > 1) {
        outPunktText = countPunkt + ' Насел. пункта';
    }
    outText = outRegionText + outPunktText;
    outRegion.textContent = outText;

    if (outRegion.value) {
        outRegion.classList.add('inputsel'); //сохранили подчеркивание
    }

    // outRegion.nextElementSibling.classList.add('input-field-focus');
    setTimeout(() => {
        closeRegions();
    }, 200);
}

/**************Конец Выбор региона******************** */

