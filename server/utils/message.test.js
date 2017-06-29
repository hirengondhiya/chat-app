const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./../utils/message');

describe('generateMessage', () => {
    it('should generate message', () => {
        const text = 'Somee message';
        const from = 'someone';

        const message = generateMessage(from, text);

        expect(message).toInclude({ text, from });
        expect(message.createdAt).toBeA('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate location message', () => {
        const from = 'someone';
        const longitude = 1;
        const latitude = 2;
        const url = `https://www.google.com/maps/?q=${latitude},${longitude}`;

        const message = generateLocationMessage(from, latitude, longitude);

        expect(message).toInclude({ from, url });
        expect(message.createdAt).toBeA('number');
    });
});
