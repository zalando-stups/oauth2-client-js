function assertPresent(obj, ...fields) {
    if (obj === undefined) {
        throw new Error();  //TODO message
    }
    let undef = fields.filter( f => obj[f] === undefined );
    if (undef.length) {
        throw new Error(`${undef[0]} is not present on {obj}.`);
    }
}

// function stripKeys(obj, ...keys) {
    
// }

export {
    assertPresent as assertPresent
};