var assign = Object.assign ? Object.assign : function(target) {
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

var createElement = document.createElement.bind(document);

function css(elem, styles) {
    Object.keys(styles).forEach(function(key) {
        elem.style[key] = styles[key];
    });
}

function updateClass(elem, classes, operation) {
    classes = classes.trim();

    if(classes.length) {
        elem.classList[operation].apply(
            elem.classList,
            classes.split(/\s+/)
        );
    }
}

function addClass(elem, classes) {
    updateClass(elem, classes, 'add');
}

function removeClass(elem, classes) {
    updateClass(elem, classes, 'remove');
}

function append(elem, content) {
    var wrapper;

    if(content.trim) {
        wrapper = createElement('div');
        wrapper.innerHTML = content;

        for(var i = 0, n = wrapper.childNodes.length; i < n; i++) {
            elem.appendChild(wrapper.childNodes[i]);
        }
    } else {
        elem.appendChild(content);
    }
}

function serializeForm(form) {
    var isSubmittable = /^(?:input|select|textarea|keygen)/i;
    var isSubmitter = /^(?:submit|button|image|reset|file)/i;
    var isCheckable = /^(?:checkbox|radio)/i;
    var brackets = /\[\]/;
    var newLine = /\r?\n/g;

    return Array.prototype.slice.apply(form.elements)
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
                name: elem.name.replace(brackets, ''),
                value: elem.value.replace(newLine, '\r\n'),
                isArray: brackets.test(elem.name)
            };
        })
        .reduce(function(formValues, elem) {
            if(!formValues[elem.name] && elem.isArray) {
                formValues[elem.name] = [];
            }

            if(elem.isArray) {
                formValues[elem.name].push(elem.value);
            } else {
                formValues[elem.name] = elem.value;
            }

            return formValues;
        }, {});
}

function on(elem, events, callback) {
    events.split(' ').forEach(function(event) {
        elem.addEventListener(event, callback);
    });
}

function once(elem, events, callback) {
    events = events.split(' ');

    var func = function() {
        events.forEach(function(event) {
            elem.removeEventListener(event, func);
        });

        callback();
    };

    events.forEach(function(event) {
        elem.addEventListener(event, func);
    });
}

function trigger(elem, event, data) {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(event, true, false, data);

    elem.dispatchEvent(event);
}

function last(arr) {
    return arr[arr.length - 1];
}

function noop() { }
