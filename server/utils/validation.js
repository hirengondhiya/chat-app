const isRealString = function isRealStringMethod(value) {
    return typeof value === 'string' && value.trim().length > 0;
};

module.exports = {
    isRealString
};
