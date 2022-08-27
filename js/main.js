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

const elems = [].concat(...findAll('.adv-item__title'), ...findAll('.adv-item__city-list > li'), ...findAll('.ads__field-names--big > span'));
initFadeEffects(elems, true);

window.addEventListener('resize', () => {
    initFadeEffects(elems, false);
});