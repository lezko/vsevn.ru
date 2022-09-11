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

function formatDateString(str) {
    const date = new Date(str);
    return `${date.getDate()} ${monthsGenitive[date.getMonth()]} ${date.getFullYear()}`;
}

let calendarTemplate;
fetch('calendar.html')
    .then(resp => resp.text())
    .then(data => calendarTemplate = new DOMParser().parseFromString(data, 'text/html').querySelector('.calendar'));

function initCalendar(target) {
    target.querySelectorAll('.calendar-open-btn').forEach(b => b.addEventListener('click', async () => {
        if (b.parentNode.querySelector('.calendar') !== null) {
            return;
        }
        showSingleCalendar(b.parentNode, b.querySelector('input'));
    }));
    target.querySelectorAll('.calendar-open-btn--double').forEach(b => b.addEventListener('click', async () => {
        if (b.parentNode.querySelector('.calendar') !== null) {
            return;
        }
        showDoubleCalendar(b.parentNode, b.querySelector('input'));
    }));
}

function getDateFromStr(dateStr) {
    if (dateStr === null) {
         return new Date();
    } else {
        return new Date(dateStr);
    }
}

function showSingleCalendar(container, field) {
    cover.classList.remove('hidden');
    field.classList.add('on-top');

    const date = getDateFromStr(field.getAttribute('data-date'));
    const calendar = renderCalendar(date, field);

    const row = document.createElement('div');
    row.classList.add('row');
    row.appendChild(calendar);

    const calendarContainer = document.createElement('div');
    calendarContainer.classList.add('calendar-container');
    calendarContainer.appendChild(row);

    const submitBtn = document.createElement('a');
    submitBtn.textContent = 'Применить';
    submitBtn.setAttribute('href', '');
    submitBtn.classList.add('calendar__submit-btn');
    calendarContainer.appendChild(submitBtn);

    container.appendChild(calendarContainer);

    submitBtn.addEventListener('click', e => {
        e.preventDefault();
        closeCalendar(calendar, calendarContainer, field);
    });
    cover.addEventListener('click', () => {
        closeCalendar(calendar, calendarContainer, field);
    });
}

function showDoubleCalendar(calendar, calendarContainer, field) {
}

function closeCalendar(calendar, calendarContainer, field) {
    const dateStr = getDateFromCalendar(calendar).toDateString();
    field.value = formatDateString(dateStr);
    field.setAttribute('data-date', dateStr);
    field.classList.remove('on-top');
    calendarContainer.remove();
    cover.classList.add('hidden');
}

function getDateFromCalendar(calendar) {

    const yearSelect = calendar.querySelector('.calendar__year select');
    const year = +yearSelect.options[yearSelect.selectedIndex].text;

    const monthSelect = calendar.querySelector('.calendar__month select');
    const month = +monthSelect.options[monthSelect.selectedIndex].value;

    const day = +calendar.querySelector('.calendar__days .selected').textContent;

    return new Date(year, month, day);
}

function renderCalendar(date, field) {
    field.value = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    field.addEventListener('input', () => {
        const str = field.value;
        if (str.match('[0-9]{1,2}.[0-9]{2}.[0-9]{4}')) {
            const arr = str.split('.');
            date.setFullYear(arr[2]);
            date.setMonth(arr[1]);
            date.setDate(arr[0]);

            renderDays(date, daysContainer);
            monthSelect.selectedIndex = arr[1] - 1;
            yearSelect.selectedIndex = (new Date()).getFullYear() - arr[2];
        }
    });

    const calendar = calendarTemplate.cloneNode(true);

    const yearSelect = calendar.querySelector('.calendar__year select');
    for (let i = (new Date()).getFullYear(); i >= START_YEAR; i--) {
        yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    yearSelect.addEventListener('change', () => {
        const year = +yearSelect.options[yearSelect.selectedIndex].text;
        date.setFullYear(year);
        renderDays(date, daysContainer);
    });
    yearSelect.nextElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex--;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = (new Date()).getFullYear() - START_YEAR;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer);
    });
    yearSelect.previousElementSibling.addEventListener('click', () => {
        yearSelect.selectedIndex++;
        if (yearSelect.selectedIndex < 0) {
            yearSelect.selectedIndex = 0;
        }
        date.setFullYear(+yearSelect.options[yearSelect.selectedIndex].text);
        renderDays(date, daysContainer);
    });

    const monthSelect = calendar.querySelector('.calendar__month select');
    for (let i = 0; i < 12; i++) {
        monthSelect.innerHTML += `<option value="${i}">${monthDefault[i]}</option>`;
    }
    monthSelect.addEventListener('change', () => {
        const month = +monthSelect.options[monthSelect.selectedIndex].value;
        date.setMonth(month);
        renderDays(date, daysContainer);
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
        renderDays(date, daysContainer);
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
        renderDays(date, daysContainer);
    });

    const daysContainer = calendar.querySelector('.calendar__days');
    renderDays(date, daysContainer);

    return calendar;
}

function renderDays(date, daysContainer) {
    daysContainer.innerHTML = '';
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const prevDays = (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();

    for (let i = 0; i < prevDays - 1; i++) {
        daysContainer.innerHTML += `<div></div>`;
    }

    let selectedDay;

    for (let i = 1; i <= lastDay; i++) {
        const day = document.createElement('div');
        if (i === date.getDate()) {
            selectedDay = day;
            selectedDay.classList.add('selected');
        }
        day.textContent = i;
        day.addEventListener('click', () => {
            selectedDay?.classList.remove('selected');
            selectedDay = day;
            selectedDay.classList.add('selected');
        });
        daysContainer.appendChild(day);
    }
}