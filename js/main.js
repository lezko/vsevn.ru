// functions
function find(selector) {
    return document.querySelector(selector);
}

function findAll(selector) {
    return document.querySelectorAll(selector);
}

function getStyle(el, prop) {
    return window.getComputedStyle(el, null).getPropertyValue(prop);
}

function getBackgroundColor(el) {
    while (getStyle(el, 'background-color') === 'rgba(0, 0, 0, 0)' && el !== document.body) {
        el = el.parentNode;
    }
    return getStyle(el, 'background-color');
}

// set onclick = 'return false' to all links with empty href attribute
// to prevent them from reloading the page
findAll('a[href=""]').forEach(a => {
    a.addEventListener('click', e => e.preventDefault());
});

// custom checkbox
findAll('.checkbox').forEach(c => {
    c.addEventListener('click', e => {
        e.target.classList.toggle('active');
    });
});

// set yellow background on every even adv-item
findAll('.ads__items > article').forEach((a, i) => {
    if (i % 2 === 0) {
        a.classList.add('bg-yellow');
    }
});

// handle text overflow
function initFadeEffects(elems, findBackground) {
    elems.forEach(el => {
        if (findBackground) {
            el.style.setProperty('--ovf-fade-clr', getBackgroundColor(el));
        }
        if (el.scrollWidth > el.clientWidth) {
            el.classList.add('ovf-fade');
        } else {
            el.classList.remove('ovf-fade');
        }
    });
}

const elems = [].concat(...findAll('.adv-item__title'), ...findAll('.adv-item__city-list > li'), ...findAll('.ads__field-names span'));
initFadeEffects(elems, true);

window.addEventListener('resize', () => {
    initFadeEffects(elems, false);
});

// tab links (most used on filters)
findAll('.tab-links').forEach(parent => {
    const links = Array.from(parent.querySelectorAll('.tab-link'));
    let active = links.find(l => l.classList.contains('active'));
    if (!active) {
        active = links[0];
        active.classList.add('active');
    }

    links.forEach(l => l.addEventListener('click', e => {
        if (e.target === active || !links.includes(e.target)) {
            return;
        }
        active.classList.remove('active');
        active = e.target;
        active.classList.add('active');
    }));
});

// advertisement rendering system
const DEFAULT_LOGO_URL = 'img/profile-icons/def.png';
const articlesContainer = find('.ads__items');

const articleTemplate = `
    <div class="checkbox" role="checkbox">
        <div class="checkbox__inner"></div>
    </div>

    <div class="adv-item__img"></div>

    <div class="adv-item__left-block">
        <h3 class="adv-item__title"></h3>

        <div class="adv-item__price">
            <span></span>
            <span>руб</span>
        </div>

        <div class="adv-item__edit-btns flex">
            <a class="edit" href="">Редактировать</a>
            <a class="change-design" href="">Изменить дизайн</a>
        </div>
    </div>

    <ul class="adv-item__city-list"></ul>

    <ul class="adv-item__links show-on-adv-item-hover">
        <li class="service-item"><a href="">Еще</a></li>
        <li><a href="">Ссылка на Ваше резюме без контактов</a></li>
    </ul>

    <div class="adv-item__get-more-responses show-on-adv-item-hover">
        <a href="">Получить больше откликов</a>
    </div>

    <div class="adv-item__stats flex">
        <span class="views"></span>
        <span class="favourites"></span>
        <span class="dialogs"></span>
        <span class="responses"><span></span><span class="growth"></span></span>
        <span class="matching-vacancies"></span>
        <span class="days-published"></span>
    </div>

    <div class="adv-item__services"></div>
`

const selectors = {
    img: '.adv-item__img',
    title: '.adv-item__title',
    price: '.adv-item__price > span:first-child',
    cityList: '.adv-item__city-list',
    views: '.adv-item__stats .views',
    favourites: '.adv-item__stats .favourites',
    dialogs: '.adv-item__stats .dialogs',
    responses: '.adv-item__stats .responses',
    matchingVacancies: '.adv-item__stats .matching-vacancies',
    daysPublished: '.adv-item__stats .days-published',
    services: '.adv-item__services'
}

const services = {
    0: {
        logoUrl: 'img/service-icons/inclined-rocket.svg',
    },
    1: {
        logoUrl: 'img/service-icons/megaphone.svg',
    },
    2: {
        logoUrl: 'img/service-icons/quality.svg',
    },
    3: {
        logoUrl: 'img/service-icons/rocket.svg',
    },
    4: {
        logoUrl: 'img/service-icons/pencil.svg',
    },
}

function renderElement(elem, payload) {
    switch (elem) {
        case 'cityList':
            return `
                <li class="service-item"><a href="">Добавить</a></li>
                ${ payload.map(c => `<li><span></span><span>${c}</span></li>`).join('') }
            `;
        case 'services':
            return payload.map(s => `
                <article class="service">
                    <img src="${services[s.id].logoUrl}" alt="icon" class="service__icon">
                    <h4 class="service__title">Платное размещение</h4>
                    <p class="service__period">
                        <span>Период:</span>
                        <span class="from">${s.dateFrom}</span>
                        <span class="dash">-</span>
                        <span class="to">${s.dateTo}</span>
                    </p>
                </article>
            `).join('');
        case 'img':
            return `
                <div class="${payload.className}" style="background-image: url(${payload.url})" alt="logo"></div>
            `
        default:
            return payload;
    }
}

function renderArticle(data) {
    const article = document.createElement('article');
    article.innerHTML = articleTemplate;
    article.classList.add('adv-item', 'grid', 'bottom-line');
    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('_')) {
            continue;
        }
        article.querySelector(selectors[key]).innerHTML = renderElement(key, value);
    }
    return article;
}

async function fetchData(url) {
    const json = await fetch(url).then(data => data.json());
    return json.map(obj => ({
        el: null,
        data: {
            img: {
                url: obj.logo_url || DEFAULT_LOGO_URL,
                className: obj.type === 'worker' ? 'avatar-circle' : 'avatar-square'
            },
            title: obj.title,
            _type: obj.type,
            price: obj.price,
            cityList: obj.city_list,
            views: obj.views,
            favourites: obj.favourites,
            dialogs: obj.dialogs,
            responses: obj.responses,
            matchingVacancies: obj.matching_vacancies,
            daysPublished: obj.days_published,
            services: obj.services.map(s => ({
                id: s.id,
                dateFrom: s.date_from,
                dateTo: s.date_to
            }))
        }
    }));
}

function appendArticle(data) {
    const article = renderArticle(data);
    articlesContainer.appendChild(article);
    return article;
}

function initArticles(url) {
    articlesContainer.innerHTML = '';
    fetchData(url).then(articles => articles.forEach(a => a.el = appendArticle(a.data)));
}

initArticles('data.json');

const testInputs = findAll('.test-form input');
find('.test-form .add').addEventListener('click', () => {
    appendArticle({
        title: testInputs[0].value,
        price: testInputs[1].value,
        img: {
            url: testInputs[3].value || DEFAULT_LOGO_URL,
            className: find('input[name="type"]:checked').value === 'worker' ? 'avatar-circle' : 'avatar-square'
        },
        cityList: testInputs[2].value.split(' '),
        views: testInputs[4].value,
        favourites: testInputs[5].value,
        dialogs: testInputs[6].value,
        responses: testInputs[7].value,
        matchingVacancies: testInputs[8].value,
        daysPublished: testInputs[9].value,
        services: Array(+testInputs[10].value).fill().map((el, i) => ({
            id: i,
            dateFrom: '10.05.2022',
            dateTo: '10.06.2022'
        }))
    });
});
find('.test-form .delete').addEventListener('click', () => {
    articlesContainer.innerHTML = '';
});