function dijalogFactory() {
    var dijalog = {
        globalId: 1,

        dialogs: [],

        animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend',

        baseClassNames: {
            vex: 'dijalog',
            content: 'dijalog-content',
            overlay: 'dijalog-overlay',
            close: 'dijalog-close',
            closing: 'dijalog-closing',
            open: 'dijalog-open'
        },

        defaultOptions: {
            content: '',
            showCloseButton: true,
            escapeButtonCloses: true,
            overlayClosesOnClick: true,
            appendLocation: document.body,
            className: '',
            css: {},
            overlayClassName: '',
            overlayCSS: {},
            contentClassName: '',
            contentCSS: {},
            closeClassName: '',
            closeCSS: {}
        },

        close: function () {
            //TODO
        },

        closeAll: function () {
            //TODO
        },

        closeByEscape: function () {
            //TODO
        },

        closeById: function () {
            //TODO
        },

        hideLoading: function () {
            //TODO
        },

        showLoading: function () {
            //TODO
        },

        open: function (options) {
            var wrapper;
            var overlay;
            var content;
            var closeButton;

            options = assign({}, dijalog.defaultOptions, options);
            options.id = dijalog.globalId++;

            wrapper = createElement('div');
            addClass(wrapper, vex.baseClassNames.vex);
            addClass(wrapper, options.className);
            css(wrapper, options.css);

            overlay = createElement('div');
            addClass(overlay, vex.baseClassNames.overlay);
            addClass(overlay, options.overlayClassName);
            css(overlay, options.overlayCSS);

            if (options.overlayClosesOnClick) {
                on(overlay, 'click', function (event) {
                    if (event.target === overlay) {
                        dijalog.close(options.id);
                    }
                });
            }

            append(wrapper, overlay);

            content = createElement('div');
            addClass(content, dijalog.baseClassNames.content);
            addClass(content, options.contentClassName);
            css(content, options.contentCSS);
            append(content, options.content);

            append(wrapper, content);

            if (options.showCloseButton) {
                closeButton = createElement('div');
                addClass(closeButton, dijalog.baseClassNames.close);
                addClass(closeButton, options.closeClassName);
                css(closeButton, options.closeCSS);

                on(closeButton, 'click', function () {
                    dijalog.close(options.id);
                });

                append(content, closeButton);
            }

            append(options.appendLocation, wrapper);

            if (options.afterOpen) {
                options.afterOpen(content, options);
            }

            setTimeout(function () {
                trigger(content, dijalogopen, options);
            }, 0);

            return content;
        },

        setupBodyClassName: function () {
            on(document, 'dijalogopen', function () {
                document.body.classList.add(dijalog.baseClassNames.open);
            });

            on(document, 'dijalogclose', function () {
                if (!dijalog.dialogs.length) {
                    document.body.classList.remove(dijalog.baseClassNames.open);
                }
            });
        }
    };

    dijalog.setupBodyClassName();

    window.addEventListener('keyup', function (event) {
        if (event.keyCode === 27) {
            dijalog.closeByEscape();
        }
    });
}

if(typeof define === 'function' && define.amd) {
    define(dijalogFactory);
} else if(typeof exports === 'object') {
    module.exports = dijalogFactory();
} else {
    window.dijalog = dijalogFactory();
}
