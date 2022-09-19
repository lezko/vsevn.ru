MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

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
        if (!expanded) {
            return;
        }
        expanded = false;
        toggleSelect(sel, expanded);
    });
});

function toggleSelect(elem, expanded) {
    if (expanded) {
        cover.classList.remove('hidden');
    } else {
        cover.classList.add('hidden');
    }
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
    const elems = [].concat(...target.querySelectorAll('.adv-item__title span.text'), ...target.querySelectorAll('.adv-item__city-list > li > div'), // ...target.querySelectorAll('.ads__field-names span')
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
            if (field.classList.contains('date-input-field')) {
                c.addEventListener('click', () => clearDateInputField(field));
            }
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

// init filter calendar
function initFilterCalendar(target) {
    target.querySelectorAll('.adv-filter-date.calendar-container').forEach(container => {

        const dateFromTextElem = container.querySelector('#adv-filter-date-from');
        const dateToTextElem = container.querySelector('#adv-filter-date-to');

        const dateFromInputField = container.querySelector('.date-input-field.date-from');
        const dateToInputField = container.querySelector('.date-input-field.date-to');

        const wrapperFrom = dateFromInputField.parentNode.parentNode;
        const wrapperTo = dateToInputField.parentNode.parentNode;

        wrapperFrom.setAttribute('data-empty', 'true');
        wrapperTo.setAttribute('data-empty', 'true');

        const btns = container.querySelectorAll('.calendar-open-btn--double');
        btns.forEach(btn => btn.addEventListener('click', () => {
            if (container.querySelector('.calendar') !== null) {
                return;
            }

            wrapperFrom.setAttribute('data-empty', 'true');
            wrapperTo.setAttribute('data-empty', 'true');

            clearDateInputField(dateFromInputField);
            clearDateInputField(dateToInputField);

            dateFromTextElem.removeAttribute('data-date');
            dateToTextElem.removeAttribute('data-date');

            container.classList.add('calendar-expanded');

            const calendar = showDoubleCalendar(container, dateFrom => {
                setDateInputFieldValue(dateFromInputField, dateFrom);
                dateFromTextElem.setAttribute('data-date', dateFrom.toLocaleDateString());
                wrapperFrom.setAttribute('data-empty', false);
            }, dateTo => {
                setDateInputFieldValue(dateToInputField, dateTo);
                dateToTextElem.setAttribute('data-date', dateTo.toLocaleDateString());
                wrapperTo.setAttribute('data-empty', false);

            }, (dateFrom, dateTo, err) => {
                if (dateFrom) {
                    dateFromTextElem.textContent = formatDateString(dateFrom.toLocaleDateString());
                    dateFromTextElem.setAttribute('data-date', dateFrom.toLocaleDateString());
                } else {
                    wrapperFrom.setAttribute('data-empty', 'true');
                }
                if (dateTo) {
                    dateToTextElem.textContent = formatDateString(dateTo.toLocaleDateString());
                    dateToTextElem.setAttribute('data-date', dateTo.toLocaleDateString());

                } else {
                    wrapperTo.setAttribute('data-empty', 'true');
                }

                performFiltering();

                container.classList.toggle('calendar-expanded');
                calendar.close();
            });

            dateFromInputField.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
                wrapperFrom.setAttribute('data-empty', checkDateInputFieldEmpty(dateFromInputField));
                try {
                    const date = getDateInputFieldValue(dateFromInputField);
                    calendar.first.setDate(date);
                } catch (e) {}
            }));
            dateToInputField.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
                wrapperTo.setAttribute('data-empty', checkDateInputFieldEmpty(dateToInputField));
                try {
                    const date = getDateInputFieldValue(dateToInputField);
                    calendar.second.setDate(date);
                } catch (e) {}
            }));

            cover.addEventListener('click', () => {
                wrapperFrom.setAttribute('data-empty', 'true');
                wrapperTo.setAttribute('data-empty', 'true');
                dateFromTextElem.textContent = '';
                dateToTextElem.textContent = '';
                container.classList.remove('calendar-expanded');
                calendar.close();
            });

            const [cross1, cross2] = container.querySelectorAll('.cross');
            cross1.addEventListener('click', () => {
                clearDateInputField(dateFromInputField);
                wrapperFrom.setAttribute('data-empty', 'true');
                dateFromTextElem.removeAttribute('data-date');
                calendar.first.clear();
                dateFromTextElem.textContent = '';
                if (!container.querySelector('.calendar')) {
                    performFiltering();
                }
            });
            cross2.addEventListener('click', () => {
                clearDateInputField(dateToInputField);
                wrapperTo.setAttribute('data-empty', 'true');
                dateToTextElem.removeAttribute('data-date');
                calendar.second.clear();
                dateToTextElem.textContent = '';
                if (!container.querySelector('.calendar')) {
                    performFiltering();
                }
            });
        }));
    });
}

function updateFieldState(field, container) {
    container.setAttribute('data-empty', field.value ? 'false' : 'true');
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
            navigator.clipboard.writeText(url).then(() => {
            }, err => console.error);
        });
    });
}

// date input fields
function initDateInputFields(target) {
    target.querySelectorAll('.date-input-field').forEach(field => {
        field.querySelectorAll('input').forEach(f => f.addEventListener('keydown', e => {
            if ((isNaN(e.key) && !(e.keyCode === 8 || e.key.toLowerCase() === 'backspace') && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 9) || e.keyCode === 32) {
                e.preventDefault();
            }
        }));

        const dayField = field.querySelector('.day');
        const monthField = field.querySelector('.month');
        const yearField = field.querySelector('.year');

        dayField.addEventListener('input', () => {
            const n = +dayField.value;
            if (dayField.value.length === 2 && !(1 <= n && n <= 31)) {
                dayField.value = dayField.value.slice(0, -1);
            }
            if (dayField.value.length === 2) {
                monthField.focus();
            }
        });
        dayField.addEventListener('focusout', () => {
            if (dayField.value.length === 1) {
                dayField.value = prependZero(dayField.value, 2);
            }
        });

        monthField.addEventListener('input', () => {
            const n = +monthField.value;
            if (monthField.value.length === 2 && !(1 <= n && n <= 12)) {
                monthField.value = monthField.value.slice(0, -1);
            }
            if (monthField.value.length === 2) {
                yearField.focus();
            }
        });
        monthField.addEventListener('focusout', () => {
            if (monthField.value.length === 1) {
                monthField.value = prependZero(monthField.value, 2);
            }
        });

        yearField.addEventListener('input', () => {
            if (yearField.value.length > 4) {
                yearField.value = yearField.value.slice(0, -1);
            }
        });
        yearField.addEventListener('focusout', () => {
            if (0 < yearField.value.length && yearField.value.length < 4) {
                yearField.value = prependZero(yearField.value, 4);
            }
        });
    });
}

function prependZero(str, targetLength) {
    while (str.length < targetLength) {
        str = '0' + str;
    }
    return str;
}

function clearDateInputField(field) {
    field.querySelectorAll('input').forEach(inp => inp.value = '');
}

function getDateInputFieldValue(field) {
    const day = field.querySelector('.day').value;
    const month = field.querySelector('.month').value;
    const year = field.querySelector('.year').value;
    const dateStr = day + '.' + month + '.' + year;
    if (dateStr.match('[0-9]{2}.[0-9]{2}.[0-9]{4}')) {
        return new Date(`${month}/${day}/${year}`);
    }

    throw new Error('cannot get date from input field: no valid date there');
}

function setDateInputFieldValue(field, date) {
    const arr = date.toLocaleDateString().split('/');

    field.querySelector('.day').value = prependZero(arr[1], 2);
    field.querySelector('.month').value = prependZero(arr[0], 2);
    field.querySelector('.year').value = prependZero(arr[2], 4);
}

function checkDateInputFieldEmpty(field) {
    const day = field.querySelector('.day').value;
    const month = field.querySelector('.month').value;
    const year = field.querySelector('.year').value;

    return day === '' && month === '' && year === '';
}

// filter region popup
function initFilterRegions(target) {
    target.querySelector('.adv-filter-region .text').addEventListener('click', e => {
        showChooseRegionPopup((regions, cities) => {
            let resultText;
            if (regions.length + cities.length === 0) {
                resultText = 'Регион / Населенный пункт';
            } else {
                resultText = `${regions.length} Регионов, ${cities.length} Населенный пунктов`;
            }

            e.target.textContent = resultText;
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
        case 'title':
            return `
                <span class="hint__text">${payload}</span>
                <span class="text">${payload}</span>
            `;
        case 'cityList':
            return `
                <li class="service-item"><a href="">Добавить</a></li>
                ${payload.map(c => `
                    <li>
                        <span class="hint__text">${c}</span>
                        <div>
                            <span class="icon icon-cross hint">
                                <span class="hint__text hint__text--center">Удалить данный населенный пункт</span>
                            </span>
                            <span class="text">${c}</span>
                        </div>
                    </li>
                `).join('')}
            `;
        case 'newMessages':
            return `${+payload ? payload : ''}`;
        case 'growth':
            return `+${payload}`;
        case 'rating':
            return `<p>Объявление на ${payload} месте в поиске.</p><p><a href="">Поднять на 1 (первое) место в поиске?</a></p>`;
        case 'servicesCount':
            return `
                <p>Активно: ${payload}</p>
                <a href="">Показать</a>
            `;
        case 'services':
            const skipIdx = '1' in payload ? 0 : 1;
            return `
                <h4 class="services-header">Услуги продвижения</h4>
                ${Object.keys(services).map((s, i) => i !== skipIdx ? `
                        <article class="service">
                            <div class="service__img">${servicesLogos[s]}</div>
                            <div class="service__info">
                                <h4 class="service__title">${services[s].title}</h4>
                                ${!services[s].free ? (i in payload ? `
                                        <p>
                                            <span>Период:</span>
                                            <span class="from">${payload[s].dateFrom}</span>
                                            <span class="dash">-</span>
                                            <span class="to">${payload[s].dateTo}</span>
                                        </p>
                                        <p>
                                            Услуга АКТИВНА до ${payload[s].dateTo}
                                        </p>
                                    ` : `
                                        <p>
                                            Услуга не активна, <a href="">активировать</a>?
                                        </p>
                                    `) : ''}
                            </div>
                        </article>
                    ` : '').join('')}   
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
                ${payload.map(l => `
                    <li>
                        <span class="icon icon-link"></span>
                        <a href="">${l.text}</a>
                        
                        <div class="copy-link-modal">
                        <span class="copy-link-modal__url">${l.url}</span>
                        <span class="copy-link-modal__btn">
                            <span class="icon icon-link"></span>
                            <span class="text">Скопировать ссылку</span>
                        </span>
                    </div>
                    </li>
                `).join('')}   
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
        el: null, checked: false, data: {
            img: {
                url: obj.logo_url || (obj.type === 'resume' ? DEFAULT_PHOTO_URL : DEFAULT_LOGO_URL),
                className: obj.type === 'resume' ? 'avatar-circle' : 'avatar-square'
            },
            title: obj.title,
            _type: obj.type,
            _state: obj.state,
            _date: obj.date,
            price: obj.price,
            _autoProlong: obj.auto_prolong,
            rating: obj.rating,
            cityList: obj.city_list,
            links: obj.links.map(l => ({
                text: l.text, url: l.url, free: l.free
            })),
            views: obj.views,
            favourites: obj.favourites,
            dialogs: obj.dialogs,
            newMessages: obj.new_messages,
            growth: obj.growth,
            responses: obj.responses,
            matchingVacancies: obj.matching_vacancies,
            daysPublished: obj.days_published,
            servicesCount: obj.services.find(s => s.id === 1) ? obj.services.length : obj.services.length + 1,
            _services: obj.services.reduce((acc, s) => {
                acc[s.id] = {
                    dateFrom: s.date_from, dateTo: s.date_to
                };
                return acc;
            }, {}),
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
    initDateInputFields(article.el);
    initArticleCalendar(article);
    initCopyLinkModals(article);
    initDeleteCityBtns(article);
    initArticleDates(article);
    initArticleStateBackground(article);
    initProlongCheckbox(article);

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

    article.el.querySelector('.adv-item__city-list .service-item').addEventListener('click', () => showChooseRegionPopup(() => {}));
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
function initProlongCheckbox(article) {
    const checkboxEnable = article.el.querySelector('.adv-item__auto-prolong .enable .fancy-radiobutton');
    const labelEnable = checkboxEnable.nextElementSibling;

    const checkboxDisable = article.el.querySelector('.adv-item__auto-prolong .disable .fancy-radiobutton');
    const labelDisable = checkboxDisable.nextElementSibling;

    const id = Date.now();
    checkboxEnable.setAttribute('id', 'auto-prolong-enable-' + id);
    labelEnable.setAttribute('for', 'auto-prolong-enable-' + id);

    checkboxDisable.setAttribute('id', 'auto-prolong-disable' + id);
    labelDisable.setAttribute('for', 'auto-prolong-disable' + id);

    checkboxEnable.setAttribute('name', 'auto-prolong-' + id);
    checkboxDisable.setAttribute('name', 'auto-prolong-' + id);

    if (article.data._autoProlong) {
        checkboxEnable.setAttribute('checked', 'checked');
    } else {
        checkboxDisable.setAttribute('checked', 'checked');
    }
}

function initArticleCalendar(article) {
    const container = article.el.querySelector('.calendar-container');
    const btn = container.querySelector('.calendar-open-btn');
    btn.addEventListener('click', () => {
        if (article.el.querySelector('.calendar') !== null) {
            return;
        }
        container.setAttribute('data-state', 'focused');

        const dateTextElem = container.querySelector('.date-value');

        const dateInputField = container.querySelector('.date-input-field');
        const dateInputFieldDay = dateInputField.querySelector('.day');

        const errorHintText = container.querySelector('.hint__text');

        clearDateInputField(dateInputField);
        dateInputFieldDay.focus();

        const calendar = showSingleCalendar(container, date => {
            setDateInputFieldValue(dateInputField, date);
            container.setAttribute('data-state', 'focused');
        }, (date, err) => {
            if (err) {
                try {
                    const date = getDateInputFieldValue(dateInputField);
                    dateTextElem.textContent = formatDateString(date.toLocaleDateString());
                    article.data._date.deactivation = date;
                    initArticleDates(article);
                    container.removeAttribute('data-state');
                    calendar.close();
                } catch (e) {
                    container.setAttribute('data-state', 'error');
                }
                return;
            }
            dateTextElem.textContent = formatDateString(date.toLocaleDateString());
            article.data._date.deactivation = date;
            initArticleDates(article);
            container.removeAttribute('data-state');
            calendar.close();
        });

        cover.addEventListener('click', () => {
            try {
                const date = getDateInputFieldValue(dateInputField);
                dateTextElem.textContent = formatDateString(date.toLocaleDateString());
                article.data._date.deactivation = date;
                initArticleDates(article);
                container.removeAttribute('data-state');
                calendar.close();
            } catch (e) {
                container.setAttribute('data-state', 'error');
            }
        });

        dateInputField.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
            container.setAttribute('data-state', 'focused');
            try {
                const date = getDateInputFieldValue(dateInputField);
                try {
                    calendar.setDate(date);
                } catch (e) {
                    calendar.clear();
                    dateInputFieldDay.focus();
                    clearDateInputField(dateInputField);
                    errorHintText.style.display = 'block';
                    setTimeout(() => {
                        errorHintText.style.display = 'none';
                    }, 2000);
                }
            } catch (e) {
            }
        }));
    });
}

function initArticleDates(article) {
    const deactivationValueElem = article.el.querySelector('.adv-item__state .calendar-container .date-value');
    deactivationValueElem.setAttribute('data-date', article.data._date.deactivation);
    deactivationValueElem.textContent = formatDateString(article.data._date.deactivation);

    article.el.querySelector('.expires .value').textContent = getDayDifference(new Date(article.data._date.activation), new Date(article.data._date.deactivation));
}

function initArticleStateBackground(article) {
    article.el.setAttribute('data-state', article.data._state);
}

function initDeleteCityBtns(article) {
    article.el.querySelectorAll('.adv-item__city-list > li:not(.service-item)').forEach(li => {
        const city = li.querySelector('span.text').textContent;
        li.querySelector('span.icon').addEventListener('click', () => {
            updateArticle(article, {cityList: article.data.cityList.filter(c => c !== city)});
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
    elem: null, text: 'Подать объявление', action: function () {
        console.log('подать объяление');
    }
}];

const actionBtns = {
    delete: {
        text: 'Удалить', action: function (a) {
            setArticleCheckState(a, false, false);
            updateArticle(a, {_state: 'deleted'});
        }
    }, activate: {
        text: 'Активировать', action: function (a) {
            setArticleCheckState(a, false, false);
            updateArticle(a, {_state: 'active'});
        }
    }, unpublish: {
        text: 'Снять с публикации', action: function (a) {
            setArticleCheckState(a, false, false);
            updateArticle(a, {_state: 'closed'});
        }
    }, emptyTrash: {
        text: 'Очистить корзину', action: function (a) {
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

function addActionBtn({text, action}) {
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

const filters = [function (a) {
    const strings = find('#adv-filter-title').value.trim().split(' ');
    let match = false;
    for (let i = 0; i < strings.length; i++) {
        if ((a.data.title.toLowerCase().includes(strings[i]) && strings[i].length > 2) || strings[i] === '') {
            match = true;
            break;
        }
    }
    return match;
}, function (a) {
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
}, function (a) {
    const priceFrom = +find('#adv-filter-price-from').value;
    const priceTo = +find('#adv-filter-price-to').value || Number.POSITIVE_INFINITY;
    const price = +a.data.price;
    return price >= priceFrom && price <= priceTo;
}, function (a) {
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
}, function (a) {
    const state = find('.adv-filter-state .tab-link.active').getAttribute('id').split('-').pop();
    return a.data._state === state;
}, function (a) {
    const comparingDate = a.data._state === 'draft' ? new Date(a.data._date.created) : new Date(a.data._date.activation);
    const dateStartStr = find('#adv-filter-date-from').getAttribute('data-date');
    const dateEndStr = find('#adv-filter-date-to').getAttribute('data-date');
    if (dateStartStr && comparingDate < new Date(dateStartStr)) {
        return false;
    }
    if (dateEndStr && comparingDate > new Date(dateEndStr)) {
        return false;
    }
    return true;
}];

const listeners = [{
    selector: ['#adv-filter-title'], event: 'input',
}, {
    selector: ['.adv-filter-type .tab-link'], event: 'click',
}, {
    selector: ['#adv-filter-price-from', '#adv-filter-price-to'], event: 'input',
}, {
    selector: ['.adv-filter-region .select ul li'], event: 'click'
}, {
    selector: ['.adv-filter-state .tab-link'], event: 'click'
}, {
    selector: ['.adv-filter-price .cross', '.adv-filter-title .cross'], event: 'click',
}, {
    selector: ['.adv-filter-date .cross'], event: 'click', checker: function (e) {
        return !find('.adv-filter-date .calendar');
    },
}];

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
        });
    });
}

// sorting
function performSorting(compareFunction) {
    const articlesCopy = filteredArticles;
    articlesCopy.sort(compareFunction);
    printArticles(articlesCopy);
}

const sorts = {
    'date': function (a1, a2) {
        if (a1.data._state === 'draft') {
            return new Date(a1.data._date.created) - new Date(a2.data._date.created);
        }
        return new Date(a1.data._date.activation) - new Date(a2.data._date.activation);
    }, 'date-rev': function (a1, a2) {
        if (a1.data._state === 'draft') {
            return new Date(a2.data._date.created) - new Date(a1.data._date.created);
        }
        return new Date(a2.data._date.activation) - new Date(a1.data._date.activation);
    }, 'title': function (a1, a2) {
        return a1.data.title.localeCompare(a2.data.title);
    }, 'title-rev': function (a1, a2) {
        return a2.data.title.localeCompare(a1.data.title);
    }, 'price': function (a1, a2) {
        return a1.data.price - a2.data.price;
    }, 'price-rev': function (a1, a2) {
        return a2.data.price - a1.data.price;
    },
};

function initSorts() {
    findAll('.action-sort .select__list > li').forEach(opt => opt.addEventListener('click', e => {
        const sortType = e.target.getAttribute('id').split('-').splice(3).join('-');
        performSorting(sorts[sortType]);
    }));
    find('.action-sort .cross').addEventListener('click', () => {
        printArticles(filteredArticles);
    });
}

let globalTestData;

initLinkPreventReload(document.body);
initClearFieldBtns(document.body);
initFilterCalendar(document.body);
initDateInputFields(document.body);
initFilterRegions(document.body);
initInputValidation();
initSorts();

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
        window.addEventListener('beforeunload', () => {
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
        el: null, data: {
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
                id: i, dateFrom: '10.05.2022', dateTo: '10.06.2022'
            }))
        }
    }];
    initArticles(globalTestData);
    initFilters(globalTestData);
});
find('.test-form .delete').addEventListener('click', () => {
    articlesContainer.innerHTML = '';
});