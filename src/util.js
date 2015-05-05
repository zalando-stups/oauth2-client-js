function assertPresent(obj, fields) {
    if (obj === undefined) {
        throw new Error();  //TODO message
    }
    fields = fields || [];
    let undef = fields.filter( f => obj[f] === undefined );
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
        if (keys.indexOf(key) < 0) {
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