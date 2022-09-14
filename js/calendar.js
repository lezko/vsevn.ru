const monthDefault = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];
const monthsGenitive = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
];

const START_YEAR = 2003;

const row = document.createElement('div');
row.classList.add('row');

const calendarWrapper = document.createElement('div');
calendarWrapper.classList.add('calendar-wrapper');
calendarWrapper.appendChild(row);

let submitBtn;

function recreateSubmitBtn() {
    submitBtn?.remove();

    const newBtn = document.createElement('a');
    newBtn.textContent = 'Применить';
    newBtn.setAttribute('href', '');
    newBtn.classList.add('calendar__submit-btn');
    calendarWrapper.appendChild(newBtn);

    newBtn.addEventListener('click', e => e.preventDefault());

    return newBtn;
}

const availableDates = [
    [new Date('8/16/2022'), new Date('8/31/2022')],
    [new Date('9/1/2022'), new Date('9/15/2022')]
]

function formatDateString(str) {
    const date = new Date(str);
    return `${date.getDate()} ${monthsGenitive[date.getMonth()]} ${date.getFullYear()}`;
}

let calendarTemplate;
fetch('calendar.html')
    .then(resp => resp.text())
    .then(data => calendarTemplate = new DOMParser().parseFromString(data, 'text/html').querySelector('.calendar'));

function getDayDifference(date1, date2) {
    return (date2 - date1) / 1000 / 60 / 60 / 24;
}

function showSingleCalendar(container, field) {
    return new Promise(resolve => {
        cover.classList.remove('hidden');
        field.classList.add('on-top');

        const date = new Date(field.getAttribute('data-date'));
        const calendar = renderCalendar(date, field, true);

        row.innerHTML = '';
        row.appendChild(calendar);

        submitBtn = recreateSubmitBtn();
        container.appendChild(calendarWrapper);

        submitBtn.addEventListener('click', e => {
            e.preventDefault();
            closeCalendar(calendar, calendarWrapper, field, true);
            resolve(field.getAttribute('data-date'));
        });
        cover.addEventListener('click', () => {
            closeCalendar(calendar, calendarWrapper, field, false);
            resolve(field.getAttribute('data-date'));
        });
    });
}

function showDoubleCalendar(container, field1, field2) {
    return new Promise(resolve => {
        cover.classList.remove('hidden');
        field1.classList.add('on-top');
        field2.classList.add('on-top');

        const dateStr1 = field1.getAttribute('data-date');
        const dateStr2 = field2.getAttribute('data-date');
        const date1 = dateStr1 ? new Date(dateStr1) : null;
        const date2 = dateStr2 ? new Date(dateStr2) : null;
        const calendar1 = renderCalendar(date1, field1);
        const calendar2 = renderCalendar(date2, field2);

        row.innerHTML = '';
        row.appendChild(calendar1);
        row.appendChild(calendar2);

        submitBtn = recreateSubmitBtn();
        container.appendChild(calendarWrapper);

        submitBtn.addEventListener('click', e => {
            e.preventDefault();
            closeCalendar(calendar1, calendarWrapper, field1, true);
            closeCalendar(calendar2, calendarWrapper, field2, true);
            resolve([field1.getAttribute('data-date'), field2.getAttribute('data-date')]);
        });
        cover.addEventListener('click', () => {
            closeCalendar(calendar1, calendarWrapper, field1, false);
            closeCalendar(calendar2, calendarWrapper, field2, false);
            resolve([field1.getAttribute('data-date'), field2.getAttribute('data-date')]);
        });
    });
}

function closeCalendar(calendar, calendarContainer, field, getDate) {
    let dateStr;
    if (getDate) {
        dateStr = getDateFromCalendar(calendar)?.toLocaleDateString();
    } else {
        dateStr = field.getAttribute('data-date');
    }

    if (dateStr) {
        field.value = formatDateString(dateStr);
        field.setAttribute('data-date', dateStr);
    } else {
        field.value = '';
    }
    field.classList.remove('on-top');
    calendarContainer.remove();
    cover.classList.add('hidden');
}

function getDateFromCalendar(calendar) {

    const yearSelect = calendar.querySelector('.calendar__year select');
    const year = +yearSelect.options[yearSelect.selectedIndex].text;

    const monthSelect = calendar.querySelector('.calendar__month select');
    const month = +monthSelect.options[monthSelect.selectedIndex].value;

    const day = calendar.querySelector('.calendar__days .selected');

    if (day) {
        return new Date(year, month, +day.querySelector('.value').textContent);
    }

    return null;
}

function checkDateAvailable(date) {
    let available = false;
    for ([startDate, finishDate] of availableDates) {
        if (startDate <= date && date <= finishDate) {
            available = true;
            break
        }
    }
    return available;
}

function renderCalendar(date, field, limitDays = false) {
    let daySelected = true;
    if (date == null) {
        date = new Date();
        daySelected = false;
    }
    const hintText = field.parentNode.querySelector('.hint__text');

    if (daySelected) {
        const arr = date.toLocaleDateString().split('/');
        if (arr[1].length === 1) {
            arr[1] = '0' + arr[1];
        }
        if (arr[0].length === 1) {
            arr[0] = '0' + arr[0];
        }
        field.value = `${arr[1]}.${arr[0]}.${arr[2]}`;
    }

    field.addEventListener('input', () => {
        const str = field.value;
        if (str.match('[0-9]{2}.[0-9]{2}.[0-9]{4}')) {
            const arr = str.split('.');
            date = new Date(`${arr[1]}/${arr[0]}/${arr[2]}`);
            if (!limitDays || checkDateAvailable(date)) {
                renderDays(date, daysContainer, limitDays);
                monthSelect.selectedIndex = arr[1] - 1;
                yearSelect.selectedIndex = (new Date()).getFullYear() - arr[2];
            } else {
                hintText.style.display = 'block';
                setTimeout(() => hintText.style.display = 'none', 2000);
                field.value = '';
            }
        }
    });

    const calendar = calendarTemplate.cloneNode(true);

    const yearSelect = calendar.querySelector('.calendar__year select');
    for (let i = (new Date()).getFullYear(); i >= START_YEAR; i--) {
        yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    yearSelect.selectedIndex = (new Date()).getFullYear() - date.getFullYear();
    yearSelect.addEventListener('change', () => {
        const year = +yearSelect.options[yearSelect.selectedIndex].text;
        date.setFullYear(year);
        renderDays(date, daysContainer, limitDays);
    });
    yearSelect.nextElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex--;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = (new Date()).getFullYear() - START_YEAR;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer, limitDays);
    });
    yearSelect.previousElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex++;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = 0;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer, limitDays);
    });

    const monthSelect = calendar.querySelector('.calendar__month select');
    for (let i = 0; i < 12; i++) {
        monthSelect.innerHTML += `<option value="${i}">${monthDefault[i]}</option>`;
    }
    monthSelect.selectedIndex = date.getMonth();
    monthSelect.addEventListener('change', () => {
        const month = +monthSelect.options[monthSelect.selectedIndex].value;
        date.setMonth(month);
        renderDays(date, daysContainer, limitDays);
    });
    monthSelect.nextElementSibling.addEventListener('click', () => {
        monthSelect.selectedIndex++;
        if (monthSelect.selectedIndex < 0) {
            if (+yearSelect.options[yearSelect.selectedIndex].text === (new Date()).getFullYear()) {
                monthSelect.selectedIndex = 11;
                return;
            }
            yearSelect.selectedIndex--;
            date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
            monthSelect.selectedIndex = 0;
        }
        date.setMonth(+monthSelect.selectedIndex);
        renderDays(date, daysContainer, limitDays);
    });
    monthSelect.previousElementSibling.addEventListener('click', () => {
        monthSelect.selectedIndex--;
        if (monthSelect.selectedIndex < 0) {
            if (+yearSelect.options[yearSelect.selectedIndex].text === START_YEAR) {
                monthSelect.selectedIndex = 0;
                return;
            }
            yearSelect.selectedIndex++;
            date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
            monthSelect.selectedIndex = 11;
        }
        date.setMonth(+monthSelect.selectedIndex);
        renderDays(date, daysContainer, limitDays);
    });

    const daysContainer = calendar.querySelector('.calendar__days');
    renderDays(date, daysContainer, limitDays, daySelected);

    return calendar;
}

function renderDays(date, daysContainer, limitDays = false, daySelected = true) {
    daysContainer.innerHTML = '';
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const prevDays = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();

    for (let i = 0; i < prevDays - 1; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    let selectedDay;

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const day = document.createElement('div');
        if (daySelected && i === date.getDate()) {
            selectedDay = day;
            selectedDay.classList.add('selected');
        }
        day.innerHTML = `<span class="value">${i}</span><span class="hint__text hint__text--center">Эту дату нельзя выбрать</span>`;

        const available = !limitDays || checkDateAvailable(new Date(date.getFullYear(), date.getMonth(), i));
        day.classList.add(available ? 'available' : 'hint');
        day.addEventListener('click', () => {
            if (!day.classList.contains('available')) {
                return;
            }
            selectedDay?.classList.remove('selected');
            selectedDay = day;
            selectedDay.classList.add('selected');
        });
        daysContainer.appendChild(day);
    }

    for (let i = 0; i < 7 - lastDay.getDay(); i++) {
        daysContainer.innerHTML += `<div></div>`;
    }
}