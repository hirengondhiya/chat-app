const expect = require('expect');
const { isRealString } = require('./../utils/validation.js');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        const res = isRealString(13);
        expect(res).toBe(false);
    });

    it('should reject string with only spaces', () => {
        const res = isRealString('    ');
        expect(res).toBe(false);
    });

    it('should string with non-space values', () => {
        const res = isRealString('some string');
        expect(res).toBe(true);
    });
});
