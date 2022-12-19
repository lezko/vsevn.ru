const popupTemplate = `
    <div class="popup hidden">
        <div class="popup__header">
            <span class="popup__cross icon-cross-svgrepo-com"></span>
        </div>
    </div>
`;

function Popup(options = {}) {
    this.container = options.container;

    this.mainElement = new DOMParser().parseFromString(popupTemplate, 'text/html').body.firstChild;
    this.container.appendChild(this.mainElement);

    this.cover = cover;
    this.cover.classList.add('cover', 'hidden');
    this.cover.addEventListener('click', () => {
        this.close();
    });
    document.body.appendChild(this.cover);

    this.cross = this.mainElement.querySelector('.popup__cross');
    this.cross.addEventListener('click', e => {
        e.stopPropagation();
        this.close();
    });

    this.header = this.mainElement.querySelector('.popup__header');
    if (options.title) {
        this.header.insertAdjacentHTML('afterbegin', `<p>${options.title}</p>`)
    }

    if (options.contentElement && typeof options.contentElement === 'object') {
        this.contentElement = options.contentElement;
        this.mainElement.appendChild(this.contentElement);
    }

    this.open = function () {
        this.mainElement.classList.remove('hidden');
        this.cover.classList.remove('hidden');
    };
    this.close = function () {
        this.mainElement.classList.add('hidden');
        this.cover.classList.add('hidden');

        if (typeof options.onClose === 'function') {
            options.onClose.call(this);
        }
    };
    this.setContent = function (elem) {
        if (!elem || typeof elem !== 'object') {
            return;
        }

        if (this.contentElement && typeof this.contentElement === 'object') {
            this.mainElement.removeChild(this.contentElement);
        }
        this.contentElement = elem;
        this.mainElement.appendChild(this.contentElement);
    };
    this.destroy = function () {
        this.container.removeChild(this.mainElement);
    };
}