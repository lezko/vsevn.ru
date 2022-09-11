// common elements
const cover = find('.cover');

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

// custom select
findAll('.select:not(#adv-filter-region)').forEach(sel => {
    const field = sel.querySelector('.select__body .text');
    const placeholderText = 'Сортировать по';

    sel.querySelector('.cross').addEventListener('click', () => {
        sel.setAttribute('data-empty', true);
        field.innerHTML = placeholderText;
        selectedItem.removeAttribute('data-selected');
    });

    const defaultItem = sel.querySelector('ul li[data-default="true"]');
    let selectedItem;
    if (defaultItem) {
        field.innerHTML = defaultItem.innerHTML;
        selectedItem = defaultItem;
        selectedItem.setAttribute('data-selected', 'true');
        sel.setAttribute('data-empty', false);
    } else {
        field.innerHTML = placeholderText;
    }

    let expanded = false;
    sel.querySelector('.select__body').addEventListener('click', () => {
        expanded = !expanded;
        toggleSelect(sel, expanded);
    });

    sel.querySelectorAll('.select__list li').forEach(li => li.addEventListener('click', e => {
        sel.setAttribute('data-empty', false);
        field.innerHTML = e.target.innerHTML;
        selectedItem?.removeAttribute('data-selected');
        selectedItem = e.target;
        selectedItem.setAttribute('data-selected', 'true');
        expanded = false;
        toggleSelect(sel, expanded);
    }));

    cover.addEventListener('click', () => {
        expanded = false;
        toggleSelect(sel, expanded);
    });
});

function toggleSelect(elem, expanded) {
    cover.classList.toggle('hidden');
    elem.setAttribute('aria-expanded', expanded);
}

// handle text overflow
function setFadeEffects(elems) {
    elems.forEach(el => {
        if (el.scrollWidth > el.clientWidth) {
            el.classList.add('ovf-fade');
            el.parentNode.classList.add('hint');
        } else {
            el.classList.remove('ovf-fade');
            el.parentNode.classList.remove('hint');
        }
    });
}

function initFadeEffects(target) {
    const elems = [].concat(
        ...target.querySelectorAll('.adv-item__title span.text'),
        ...target.querySelectorAll('.adv-item__city-list > li > div'),
        // ...target.querySelectorAll('.ads__field-names span')
    );

    setFadeEffects(elems);

    window.addEventListener('resize', () => {
        // setFadeEffects(elems);
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
function initInputValidation() {
    findAll('input[type="number"]').forEach(inp => inp.addEventListener('keydown', e => {
        if ((isNaN(e.key) && e.keyCode !== 8 && e.key.toLowerCase() !== 'backspace') || e.keyCode === 32) {
            e.preventDefault();
        }
    }));
}

// cross clear field
function initClearFieldBtns(target) {
    target.querySelectorAll('.cross').forEach(c => {
        const field = find('#' + c.getAttribute('aria-controls'));
        if (field.tagName.toLowerCase() !== 'input') {
            return;
        }
        const parent = c.parentNode;
        parent.setAttribute('data-empty', field.value === '');

        field.addEventListener('input', () => field.value !== '' ? parent.setAttribute('data-empty', 'false') : parent.setAttribute('data-empty', 'true'));
        c.addEventListener('click', () => {
            field.value = '';
            parent.setAttribute('data-empty', 'true');
        });

    });
}

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

        toggleExpandingList(list, false);

        btn.addEventListener('click', e => {
            toggleExpandingList(list);
            btn.innerHTML = btn.innerHTML === defaultBtnText ? clickedBtnText : defaultBtnText;
        });
    });
}

function toggleExpandingList(list, expanded = null) {
    if (expanded === null) {
        expanded = !(list.getAttribute('aria-expanded') === 'true');
    }

    list.setAttribute('aria-expanded', expanded);
    const links = list.querySelectorAll('li:not(.service-item)');
    for (let i = 1; i < links.length; i++) {
        if (expanded) {
            links[i].classList.remove('hidden');
        } else {
            links[i].classList.add('hidden');
        }
    }
}

// save scroll position
function updateScrollValue() {
    localStorage.setItem('scrollTop', String(find('html').scrollTop));
}

function getScrollValue() {
    return localStorage.getItem('scrollTop');
}

// copy link to clipboard
function initCopyLinkBtns(target) {
    target.querySelectorAll('.copy-link-modal').forEach(m => {
        m.querySelector('.copy-link-modal__btn').addEventListener('click', () => {
            const url = m.querySelector('.copy-link-modal__url').textContent;
            navigator.clipboard.writeText(url).then(() => {}, err => console.error);
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
const DEFAULT_LOGO_URL = 'img/profile-icons/default-logo.svg';
const DEFAULT_PHOTO_URL = 'img/profile-icons/default-photo.svg';
const ARTICLES_URL = 'data.json';
const ARTICLE_TEMPLATE_URL = 'article-template.html';
const SERVICES_URL = 'services.json';

const articlesContainer = find('.ads__items');

let services, articleTemplate, servicesLogos = [], articles, filteredArticles;

const selectors = {
    img: '.adv-item__img',
    title: '.adv-item__title',
    prolong: '.adv-item__state',
    price: '.adv-item__price > span:first-child',
    cityList: '.adv-item__city-list',
    rating: '.adv-item__rating',
    links: '.adv-item__links',
    views: '.adv-item__stats .views',
    favourites: '.adv-item__stats .favourites',
    dialogs: '.adv-item__stats .dialogs',
    newMessages: '.adv-item__stats .new-messages',
    growth: '.adv-item__stats .growth',
    responses: '.adv-item__stats .responses',
    matchingVacancies: '.adv-item__stats .matching-vacancies',
    daysPublished: '.adv-item__stats .days-published',
    servicesCount: '.adv-item__services'
};

async function renderElement(elem, payload = null) {
    switch (elem) {
        case 'prolong':
            if (payload.active) {
                return `
                    <p>
                        <span class="icon icon-warn-triangle"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>
                        Активное объявление
                    </p>
                    <div class="info">
                        <div class="calendar-container">Осталось <span class="expires">27 дней</span> до депубликации. Изменить дату депубликации 
                            <fieldset class="calendar-open-btn">
                                <legend>Дата депубликации</legend>
                                <input placeholder="дд.мм.гггг" data-date="${ payload.date.deactivation }" value="${ formatDateString(payload.date.deactivation) }">
                                <span class="hint__text hint__text--center">Эту дату нельзя выбрать</span>
                            </fieldset>
                        </div>
                        <span class="time">Обновлена: 10.05.2022, 9:00</span><a href="">Обновить</a>
                    </div>
                `;
            }
            return '';
        case 'title':
            return `
                <span class="hint__text">${ payload }</span>
                <span class="text">${ payload }</span>
            `;
        case 'cityList':
            return `
                <li class="service-item"><a href="">Добавить</a></li>
                ${payload.map(c => `
                    <li>
                        <span class="hint__text">${ c }</span>
                        <div>
                            <span class="icon icon-cross hint">
                                <span class="hint__text hint__text--center">Удалить данный населенный пункт</span>
                            </span>
                            <span class="text">${ c }</span>
                        </div>
                    </li>
                `).join('')}
            `;
        case 'newMessages':
            return `${ +payload ? payload : '' }`;
        case 'growth':
            return `+${ payload }`;
        case 'rating':
            return `<p>Объявление на ${ payload } месте в поиске.</p><p><a href="">Поднять на 1 (первое) место в поиске?</a></p>`
        case 'servicesCount':
            return `
                <p>Активно: ${ payload }</p>
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
            if (payload.url.endsWith('.html')) {
                const logo = await fetch(payload.url).then(data => data.text());
                return `<div class="${payload.className}">${logo}</div>`;
            }
            return `
                <div class="${payload.className}" style="background-image: url(${payload.url})" alt="logo"></div>
            `;
        case 'links':
            return `
                ${ payload.map(l => `
                    <li>
                        <span class="icon icon-link"></span>
                        <a href="">${l.text}</a>
                        
                        <div class="copy-link-modal">
                        <span class="copy-link-modal__url">${ l.url }</span>
                        <span class="copy-link-modal__btn">
                            <span class="icon icon-link"></span>
                            <span class="text">Скопировать ссылку</span>
                        </span>
                    </div>
                    </li>
                `).join('') }   
                <li class="service-item"><a href=""></a></li>
            `;
        default:
            return payload;
    }
}

async function renderArticle(data) {
    const article = document.createElement('article');
    article.innerHTML = articleTemplate;
    article.classList.add('adv-item', 'grid', 'underline');
    for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('_')) {
            continue;
        }
        article.querySelector(selectors[key]).innerHTML = await renderElement(key, value);
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
                url: obj.logo_url || (obj.type === 'resume' ? DEFAULT_PHOTO_URL : DEFAULT_LOGO_URL),
                className: obj.type === 'resume' ? 'avatar-circle' : 'avatar-square'
            },
            title: obj.title,
            _type: obj.type,
            _state: obj.state,
            prolong: {
                active: obj.state === 'active',
                date: obj.date
            },
            price: obj.price,
            rating: obj.rating,
            cityList: obj.city_list,
            links: obj.links.map(l => ({
                text: l.text,
                url: l.url,
                free: l.free
            })),
            views: obj.views,
            favourites: obj.favourites,
            dialogs: obj.dialogs,
            newMessages: obj.new_messages,
            growth: obj.growth,
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

async function printArticles(articles) {
    articlesContainer.innerHTML = '';
    for (const a of articles) {
        let setupNeeded = false;
        if (a.el === null) {
            a.el = await renderArticle(a.data);
            setupNeeded = true;
        }

        appendArticle(a.el);

        if (setupNeeded) {
            setupArticle(a);
        }
    }
}

function setupArticle(article) {
    initLinkPreventReload(article.el);
    initExpandingLists(article.el);
    initFadeEffects(article.el);
    initCalendar(article.el);
    initCopyLinkModals(article);
    initDeleteCityBtns(article);
    initArticleStateBackground(article);

    article.el.querySelector('.checkbox').addEventListener('click', () => {
        if (article.checked) {
            setArticleCheckState(article, false);
        } else {
            setArticleCheckState(article, true);
        }
    });

    article.el.querySelector('.adv-item__services a').addEventListener('click', async () => {
        showModal(await renderElement('services', article.data._services));
    });
}

function updateArticle(article, options = {}) {
    article.data = {...article.data, ...options};
    article.el = null;
}

async function performFiltering() {
    filteredArticles = filterArticles(articles);
    await printArticles(filteredArticles).then(updateActionBar);
}

async function initArticles(data) {
    articles = data;
    await performFiltering();
}

// setup article functions
function initArticleStateBackground(article) {
    article.el.setAttribute('data-state', article.data._state);
}

function initDeleteCityBtns(article) {
    article.el.querySelectorAll('.adv-item__city-list > li:not(.service-item)').forEach(li => {
        const city = li.querySelector('span.text').textContent;
        li.querySelector('span.icon').addEventListener('click', () => {
            updateArticle(article, { cityList: article.data.cityList.filter(c => c !== city) });
            performFiltering();
        });
    });
}

function initCopyLinkModals(article) {
    article.el.querySelectorAll('.adv-item__links > li:not(.service-item)').forEach(li => {
        const defaultText = 'Скопировать ссылку';
        const clickedText = 'Ссылка скопирована';

        const url = li.querySelector('.copy-link-modal__url');
        const btn = li.querySelector('.copy-link-modal__btn');

        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(url.textContent).then(() => {
                btn.querySelector('span.text').textContent = clickedText;
            }, console.error);
        });
        btn.parentNode.addEventListener('mouseleave', () => {
            btn.querySelector('span.text').textContent = defaultText;
        });

        let string = null;
        li.addEventListener('mouseenter', () => {
            if (string || url.scrollWidth <= url.clientWidth) {
                return;
            }

            string = url.textContent;
            while (url.scrollWidth > url.clientWidth) {
                string = string.slice(0, -1);
                url.textContent = string;
            }
            string = string.slice(0, -2);
            url.textContent = string;
            url.classList.add('ovf');
        });
    });
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
            setArticleCheckState(a, false, false);
            updateArticle(a, { _state: 'deleted' })
        }
    },
    activate: {
        text: 'Активировать',
        action: function (a) {
            setArticleCheckState(a, false, false);
            updateArticle(a, { _state: 'active' })
        }
    },
    unpublish: {
        text: 'Снять с публикации',
        action: function (a) {
            setArticleCheckState(a, false, false);
            updateArticle(a, { _state: 'closed' })
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
    btn.classList.add('action-btn', 'disabled');
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
    },
    {
        selector: ['.cross'],
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
initClearFieldBtns(document.body);
initCalendar(document.body);
initInputValidation();

fetchData().then(data => {
    initDefaultActionBtns();
    initStateFiltersBtns();
    updateStateFiltersNumbers();

    initFilters(data);
    initArticles(data).then(() => {
        const scroll = getScrollValue();
        if (scroll) {
            window.scrollTo(0, +scroll);
        }
        window.addEventListener('scroll', () => {
            updateScrollValue();
        });
    });

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