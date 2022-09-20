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
    [new Date('1/1/2003'), new Date('8/31/2022')],
    [new Date('10/1/2022'), new Date('12/31/2022')]
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

function showSingleCalendar(container, selectCallback, submitCallback) {
    cover.classList.remove('hidden');

    const calendar = renderCalendar(selectCallback, true);

    row.innerHTML = '';
    row.appendChild(calendar.element);

    submitBtn = recreateSubmitBtn();
    submitBtn.addEventListener('click', () => {
        let date, err;
        try {
            date = getDateFromCalendar(calendar.element);
        } catch (e) {
            err = e;
        }
        submitCallback(date, err);
    });
    container.appendChild(calendarWrapper);

    return {
        ...calendar,
        close() {
            calendarWrapper.remove();
            cover.classList.add('hidden');
        }
    }
}

function showDoubleCalendar(container, selectCallback1, selectCallback2, submitCallback) {
    cover.classList.remove('hidden');

    const calendar1 = renderCalendar(selectCallback1);
    const calendar2 = renderCalendar(selectCallback2);

    row.innerHTML = '';
    row.appendChild(calendar1.element);
    row.appendChild(calendar2.element);

    submitBtn = recreateSubmitBtn();
    submitBtn.addEventListener('click', () => {
        let date1, date2, err;
        try {
            date1 = getDateFromCalendar(calendar1.element);
        } catch (e) {
            err = e;
        }
        try {
            date2 = getDateFromCalendar(calendar2.element);
        } catch (e) {
            err = e;
        }
        submitCallback(date1, date2, err);
    });

    container.appendChild(calendarWrapper);

    return {
        first: calendar1,
        second: calendar2,
        close() {
            calendarWrapper.remove();
            cover.classList.add('hidden');
        }
    }
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

    throw new Error('cannot get date from calendar: no day selected');
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

function renderCalendar(selectCallback, limitDays = false) {
    const date = new Date();
    const calendar = calendarTemplate.cloneNode(true);

    const yearSelect = calendar.querySelector('.calendar__year select');
    for (let i = (new Date()).getFullYear(); i >= START_YEAR; i--) {
        yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    yearSelect.selectedIndex = (new Date()).getFullYear() - date.getFullYear();
    yearSelect.addEventListener('change', () => {
        const year = +yearSelect.options[yearSelect.selectedIndex].text;
        date.setFullYear(year);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });
    yearSelect.nextElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex--;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = (new Date()).getFullYear() - START_YEAR;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });
    yearSelect.previousElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex++;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = 0;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer, selectCallback, limitDays);
    });

    const monthSelect = calendar.querySelector('.calendar__month select');
    for (let i = 0; i < 12; i++) {
        monthSelect.innerHTML += `<option value="${i}">${monthDefault[i]}</option>`;
    }
    monthSelect.selectedIndex = date.getMonth();
    monthSelect.addEventListener('change', () => {
        const month = +monthSelect.options[monthSelect.selectedIndex].value;
        date.setMonth(month);
        renderDays(date, daysContainer, selectCallback, limitDays);
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
        renderDays(date, daysContainer, selectCallback, limitDays);
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
        renderDays(date, daysContainer, selectCallback, limitDays);
    });

    const daysContainer = calendar.querySelector('.calendar__days');
    renderDays(date, daysContainer, selectCallback, limitDays, false);

    return {
        setDate(date) {
            if (limitDays && !checkDateAvailable(date)) {
                throw new Error("Unavailable date selected");
            }

            date.setFullYear(date.getFullYear());
            yearSelect.selectedIndex = (new Date()).getFullYear() - date.getFullYear();

            date.setMonth(date.getMonth());
            monthSelect.selectedIndex = date.getMonth();

            renderDays(date, daysContainer, selectCallback, limitDays, true);
        },
        clear() {
            clearSelection(calendar);
        },
        element: calendar
    };
}

function renderDays(date, daysContainer, selectCallback, limitDays = false, daySelected = false) {
    daysContainer.innerHTML = '';
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let prevDay = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay() - 1;
    if (prevDay < 0) {
        prevDay = 6;
    }

    for (let i = 0; i < prevDay; i++) {
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
            date.setDate(+selectedDay.querySelector('.value').textContent);

            console.log(selectedDay);
            console.log(date);

            selectCallback(date);
        });
        daysContainer.appendChild(day);
    }

    let k = (lastDay.getDay() - 1);
    if (k < 0) {
        k = 6;
    }
    for (let i = 0; i < 6 - k; i++) {
        daysContainer.appendChild(document.createElement('div'));
    }
}

function clearSelection(calendar) {
    calendar.querySelector('.selected')?.classList.remove('selected');
}