import {make} from './ui';
import alignCenter from './svg/align-horizontal-center.svg'
import alignLeft from './svg/align-horizontal-left.svg'
import alignRight from './svg/align-horizontal-right.svg'
import rounded from './svg/rounded-corner.svg'
import sizeL from './svg/size-l.svg'
import sizeM from './svg/size-m.svg'
import sizeS from './svg/size-s.svg'

/**
 * Working with Block Tunes
 */
export default class Tunes {
    /**
     * @param {object} tune - image tool Tunes managers
     * @param {object} tune.api - Editor API
     * @param {object} tune.actions - list of user defined tunes
     * @param {Function} tune.onChange - tune toggling callback
     */
    constructor({api, actions, onChange}) {
        this.api = api;
        this.actions = actions;
        this.onChange = onChange;
        this.buttons = [];
    }

    /**
     * Available Image tunes
     *
     * @returns {{name: string, icon: string, title: string}[]}
     */
    static get tunes() {
        return [
            {
                name: 'align_left',
                icon: alignLeft,
                title: "Left",
            },
            {
                name: 'align_center',
                icon: alignCenter,
                title: "Center",
            },
            {
                name: 'align_right',
                icon: alignRight,
                title: "Right",
            },
            {
                name: 'size_100',
                icon: sizeL,
                title: "100%",
            },
            {
                name: 'size_50',
                icon: sizeM,
                title: "50%",
            },
            {
                name: 'size_33',
                icon: sizeS,
                title: "33%",
            },
            {
                name: 'rounded',
                icon: rounded,
                title: "rounded",
            },
        ];
    }

    /**
     * Styles
     *
     * @returns {{wrapper: string, buttonBase: *, button: string, buttonActive: *}}
     */
    get CSS() {
        return {
            wrapper: '',
            buttonBase: this.api.styles.settingsButton,
            button: 'image-tool__tune',
            buttonActive: this.api.styles.settingsButtonActive,
        };
    }

    /**
     * Makes buttons with tunes: add background, add border, stretch image
     *
     * @param {ImageToolData} toolData - generate Elements of tunes
     * @returns {Element}
     */
    render(toolData) {
        const wrapper = make('div', this.CSS.wrapper);

        this.buttons = [];

        const tunes = Tunes.tunes.concat(this.actions);

        tunes.forEach(tune => {
            const title = this.api.i18n.t(tune.title);
            const el = make('div', [this.CSS.buttonBase, this.CSS.button], {
                innerHTML: tune.icon,
                title,
            });

            el.addEventListener('click', () => {
                this.tuneClicked(tune.name, tune.action);
            });

            el.dataset.tune = tune.name;
            el.classList.toggle(this.CSS.buttonActive, toolData[tune.name]);

            this.buttons.push(el);

            this.api.tooltip.onHover(el, title, {
                placement: 'top',
            });

            wrapper.appendChild(el);
        });

        return wrapper;
    }

    /**
     * Clicks to one of the tunes
     *
     * @param {string} tuneName - clicked tune name
     * @param {Function} customFunction - function to execute on click
     */
    tuneClicked(tuneName, customFunction) {
        if (typeof customFunction === 'function') {
            if (!customFunction(tuneName)) {
                return false;
            }
        }

        const button = this.buttons.find(el => el.dataset.tune === tuneName);

        button.classList.toggle(this.CSS.buttonActive, !button.classList.contains(this.CSS.buttonActive));

        this.onChange(tuneName);
    }
}
