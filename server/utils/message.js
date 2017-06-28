const generateMessage = function generateMessageMethod(from, text) {
    return { from, text, createdAt: new Date().getTime() };
};

module.exports = {
    generateMessage
};
