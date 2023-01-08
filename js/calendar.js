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

const MAX_YEAR = new Date().getFullYear() + 1;
const MIN_YEAR = MAX_YEAR - 20;

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
];

function formatDate(date) {
    return `${ date.getDate() } ${ monthsGenitive[date.getMonth()] } ${ date.getFullYear() }`;
}

let calendarTemplate;
fetch('calendar.html')
    .then(resp => resp.text())
    .then(data => calendarTemplate = new DOMParser().parseFromString(data, 'text/html').querySelector('.calendar'));

function getDayDifference(date1, date2) {
    return (date2 - date1) / 1000 / 60 / 60 / 24;
}

function CalendarPopup(container) {
    cover.classList.remove('hidden');
    row.innerHTML = '';
    submitBtn = recreateSubmitBtn();
    container.appendChild(calendarWrapper);

    this.close = function () {
        calendarWrapper.remove();
        cover.classList.add('hidden');
    };
}

function SingleCalendar(opts) {
    CalendarPopup.call(this, opts.container);
    const calendar = new Calendar(opts);

    row.appendChild(calendar.element);

    submitBtn.addEventListener('click', () => {
        let date, err;
        try {
            date = this.getDate();
        } catch (e) {
            err = e;
        }
        opts.submitCallback(date, err);
    });

    // public methods
    this.getDate = calendar.getDate;
    this.setDate = calendar.setDate;
    this.clear = calendar.clear;
}

function DoubleCalendar(opts) {
    CalendarPopup.call(this, opts.container);

    const calendar1 = new Calendar({
        selectedDate: opts.selectedDate1,
        limitDays: opts.limitDays,
        selectCallback: opts.selectCallback1
    });
    const calendar2 = new Calendar({
        selectedDate: opts.selectedDate2,
        limitDays: opts.limitDays,
        selectCallback: opts.selectCallback2
    });

    row.appendChild(calendar1.element);
    row.appendChild(calendar2.element);

    submitBtn.addEventListener('click', () => {
        let date1, date2, err;
        try {
            date1 = calendar1.getDate();
        } catch (e) {
            err = e;
        }
        try {
            date2 = calendar2.getDate();
        } catch (e) {
            err = e;
        }
        opts.submitCallback(date1, date2, err);
    });

    // public methods
    this.setDate = function (calendarNumber, date) {
        if (calendarNumber === 1) {
            calendar1.setDate(date);
        } else {
            calendar2.setDate(date);
        }
    };

    this.getDate = function (calendarNumber) {
        return calendarNumber === 1 ? calendar1.getDate() : calendar2.getDate;
    };

    this.clear = function (calendarNumber) {
        calendarNumber === 1 ? calendar1.clear() : calendar2.clear();
    };
}

function checkDateAvailable(date) {
    let available = false;
    for ([startDate, finishDate] of availableDates) {
        if (startDate <= date && date <= finishDate) {
            available = true;
            break;
        }
    }
    return available;
}

const testBtn = document.querySelector('.calendar-test-btn');
const testContainer = document.querySelector('.calendar-test');
testBtn.addEventListener('click', () => {
    const calendar = new DoubleCalendar({
        container: testContainer,
        selectedDate1: new Date(2020, 0, 15),
        selectedDate2: new Date(2015, 0, 15),
        selectCallback1(date) {
            console.log(`1: ${date}`);
        },
        selectCallback2(date) {
            console.log(`2: ${date}`);
        },
        submitCallback(date1, date2, err) {
            console.log(`both: ${date1}, ${date2}`);
        },
    });
    cover.addEventListener('click', () => {
        calendar.close();
    });
});


function Calendar(opts) {

    let selectedDate = opts.selectedDate;
    const $calendar = calendarTemplate.cloneNode(true);

    const yearSelect = $calendar.querySelector('.calendar__year select');
    const monthSelect = $calendar.querySelector('.calendar__month select');
    for (let i = MAX_YEAR; i >= MIN_YEAR; i--) {
        yearSelect.innerHTML += `<option value="${ i }">${ i }</option>`;
    }
    for (let i = 0; i < 12; i++) {
        monthSelect.innerHTML += `<option value="${ i }">${ monthDefault[i] }</option>`;
    }

    const yearPrevBtn = yearSelect.previousElementSibling;
    const yearNextBtn = yearSelect.nextElementSibling;
    const monthPrevBtn = monthSelect.previousElementSibling;
    const monthNextBtn = monthSelect.nextElementSibling;

    const daysContainer = $calendar.querySelector('.calendar__days');

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    if (selectedDate) {
        currentYear = selectedDate.getFullYear();
        currentMonth = selectedDate.getMonth();
    }
    setYear(currentYear);
    setMonth(currentMonth);

    renderDays();

    // public methods
    this.setDate = function (date) {
        if (opts.limitDays && !checkDateAvailable(date)) {
            throw new Error('Cannot set unavailable date');
        }

        setSelectedDate(date);
        renderDays();
    };

    this.getDate = function () {
        if (!selectedDate) {
            throw new Error('No date selected');
        }

        return selectedDate;
    };

    this.clear = function () {
        $calendar.querySelector('.selected')?.classList.remove('selected');
    };

    this.element = $calendar;

    function lastYear() {
        return currentYear === MAX_YEAR;
    }

    function leastYear() {
        return currentYear === MIN_YEAR;
    }

    function lastMonth() {
        return currentMonth === 11;
    }

    function leastMonth() {
        return currentMonth === 0;
    }

    function setBtnEnabled(btn, enabled) {
        if (enabled) {
            btn.removeAttribute('data-disabled');
        } else {
            btn.setAttribute('data-disabled', 'true');
        }
    }

    function setYear(year) {
        if (year < 0 || year > MAX_YEAR) {
            throw new Error(`Invalid year: ${ year }`);
        }
        currentYear = year;
        yearSelect.selectedIndex = (MAX_YEAR - year);
    }

    function setMonth(month) {
        if (month < 0 || month > 11) {
            throw new Error(`Invalid month: ${ month }`);
        }
        currentMonth = month;
        monthSelect.selectedIndex = month;
    }

    function setSelectedDate(date) {
        setYear(date.getFullYear());
        setMonth(date.getMonth());
        selectedDate = date;
    }

    function incrementYear() {
        setYear(currentYear + 1);
    }

    function decrementYear() {
        setYear(currentYear - 1);
    }

    function incrementMonth() {
        setMonth(currentMonth + 1);
    }

    function decrementMonth() {
        setMonth(currentMonth - 1);
    }

    function updateBtnsState() {
        setBtnEnabled(yearNextBtn, !lastYear());
        setBtnEnabled(yearPrevBtn, !leastYear());

        setBtnEnabled(monthNextBtn, !lastMonth() || !lastYear());
        setBtnEnabled(monthPrevBtn, !leastMonth() || !leastYear());
    }

    function renderDays() {
        daysContainer.innerHTML = '';
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        let prevDay = (new Date(currentYear, currentMonth, 1)).getDay() - 1;
        if (prevDay < 0) {
            prevDay = 6;
        }

        for (let i = 0; i < prevDay; i++) {
            daysContainer.innerHTML += `<div></div>`;
        }

        let $selectedDay;
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const $day = document.createElement('div');
            if (selectedDate && selectedDate.getTime() === new Date(currentYear, currentMonth, i).getTime()) {
                $selectedDay = $day;
                $selectedDay.classList.add('selected');
            }
            $day.innerHTML = `<span class="value">${ i }</span><span class="hint__text hint__text--center">Эту дату нельзя выбрать</span>`;

            const available = !opts.limitDays || checkDateAvailable(new Date(currentYear, currentMonth, i));
            $day.classList.add(available ? 'available' : 'hint');
            $day.addEventListener('click', () => {
                if (!$day.classList.contains('available')) {
                    return;
                }
                $selectedDay?.classList.remove('selected');
                $selectedDay = $day;
                $selectedDay.classList.add('selected');

                const date = +$selectedDay.querySelector('.value').textContent;
                selectedDate = new Date(currentYear, currentMonth, date);

                opts.selectCallback(selectedDate);
            });
            daysContainer.appendChild($day);
        }

        let k = (lastDay.getDay() - 1);
        if (k < 0) {
            k = 6;
        }
        for (let i = 0; i < 6 - k; i++) {
            daysContainer.appendChild(document.createElement('div'));
        }
    }

    yearNextBtn.addEventListener('click', () => {
        incrementYear();
        updateBtnsState();
        renderDays();
    });
    yearPrevBtn.addEventListener('click', () => {
        decrementYear();
        updateBtnsState();
        renderDays();
    });
    monthNextBtn.addEventListener('click', () => {
        if (!lastMonth()) {
            incrementMonth();
        } else if (!lastYear()) {
            incrementYear();
            setMonth(0);
        }
        updateBtnsState();
        renderDays();
    });
    monthPrevBtn.addEventListener('click', () => {
        if (!leastMonth()) {
            decrementMonth();
        } else if (!leastYear()) {
            decrementYear();
            setMonth(11);
        }
        updateBtnsState();
        renderDays();
    });

    yearSelect.addEventListener('change', () => {
        setYear(MAX_YEAR - +yearSelect.selectedIndex);
        updateBtnsState();
        renderDays();
    });
    monthSelect.addEventListener('change', () => {
        setMonth(+monthSelect.selectedIndex);
        updateBtnsState();
        renderDays();
    });
}