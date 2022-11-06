function showHint(container, message, delay = 1000) {
    const hint = document.createElement('span');
    hint.classList.add('hint__text', 'hint__text--center');
    hint.textContent = message;
    hint.style.display = 'block';

    container.appendChild(hint);
    console.log(hint);
    setTimeout(() => container.removeChild(hint), delay);
}