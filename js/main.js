// functions
function find(selector) {
    return document.querySelector(selector);
}

function findAll(selector) {
    return document.querySelectorAll(selector);
}

// set onclick = 'return false' to all links with empty href attribute
// to prevent them from reloading the page
function initLinkPreventReload(target) {
    target.querySelectorAll('a[href=""]').forEach(a => {
        a.addEventListener('click', e => e.preventDefault());
    });
}

// custom checkbox
function initCustomCheckbox(target) {
    target.querySelectorAll('.checkbox').forEach(c => {
        c.addEventListener('click', e => {
            e.target.classList.toggle('active');
        });
    });
}

// custom select
findAll('.select').forEach(sel => {
    const mainField = sel.querySelector('span');
    mainField.innerHTML = sel.querySelector('ul li[data-default="true"]').textContent;
    sel.addEventListener('mouseenter', () => {
        sel.querySelector('ul').setAttribute('data-expanded', 'true');
    });
    sel.addEventListener('mouseleave', () => {
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
function setFadeEffects(elems) {
    elems.forEach(el => {
        if (el.scrollWidth > el.clientWidth) {
            el.classList.add('ovf-fade');
        } else {
            el.classList.remove('ovf-fade');
        }
    });
}

function initFadeEffects(target) {
    const elems = [].concat(
        ...target.querySelectorAll('.adv-item__title'),
        ...target.querySelectorAll('.adv-item__city-list > li'),
        ...target.querySelectorAll('.ads__field-names span')
    );

    setFadeEffects(elems);

    window.addEventListener('resize', () => {
        setFadeEffects(elems);
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
function initExpandingLists(target) {
    target.querySelectorAll('.adv-item__links').forEach(list => {

        if (list.querySelectorAll('li').length < 3) {
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
    closeBtn.addEventListener('click', () => {
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

let services, articleTemplate, servicesLogos = [], articles, filteredArticles;

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
    servicesCount: '.adv-item__services'
};

function renderElement(elem, payload = null) {
    switch (elem) {
        case 'cityList':
            return `
                <li class="service-item"><a href="">Добавить</a></li>
                ${payload.map(c => `<li><span class="icon icon-cross"></span><span>г. ${c}</span></li>`).join('')}
            `;
        case 'servicesCount':
            return `
                <p>Активно: ${payload}</p>
                <a href="">Показать</a>
            `
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

    return article;
}

async function fetchData() {
    services = await fetch(SERVICES_URL).then(data => data.json());
    articleTemplate = await fetch(ARTICLE_TEMPLATE_URL).then(data => data.text());

    for (const k of Object.keys(services)) {
        servicesLogos[k] = await fetch(services[k].logoUrl).then(data => data.text());
    }

    const json = await fetch(ARTICLES_URL).then(data => data.json());
    articles = json.map(obj => ({
        el: null,
        checked: false,
        data: {
            img: {
                url: obj.logo_url || DEFAULT_LOGO_URL,
                className: obj.type === 'resume' ? 'avatar-circle' : 'avatar-square'
            },
            title: obj.title,
            _type: obj.type,
            _state: obj.state,
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
            servicesCount: obj.services.length,
            _services: obj.services.map(s => ({
                id: s.id,
                dateFrom: s.date_from,
                dateTo: s.date_to
            }))
        }
    }));

    return articles;
}

function appendArticle(article) {
    articlesContainer.appendChild(article);
}

function printArticles(articles) {
    articlesContainer.innerHTML = '';
    articles.forEach(a => {
        let setupNeeded = false;
        if (a.el === null) {
            a.el = renderArticle(a.data);
            setupNeeded = true;
        }

        appendArticle(a.el);

        if (setupNeeded) {
            setupArticle(a);
        }
    });
}

function setupArticle(article) {
    initLinkPreventReload(article.el);
    initExpandingLists(article.el);
    initFadeEffects(article.el);

    article.el.querySelector('.checkbox').addEventListener('click', () => {
        if (article.checked) {
            setArticleCheckState(article, false);
        } else {
            setArticleCheckState(article, true);
        }
    });

    article.el.querySelector('.adv-item__services a').addEventListener('click', () => {
        showModal(renderElement('services', article.data._services));
    });

    article.el.querySelectorAll('.adv-item__city-list > li > span.icon').forEach(b => b.addEventListener('click', e => {
        e.target.parentNode.remove();
    }));
}

function updateArticle(article, data) {
    article.el.replaceWith(renderArticle(data));
}

function performFiltering() {
    filteredArticles = filterArticles(articles);
    printArticles(filteredArticles);
    updateActionBar();
}

function initArticles(data) {
    articles = data;
    performFiltering();
}

// advertisement checkboxes
let checkedArticlesCount = 0;

const mainCheckbox = find('.actions .checkbox');
mainCheckbox.addEventListener('click', () => {
    const checked = switchCheckbox(mainCheckbox);
    filteredArticles.forEach(a => {
        setArticleCheckState(a, checked);
    });
});

function switchMainCheckBoxVisibility(visible) {
    if (visible) {
        mainCheckbox.classList.remove('hidden');
    } else {
        mainCheckbox.classList.add('hidden');
    }
}

function switchCheckbox(elem, checked = null) {
    if (checked === null) {
        if (elem.classList.contains('active')) {
            elem.classList.remove('active');
            return false;
        } else {
            elem.classList.add('active');
            return true;
        }
    }

    if (checked) {
        elem.classList.add('active');
    } else {
        elem.classList.remove('active');
    }

    return checked;
}

function setArticleCheckState(article, checked, actionBarUpdateNeeded = true) {
    if (article.checked === checked) {
        return;
    }
    article.checked = checked;
    if (checked) {
        checkedArticlesCount++;
        article.el.querySelector('.checkbox').classList.add('active');
    } else {
        checkedArticlesCount--;
        article.el.querySelector('.checkbox').classList.remove('active');
    }

    if (actionBarUpdateNeeded) {
        updateActionBar();
    }
}

function updateActionBar() {
    updateMainCheckbox();
    switchActionsBtns(checkedArticlesCount > 0);
}

function updateMainCheckbox() {
    switchCheckbox(mainCheckbox, checkedArticlesCount === filteredArticles.length && checkedArticlesCount > 0);
}

// action bar
const actionBtnsContainer = find('.actions .actions__container');
let checkSensitiveBtns;

const defaultActionBtns = [{
    elem: null,
    text: 'Подать объявление',
    action: function () { console.log('подать объяление') }
}];

const actionBtns = {
    delete: {
        text: 'Удалить',
        action: function (a) {
            a.data._state = 'deleted';
            setArticleCheckState(a, false, false);
        }
    },
    activate: {
        text: 'Активировать',
        action: function (a) {
            a.data._state = 'active';
            setArticleCheckState(a, false, false);
        }
    },
    unpublish: {
        text: 'Снять с публикации',
        action: function (a) {
            a.data._state = 'pending';
            setArticleCheckState(a, false, false);
        }
    },
    emptyTrash: {
        text: 'Очистить корзину',
        action: function (a) {
            articles = articles.filter(article => a !== article);
        },
    }
};

function switchActionsBtns(enabled = null) {
    if (enabled === null) {

    }
    if (enabled) {
        actionBtnsContainer.querySelectorAll('a:not(.action-btn--red)').forEach(b => {
            b.classList.remove('disabled');
        });
    } else {
        actionBtnsContainer.querySelectorAll('a:not(.action-btn--red)').forEach(b => {
            b.classList.add('disabled');
        });
    }
}

function initDefaultActionBtns() {
    defaultActionBtns.forEach(b => {
        const btn = document.createElement('a');
        btn.setAttribute('href', '');
        btn.classList.add('action-btn', 'action-btn--red');
        btn.textContent = b.text;
        btn.addEventListener('click', e => {
            e.preventDefault();
            b.action();
        });

        b.elem = btn;
    });
}

function clearActionBtns() {
    actionBtnsContainer.querySelectorAll('.action-btn').forEach(b => b.remove());
    checkSensitiveBtns = [];
}

function initActionBar(state) {
    clearActionBtns();
    switchMainCheckBoxVisibility(true);

    switch (state) {
        case 'active':
            addActionBtn(actionBtns.unpublish);
            break;
        case 'closed':
            addActionBtn(actionBtns.activate);
            addActionBtn(actionBtns.delete);
            break;
        case 'blocked':
        case 'rejected':
        case 'pending':
            switchMainCheckBoxVisibility(false);
            break;
        case 'draft':
            addActionBtn(actionBtns.delete);
            break;
        case 'deleted':
            addActionBtn(actionBtns.emptyTrash);
            break;
    }



    defaultActionBtns.forEach(b => {
        actionBtnsContainer.appendChild(b.elem);
    });
}

function addActionBtn({ text, action} ) {
    const btn = document.createElement('a');
    btn.setAttribute('href', '');
    btn.textContent = text;
    btn.classList.add('action-btn');
    btn.addEventListener('click', e => {
        e.preventDefault();
        performAction(action);
    });
    actionBtnsContainer.appendChild(btn);
}

function performAction(action) {
    articles.forEach(a => {
        if (a.checked) {
            action(a);
        }
    });
    updateActionBar();
    performFiltering();
    updateStateFiltersNumbers();
}

// advertisement filters
const stateFiltersBtns = Array.from(findAll('.adv-filter-state .tab-link'));

function initStateFiltersBtns() {
    stateFiltersBtns.forEach(b => {
        const state = b.getAttribute('id').split('-').pop();
        if (b.classList.contains('active')) {
            initActionBar(state);
        }
        b.addEventListener('click', () => initActionBar(state));
    });
}

function updateStateFiltersNumbers() {
    stateFiltersBtns.forEach(b => {
        b.querySelector('span:last-child').textContent = 0;
    });
    articles.forEach(a => {
        const filterNumber = find(`#adv-filter-state-${a.data._state} span:last-child`);
        filterNumber.textContent = ++filterNumber.textContent;
    });
}

const filters = [
    function (a) {
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
    },
    function (a) {
        const state = find('.adv-filter-state .tab-link.active').getAttribute('id').split('-').pop();
        return a.data._state === state;
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
    },
    {
        selector: ['.adv-filter-state .tab-link'],
        event: 'click'
    }
]

function filterArticles(articles) {
    return articles.filter(a => {
        let match = true;
        for (let i = 0; i < filters.length; i++) {
            if (!filters[i](a)) {
                match = false;
                setArticleCheckState(a, false);
                break;
            }
        }
        return match;
    });
}

function initFilters() {
    listeners.forEach(l => {
        Array.from(findAll(l.selector)).forEach(el => {
            el.addEventListener(l.event, e => {
                if (l.checker === undefined || l.checker(e)) {
                    performFiltering();
                }
            });
        }) ;
    });
}

let globalTestData;

initLinkPreventReload(document.body);

fetchData().then(data => {
    initDefaultActionBtns();
    initStateFiltersBtns();
    updateStateFiltersNumbers();

    initFilters(data);
    initArticles(data);
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