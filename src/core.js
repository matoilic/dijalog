/* global noop */
/* global on */
/* global once */
/* global addClass */
/* global removeClass */
/* global append */
/* global assign */
/* global trigger */
/* global serializeForm */
/* global last */
/* global css */
/* global createElement */
/* global define */

function dijalogFactory() {
    var wrapper;
    var body = document.body;
    var spinner;
    var currentDijalog;

    var dijalog = {
        dialogs: [],

        overlay: null,

        animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend',

        baseClassNames: {
            dijalog: 'dijalog',
            content: 'dijalog-content',
            overlay: 'dijalog-overlay',
            close: 'dijalog-close',
            closing: 'dijalog-closing',
            open: 'dijalog-open',
            hiding: 'dijalog-hiding',
            hidden: 'dijalog-hidden',
            visible: 'dijalog-visible'
        },

        defaultOptions: {
            content: '',
            showCloseButton: true,
            escapeButtonCloses: true,
            overlayClosesOnClick: true,
            appendLocation: body,
            className: 'dijalog-theme-default',
            css: {},
            overlayClassName: '',
            overlayCSS: {},
            contentClassName: '',
            contentCSS: {},
            closeClassName: '',
            closeCSS: {},
            beforeClose: noop,
            afterClose: noop
        },

        defaultDialogOptions: {
            callback: noop,
            afterOpen: noop,
            message: 'Message',
            input: '<input name="dijalog" type="hidden" value="_dijalog-empty-value">',
            value: false,
            buttons: [
                {
                    text: 'OK',
                    type: 'submit',
                    className: 'dijalog-button-primary'
                },
                {
                    text: 'Cancel',
                    type: 'button',
                    className: 'dijalog-button-secondary',
                    click: function() {
                        var dialog = dijalog.findParentDialog(this);
                        dijalog.close(dialog.id);
                    }
                }
            ],
            showCloseButton: false,
            onSubmit: function(event) {
                var dialog = dijalog.findParentDialog(this);
                var form = dialog.contentElement.querySelector('form');

                event.preventDefault();
                event.stopPropagation();
                dialog.value = dijalog.getFormValueOnSubmit(serializeForm(form));

                dijalog.close(dialog.id);
            },
            focusFirstInput: true
        },

        defaultAlertOptions: {
            message: 'Alert',
            buttons: [
                {
                    text: 'OK',
                    type: 'submit',
                    className: 'dijalog-button-primary'
                }
            ]
        },

        defaultConfirmOptions: {
            message: 'Confirm'
        },

        _close: function(dialog) {
            var content = dialog.contentElement;

            trigger(content, 'dijalogclose', dialog);
            content.parentNode.removeChild(content);

            if(!dijalog.dialogs.length) {
                this._hideOverlay();
            } else {
                removeClass(wrapper, dijalog.baseClassNames.hiding);
                dijalog.show();
            }

            trigger(body, 'dijalogafterclose');
            dialog.afterClose();
        },

        close: function(id) {
            if(!dijalog.dialogs.length) return false;

            var dialog = dijalog.get(id, true);

            if(dialog.beforeClose(dialog) !== false) {
                once(wrapper, dijalog.animationEndEvent, dijalog._close.bind(this, dialog));

                if(dijalog.dialogs.length) {
                    addClass(wrapper, dijalog.baseClassNames.hiding);
                } else {
                    addClass(wrapper, dijalog.baseClassNames.closing);
                }

                removeClass(dialog.contentElement, dijalog.baseClassNames.visible);

                if(currentDijalog === dialog) {
                    currentDijalog = null;
                }
            }

            return true;
        },

        closeAll: function() {
            while(dijalog.close());
        },

        get: function(id, remove) {
            if(remove) {
                return id ? dijalog.dialogs.splice(id - 1, 1).pop() : dijalog.dialogs.pop();
            }

            return id ? dijalog.dialogs.slice(id - 1, id).pop() : last(dijalog.dialogs);
        },

        _hide: function(dialog) {
            removeClass(wrapper, dijalog.baseClassNames.hiding);
            addClass(dialog.contentElement, dijalog.baseClassNames.hidden);
            trigger(wrapper, 'dijaloghidden');
        },

        hide: function(id) {
            if(!dijalog.dialogs.length) return false;

            var dialog = dijalog.get(id);

            if(currentDijalog === dialog) {
                currentDijalog = null;
            }

            once(wrapper, dijalog.animationEndEvent, dijalog._hide.bind(this, dialog));
            addClass(wrapper, dijalog.baseClassNames.hiding);
            removeClass(dialog.contentElement, dijalog.baseClassNames.visible);
        },

        hideLoading: function() {
            if(spinner) {
                spinner.parentNode.removeChild(spinner);
                spinner = null;
            }

            if(!dijalog.dialogs.length) {
                this._hideOverlay();
            }
        },

        _showOverlay: function(options) {
            var overlay;

            if(!wrapper) {
                wrapper = createElement('div');
                addClass(wrapper, dijalog.baseClassNames.dijalog);
                addClass(wrapper, options.className);
                css(wrapper, options.css);

                overlay = createElement('div');
                addClass(overlay, dijalog.baseClassNames.overlay);
                addClass(overlay, options.overlayClassName);
                css(overlay, options.overlayCSS);

                on(overlay, 'click', function(event) {
                    if (currentDijalog && currentDijalog.overlayClosesOnClick && event.target === overlay) {
                        dijalog.close(options.id);
                    }
                });

                append(wrapper, overlay);
                append(options.appendLocation, wrapper);
            }
        },

        _hideOverlay: function() {
            if(wrapper) {
                wrapper.parentNode.removeChild(wrapper);
                wrapper = null;
            }
        },

        show: function(id) {
            if(!dijalog.dialogs.length) return false;

            var dialog = dijalog.get(id);
            removeClass(dialog.contentElement, dijalog.baseClassNames.hidden);
            addClass(dialog.contentElement, dijalog.baseClassNames.visible);

            currentDijalog = dialog;
        },

        showLoading: function(withOverlay, options) {
            if(withOverlay) {
                options = assign({}, dijalog.defaultOptions, options);
                this._showOverlay(options);
            }

            if(!spinner) {
                spinner = createElement('div');
                addClass(spinner, 'dijalog-spinner');
                addClass(spinner, dijalog.defaultOptions.className);
                append(withOverlay ? wrapper : dijalog.defaultOptions.appendLocation, spinner);
            }
        },

        _open: function(options) {
            var content;
            var closeButton;

            content = createElement('div');
            addClass(content, dijalog.baseClassNames.content + ' ' + dijalog.baseClassNames.visible);
            addClass(content, options.contentClassName);
            css(content, options.contentCSS);
            append(content, options.content);

            append(wrapper, content);

            if (options.showCloseButton) {
                closeButton = createElement('div');
                addClass(closeButton, dijalog.baseClassNames.close);
                addClass(closeButton, options.closeClassName);
                css(closeButton, options.closeCSS);

                on(closeButton, 'click', function() {
                    dijalog.close(options.id);
                });

                append(content, closeButton);
            }

            options.contentElement = content;
            dijalog.dialogs.push(options);
            options.id = dijalog.dialogs.length;

            currentDijalog = options;

            if (options.afterOpen) {
                options.afterOpen(options);
            }

            setTimeout(function() {
                trigger(content, 'dijalogopen', options);
            }, 0);
        },

        open: function(options) {
            options = assign({}, dijalog.defaultOptions, options);

            if(!wrapper) {
                this._showOverlay(options);
                this._open(options);
            } else {
                dijalog.hide();
                once(wrapper, 'dijaloghidden', dijalog._open.bind(dijalog, options));
            }
        },

        setupBodyClassName: function() {
            on(document, 'dijalogopen', function() {
                addClass(body, dijalog.baseClassNames.open);
            });

            on(document, 'dijalogclose', function() {
                if (!dijalog.dialogs.length) {
                    removeClass(body, dijalog.baseClassNames.open);
                }
            });
        },

        findParentDialog: function(element) {
            var filter = function(dialog) {
                return dialog.contentElement === element;
            };

            while(element !== body) {
                if(element.classList.contains(dijalog.baseClassNames.content)) {
                    return dijalog.dialogs.filter(filter)[0];
                }

                element = element.parentNode;
            }

            return null;
        },

        openDialog: function(options) {
            var beforeClose = options.beforeClose;
            var afterOpen = options.afterOpen;

            options = assign({}, dijalog.defaultOptions, dijalog.defaultDialogOptions, options);
            options.content = dijalog.buildDialogForm(options);

            options.beforeClose = function(dialog) {
                options.callback(dialog.value);

                if (beforeClose) {
                    beforeClose(dialog);
                }
            };

            if(options.focusFirstInput) {
                options.afterOpen = function(dialog) {
                    var firstInput = dialog.contentElement
                        .querySelector(
                            'button[type="submit"], ' +
                            'button[type="button"], ' +
                            'input[type="submit"], ' +
                            'input[type="button"], ' +
                            'textarea, input[type="date"], ' +
                            'input[type="datetime"], ' +
                            'input[type="datetime-local"], ' +
                            'input[type="email"], ' +
                            'input[type="month"], ' +
                            'input[type="number"], ' +
                            'input[type="password"], ' +
                            'input[type="search"], ' +
                            'input[type="tel"], ' +
                            'input[type="text"], ' +
                            'input[type="time"], ' +
                            'input[type="url"], ' +
                            'input[type="week"]'
                        );

                    if(firstInput) {
                        firstInput.focus();
                    }

                    if (afterOpen) {
                        afterOpen(dialog);
                    }
                };
            }

            dijalog.open(options);
        },

        alert: function(options) {
            if(typeof options === 'string') {
                options = {message: options};
            }

            options = assign({}, dijalog.defaultAlertOptions, options);

            dijalog.openDialog(options);
        },

        confirm: function(options) {
            if(typeof options === 'string') {
                throw new Error('dijalog.confirm(options) requires options.callback.');
            }

            options = assign({}, dijalog.defaultConfirmOptions, options);

            dijalog.openDialog(options);
        },

        prompt: function(options) {
            if(typeof options === 'string') {
                throw new Error('dijalog.prompt(options) requires options.callback.');
            }

            var defaultOptions = {
                message: '<label for="dijalog">' + (options.label || 'Prompt:') + '</label>',
                input: '<input ' +
                'name="dijalog" ' +
                'type="text" ' +
                'class="dijalog-prompt-input" ' +
                'placeholder="' + (options.placeholder || '') + '" ' +
                'value="' + (options.value || '') + '" />'
            };

            options = assign({}, defaultOptions, options);

            dijalog.openDialog(options);
        },

        buildDialogButtons: function(buttons) {
            var container = createElement('div');

            addClass(container, 'dijalog-buttons');

            buttons.forEach(function(options) {
                var button = createElement('button');

                button.setAttribute('type', options.type);
                button.innerHTML = options.text;
                addClass(button, 'dijalog-button');
                addClass(button, options.className);

                if(options.click) {
                    on(button, 'click', function(event) {
                        options.click.call(this, event, dijalog.findParentDialog(this));
                    });
                }

                append(container, button);
            });

            return container;
        },

        buildDialogForm: function(options) {
            var form = createElement('form');
            addClass(form, 'dijalog-form');
            on(form, 'submit', options.onSubmit);

            var message = createElement('div');
            message.innerHTML = options.message;
            addClass(message, 'dijalog-message');
            append(form, message);

            if(options.input) {
                var input = createElement('div');
                addClass(input, 'dijalog-input');
                append(input, options.input);
                append(form, input);
            }

            if(options.buttons !== null) {
                append(form, dijalog.buildDialogButtons(options.buttons));
            }

            return form;
        },

        getFormValueOnSubmit: function(formData) {
            if(formData.dijalog) {
                return formData.dijalog === '_dijalog-empty-value' ? true : formData.dijalog;
            }

            return formData;
        }
    };

    dijalog.helpers = {
        assign: assign,
        on: on,
        once: once,
        trigger: trigger,
        serializeForm: serializeForm,
        css: css,
        addClass: addClass,
        removeClass: removeClass,
        append: append,
        createElement: createElement,
        noop: noop,
        last: last
    };

    dijalog.setupBodyClassName();

    window.addEventListener('keyup', function(event) {
        if (currentDijalog && currentDijalog.escapeButtonCloses && event.keyCode === 27) {
            dijalog.close();
        }
    });

    return dijalog;
}

if(typeof define === 'function' && define.amd) {
    define(dijalogFactory);
} else if(typeof exports === 'object') {
    module.exports = dijalogFactory();
} else {
    window.dijalog = dijalogFactory();
}
