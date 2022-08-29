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
function initLinkPreventReload() {
    findAll('a[href=""]').forEach(a => {
        a.addEventListener('click', e => e.preventDefault());
    });
}

// custom checkbox
function initCustomCheckbox() {
    findAll('.checkbox').forEach(c => {
        c.addEventListener('click', e => {
            e.target.classList.toggle('active');
        });
    });
}

// custom select
findAll('.select').forEach(sel => {
    const mainField = sel.querySelector('span');
    mainField.innerHTML = sel.querySelector('ul li[data-default="true"]').textContent;
    sel.addEventListener('mouseenter', e => {
        sel.querySelector('ul').setAttribute('data-expanded', 'true');
    });
    sel.addEventListener('mouseleave', e => {
        sel.querySelector('ul').setAttribute('data-expanded', 'false');
    });
    sel.querySelectorAll('li').forEach(li => li.addEventListener('click', e => {
        sel.querySelectorAll('li').forEach(li => li.removeAttribute('data-selected'));
        mainField.innerHTML = e.target.textContent;
        mainField.removeAttribute('data-empty');
        if (e.target.getAttribute('data-default') === 'true') {
            mainField.setAttribute('data-empty', 'true');
        }
        li.setAttribute('data-selected', 'true');
        sel.querySelector('ul').setAttribute('data-expanded', 'false');
    }));
});

// handle text overflow
function setFadeEffects(elems, findBackground) {
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

function initFadeEffects() {
    const elems = [].concat(...findAll('.adv-item__title'), ...findAll('.adv-item__city-list > li'), ...findAll('.ads__field-names span'));
    setFadeEffects(elems, true);

    window.addEventListener('resize', () => {
        setFadeEffects(elems, false);
    });
}

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

// input validation
findAll('input[type="number"]').forEach(inp => inp.addEventListener('keydown', e => {
    if (isNaN(e.key) && !(e.keyCode !== 8 || e.key.toLowerCase() === 'backspace')) {
        e.preventDefault();
    }
    if (e.target.value < 0) {
        e.target.value = '';
    }
}));

// expanding list with links
function initExpandingLists() {
    findAll('.adv-item__links').forEach(list => {

        if (list.querySelectorAll('li').length === 2) {
            return;
        }

        const defaultBtnText = 'Еще';
        const clickedBtnText = 'Свернуть';

        const btn = list.querySelector('.service-item a');
        btn.innerHTML = defaultBtnText;

        list.setAttribute('aria-expanded', 'false');

        const collapsedHeight = list.querySelector('li').clientHeight;
        list.style.height = collapsedHeight + 'px';

        btn.addEventListener('click', () => {
            if (list.getAttribute('aria-expanded') === 'false') {
                list.style.height = list.scrollHeight + collapsedHeight + 'px';
                list.setAttribute('aria-expanded', 'true');
                btn.innerHTML = clickedBtnText;
            } else {
                list.style.height = collapsedHeight + 'px';
                list.setAttribute('aria-expanded', 'false');
                btn.innerHTML = defaultBtnText;
            }
            btn.parentNode.classList.toggle('active');
        });

        list.addEventListener('transitionend', () => {
            list.classList.toggle('show-on-adv-item-hover');
        });
    });
}

// show modal
const modal = find('.modal');
const modalContent = modal.querySelector('.modal__content');

function showModal(el) {
    modalContent.innerHTML = '';
    modalContent.innerHTML = el;
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('icon-cross-svgrepo-com', 'modal__close-btn');
    modalContent.appendChild(closeBtn);
    document.body.classList.add('lock');

    modal.classList.add('modal--visible');
    closeBtn.addEventListener('click', e => {
        modal.classList.remove('modal--visible');
        document.body.classList.remove('lock');
    });
    modal.addEventListener('click', e => {
        if (e.target === modal) {
            modal.classList.remove('modal--visible');
            document.body.classList.remove('lock');
        }
    });
}

// advertisement rendering system
const DEFAULT_LOGO_URL = 'img/profile-icons/def.png';
const ARTICLES_URL = 'data.json';
const ARTICLE_TEMPLATE_URL = 'article-template.html';
const SERVICES_URL = 'services.json';

const articlesContainer = find('.ads__items');

let services, articleTemplate, servicesLogos = [];

const selectors = {
    img: '.adv-item__img',
    title: '.adv-item__title',
    price: '.adv-item__price > span:first-child',
    cityList: '.adv-item__city-list',
    links: '.adv-item__links',
    views: '.adv-item__stats .views',
    favourites: '.adv-item__stats .favourites',
    dialogs: '.adv-item__stats .dialogs',
    responses: '.adv-item__stats .responses',
    matchingVacancies: '.adv-item__stats .matching-vacancies',
    daysPublished: '.adv-item__stats .days-published',
    services: '.adv-item__services'
};

function renderElement(elem, payload = null) {
    switch (elem) {
        case 'cityList':
            return `
                <li class="service-item"><a href="">Добавить</a></li>
                ${payload.map(c => `<li><span class="icon icon-cross"></span><span>г. ${c}</span></li>`).join('')}
            `;
        case 'services':

            return `
                <h4 class="services-header">Услуги продвижения</h4>
                ${
                    Object.keys(services).map(k => `
                        <article class="service">
                            <div class="service__img">${servicesLogos[k]}</div>
                            <div class="service__info">
                                <h4 class="service__title">${services[k].title}</h4>
                                ${ !services[k].free ? (
                                    k in payload ? `
                                        <p>
                                            <span>Период:</span>
                                            <span class="from">${payload[k].dateFrom}</span>
                                            <span class="dash">-</span>
                                            <span class="to">${payload[k].dateTo}</span>
                                        </p>
                                        <p>
                                            Услуга АКТИВНА до ${payload[k].dateTo}
                                        </p>
                                    ` : `
                                        <p>
                                            Услуга не активна, <a href="">активировать</a>?
                                        </p>
                                    `
                                ) : '' }
                            </div>
                        </article>
                    `).join('')
                }   
            `;
        case 'img':
            return `
                <div class="${payload.className}" style="background-image: url(${payload.url})" alt="logo"></div>
            `;
        case 'links':
            return `
                <li class="service-item"><a href=""></a></li>
                ${ payload.map(l => `
                    <li><span class="icon icon-link"></span><a href="">${l.text}</a></li>
                `).join('') }   
            `;
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

    article.querySelector('.adv-item__services a').addEventListener('click', e => {
        showModal(renderElement('services', data._services));
    });

    return article;
}

async function fetchData() {
    services = await fetch(SERVICES_URL).then(data => data.json());
    articleTemplate = await fetch(ARTICLE_TEMPLATE_URL).then(data => data.text());

    for (const k of Object.keys(services)) {
        servicesLogos[k] = await fetch(services[k].logoUrl).then(data => data.text());
    }

    const json = await fetch(ARTICLES_URL).then(data => data.json());
    return json.map(obj => ({
        el: null,
        checked: false,
        data: {
            img: {
                url: obj.logo_url || DEFAULT_LOGO_URL,
                className: obj.type === 'resume' ? 'avatar-circle' : 'avatar-square'
            },
            title: obj.title,
            _type: obj.type,
            price: obj.price,
            cityList: obj.city_list,
            links: obj.links.map(l => ({
                text: l.text,
                url: l.url,
                free: l.free
            })),
            views: obj.views,
            favourites: obj.favourites,
            dialogs: obj.dialogs,
            responses: obj.responses,
            matchingVacancies: obj.matching_vacancies,
            daysPublished: obj.days_published,
            _services: obj.services.map(s => ({
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

function printArticles(articles) {
    articlesContainer.innerHTML = '';
    articles.forEach(a => {
        a.el = appendArticle(a.data);
        a.el.querySelector('.checkbox').addEventListener('click', e => {
            if (a.checked) {
                setArticleCheckState(a, false);
            } else {
                setArticleCheckState(a, true);
            }
        });
    });
}

function updateArticle(el, data) {
    for (const [key, value] of Object.entries(data)) {
        el.querySelector(selectors[key]).innerHTML = renderElement(key, value);
    }
}

function initArticles(data) {
    printArticles(filterArticles(data));
    initLinkPreventReload();
    initExpandingLists();
    initFadeEffects();
    initActionBar(data);
    initActionDelete(data);
}

// advertisement checkboxes
let checkedArticles = [];

const checkbox = find('.actions .checkbox');
const activateBtn = find('#action-activate-adv');
const deleteBtn = find('#action-delete-adv');

function setArticleCheckState(article, checked) {
    if (article.checked === checked) {
        return;
    }
    article.checked = checked;
    if (checked) {
        checkedArticles.push(article);
        article.el.querySelector('.checkbox').classList.add('active');
    } else {
        checkedArticles.splice(checkedArticles.indexOf(article), 1);
        article.el.querySelector('.checkbox').classList.remove('active');
        checkbox.classList.remove('active');
    }

    if (checkedArticles.length !== 0) {
       activateBtn.classList.remove('disabled');
       deleteBtn.classList.remove('disabled');
    } else {
        activateBtn.classList.add('disabled');
        deleteBtn.classList.add('disabled');
    }
}

function initActionBar(articles) {
    checkbox.addEventListener('click', e => {
        const checked = !checkbox.classList.contains('active');
        checkbox.classList.toggle('active');
        if (checked) {
            articles.forEach(a => {
                setArticleCheckState(a, true);
            });
        } else {
            [...checkedArticles].forEach(a => setArticleCheckState(a, false));
        }
    });
}

function initActionDelete(articles) {
    deleteBtn.addEventListener('click', e => {
        [...checkedArticles].forEach(a => {
            setArticleCheckState(a, false);
            articles.splice(articles.indexOf(a), 1);
            a.el.remove();
        });

        initArticles(articles);
    });
}

// advertisement filters
const filters = [
    function(a) {
        const strings = find('#adv-filter-title').value.trim().split(' ');
        let match = false;
        for (let i = 0; i < strings.length; i++) {
            if ( (a.data.title.toLowerCase().includes(strings[i]) && strings[i].length > 2) || strings[i] === '' ) {
                match = true;
                break;
            }
        }
        return match;
    },
    function (a) {
        const type = find('.adv-filter-type .tab-link.active').getAttribute('id').toLowerCase();
        if (type.endsWith('all')) {
            return true;
        }
        if (type.endsWith('resume')) {
            return a.data._type.toLowerCase() === 'resume';
        }
        if (type.endsWith('vacancy')) {
            return a.data._type.toLowerCase() === 'vacancy';
        }
    },
    function (a) {
        const priceFrom = +find('#adv-filter-price-from').value;
        const priceTo = +find('#adv-filter-price-to').value || Number.POSITIVE_INFINITY;
        const price = +a.data.price;
        return price >= priceFrom && price <= priceTo;
    },
    function (a) {
        const field = find('.adv-filter-region .select span');
        if (field.getAttribute('data-empty') === 'true') {
            return true;
        }
        const city = field.textContent.toLowerCase();
        let match = false;
        for (let i = 0; i < a.data.cityList.length; i++) {
            if (a.data.cityList[i].toLowerCase() === city) {
                match = true;
                break;
            }
        }
        return match;
    }
];

const listeners = [
    {
        selector: ['#adv-filter-title'],
        event: 'input',
    },
    {
        selector: ['.adv-filter-type .tab-link'],
        event: 'click',
    },
    {
        selector: ['#adv-filter-price-from', '#adv-filter-price-to'],
        event: 'input',
    },
    {
        selector: ['.adv-filter-region .select ul li'],
        event: 'click'
    }
]

function filterArticles(articles) {
    return articles.filter(a => {
        let match = true;
        for (let i = 0; i < filters.length; i++) {
            if (!filters[i](a)) {
                match = false;
                break;
            }
        }
        return match;
    });
}

function initFilters(articles) {
    listeners.forEach(l => {
        Array.from(findAll(l.selector)).forEach(el => {
            el.addEventListener(l.event, e => {
                if (l.checker === undefined || l.checker(e)) {
                    initArticles(filterArticles(articles));
                }
            });
        }) ;
    });
}

let globalTestData;

fetchData().then(data => {
    initArticles(data);
    initFilters(data);
    globalTestData = data;
});


// TEST
const testInputs = findAll('.test-form input');
find('.test-form .add').addEventListener('click', () => {
    const type = find('input[name="type"]:checked').value;
    globalTestData = [...globalTestData, {
        el: null,
        data: {
            title: testInputs[0].value,
            price: testInputs[1].value,
            _type: type,
            img: {
                url: testInputs[3].value || DEFAULT_LOGO_URL,
                className: type === 'resume' ? 'avatar-circle' : 'avatar-square'
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
        }
    }];
    initArticles(globalTestData);
    initFilters(globalTestData);
});
find('.test-form .delete').addEventListener('click', () => {
    articlesContainer.innerHTML = '';
});