var assign = Object.assign ? Object.assign : function(target) {
    'use strict';

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);

    for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];

        if (nextSource === undefined || nextSource === null) {
            continue;
        }

        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

            if (desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
            }
        }
    }

    return to;
};

var createElement = document.createElement;

function css(elem, styles) {
    Object.keys(styles).forEach(function(key) {
        elem.style[key] = styles[key];
    });
}

function addClass(elem, classes) {
    classes = classes.trim();

    if(classes.length) {
        elem.classList.add.apply(
            elem.classList,
            classes.split(/\s+/)
        );
    }
}

function append(elem, content) {
    var fragment;

    if(content.trim) {
        fragment = document.createDocumentFragment();
        fragment.textContent = content;
    } else {
        fragment = content;
    }

    elem.appendChild(fragment);
}

function serializeForm(form) {
    var isSubmittable = /^(?:input|select|textarea|keygen)/i;
    var isSubmitter = /^(?:submit|button|image|reset|file)/i;
    var isCheckable = /^(?:checkbox|radio)/i;
    var isCheckbox = /^checkbox/i;
    var brackets = /\[\]/;
    var newLine = /\r?\n/g;

    return form.elements
        .filter(function(elem) {
            return (
                elem.name &&
                !elem.disabled &&
                isSubmittable.test(elem.nodeName) &&
                !isSubmitter.test(elem.type) &&
                (!isCheckable.test(elem.type) || elem.checked)
            );
        })
        .map(function(elem) {
            return {
                name: elem.name,
                value: elem.value.replace(newLine, '\r\n'),
                isCheckbox: isCheckbox.test(elem.type)
            };
        })
        .reduce(function(formValues, elem) {
            var name = elem.name.replace(brackets, '');

            if(!formValues[name] && elem.isCheckbox) {
                formValues[name] = [];
            }

            if(elem.isCheckbox) {
                formValues[name].push(elem.value);
            } else {
                formValues[name] = elem.value;
            }

            return formValues;
        }, {})
}

function on(elem, event, callback) {
    elem.addEventListener(event, callback);
}

function off(elem, event, callback) {
    elem.removeEventListener(event, callback);
}

function trigger(elem, event, data) {
    event = new CustomEvent(event, {
        bubbles: true,
        cancelable: false,
        detail: data
    });

    elem.dispatchEvent(event);
}
