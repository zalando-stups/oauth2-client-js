function assertPresent(obj, ...fields) {
    if (obj === undefined) {
        throw new Error();  //TODO message
    }
    let undef = fields.filter( f => obj[f] === undefined );
    if (undef.length) {
        throw new Error(`${undef[0]} is not present on {obj}.`);
    }
}

function stripKeys(obj, ...keys) {
    var stripped = {};
    Object.keys(obj)
    .forEach(key => {
        if (keys.indexOf(key) < 0) {
            stripped[key] = obj[key];
        }
    });
    return stripped;
}

export {
    assertPresent as assertPresent,
    stripKeys as stripKeys
};