// https://github.com/sindresorhus/is-regexp
function isRegex(re) {
    return Object.prototype.toString.call(re) === '[object RegExp]';
}

function isString(s) {
    return typeof s === 'string';
}

function identity(i) {
    return i;
}

function assertPresent(obj, fields) {
    if (obj === undefined) {
        throw new Error();  //TODO message
    }
    fields = fields || [];
    let undef = fields.filter(f => obj[f] === undefined);
    if (undef.length) {
        throw new Error(`${undef[0]} is not present on {obj}.`);
    }
}

function includes(substring) {
    return this.indexOf(substring) !== -1;
}

function startsWith(substring) {
    return this.indexOf(substring) === 0;
}

function encodeBase64(string) {
    if (window && window.btoa) {
        return window.btoa(string);
    } else if (Buffer) {
        return new Buffer(string).toString('base64');
    } else {
        throw new Error('Unsupported platform, can’t even Base64.');
    }
}

function decodeBase64(string) {
    if (window && window.atob) {
        return window.atob(string);
    } else if (Buffer) {
        return new Buffer(string, 'base64').toString('ascii');
    } else {
        throw new Error('Unsupported platform, can’t even Base64.');
    }
}

// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
function endsWith(searchString, position) {
    var subjectString = this.toString();
    if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
}

function stripKeys(obj, keys) {
    var stripped = {};
    keys = keys || [];

    Object
    .keys(obj)
    .forEach(key => {
        let excludeKey = keys
                            .map(exclude => {
                                if (isString(exclude)) {
                                    return key !== exclude;
                                }
                                if (isRegex(exclude)) {
                                    return !exclude.test(key);
                                }
                            })
                            .some(identity);
        if (!excludeKey) {
            stripped[key] = obj[key];
        }
    });
    return stripped;
}

export {
    assertPresent as assertPresent,
    stripKeys as stripKeys,
    endsWith as endsWith,
    startsWith as startsWith,
    includes as includes
};