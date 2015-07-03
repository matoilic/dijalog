function dijalogFactory() {
    var wrapper;
    var noop = function() { };

    var dijalog = {
        globalId: 1,

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
            appendLocation: document.body,
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

        _close: function(dialog) {
            var content = dialog.contentElement;

            trigger(content, 'dijalogclose', dialog);
            content.parentNode.removeChild(content);

            if(!dijalog.dialogs.length) {
                wrapper.parentNode.removeChild(wrapper);
                wrapper = null;
            } else {
                removeClass(wrapper, dijalog.baseClassNames.hiding);
                dijalog.show();
            }

            trigger(document.body, 'dijalogafterclose');
            dialog.afterClose();
        },

        close: function(id) {
            if(!dijalog.dialogs.length) return false;

            var dialog = dijalog.get(id, true);

            if(dialog.beforeClose() !== false) {
                once(wrapper, dijalog.animationEndEvent, dijalog._close.bind(this, dialog));

                if(dijalog.dialogs.length) {
                    addClass(wrapper, dijalog.baseClassNames.hiding);
                } else {
                    addClass(wrapper, dijalog.baseClassNames.closing);
                }

                removeClass(dialog.contentElement, dijalog.baseClassNames.visible);
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

            once(wrapper, dijalog.animationEndEvent, dijalog._hide.bind(this, dialog));
            addClass(wrapper, dijalog.baseClassNames.hiding);
            removeClass(dialog.contentElement, dijalog.baseClassNames.visible);
        },

        hideLoading: function() {
            //TODO
        },

        show: function(id) {
            if(!dijalog.dialogs.length) return false;

            var dialog = dijalog.get(id);
            removeClass(dialog.contentElement, dijalog.baseClassNames.hidden);
            addClass(dialog.contentElement, dijalog.baseClassNames.visible);
        },

        showLoading: function() {
            //TODO
        },

        _open: function(options) {
            var overlay;
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

            if(!dijalog.dialogs.length) {
                append(options.appendLocation, wrapper);
            }

            if (options.afterOpen) {
                options.afterOpen(content, options);
            }

            setTimeout(function() {
                trigger(content, 'dijalogopen', options);
            }, 0);

            options.contentElement = content;
            dijalog.dialogs.push(options);
        },
        
        open: function(options) {
            options = assign({}, dijalog.defaultOptions, options);
            options.id = dijalog.globalId++;

            if(!wrapper) {
                wrapper = createElement('div');
                addClass(wrapper, dijalog.baseClassNames.dijalog);
                addClass(wrapper, options.className);
                css(wrapper, options.css);

                overlay = createElement('div');
                addClass(overlay, dijalog.baseClassNames.overlay);
                addClass(overlay, options.overlayClassName);
                css(overlay, options.overlayCSS);

                if (options.overlayClosesOnClick) {
                    on(overlay, 'click', function(event) {
                        if (event.target === overlay) {
                            dijalog.close(options.id);
                        }
                    });
                }

                append(wrapper, overlay);

                this._open(options)
            } else {
                dijalog.hide();
                once(wrapper, 'dijaloghidden', dijalog._open.bind(dijalog, options))
            }
        },

        setupBodyClassName: function() {
            on(document, 'dijalogopen', function() {
                document.body.classList.add(dijalog.baseClassNames.open);
            });

            on(document, 'dijalogclose', function() {
                if (!dijalog.dialogs.length) {
                    document.body.classList.remove(dijalog.baseClassNames.open);
                }
            });
        }
    };

    dijalog.setupBodyClassName();

    window.addEventListener('keyup', function(event) {
        if (event.keyCode === 27) {
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
