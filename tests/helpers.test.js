const { listToArray } = require("../src/helpers");


// test listToArray
describe("listToArray function", () => {

    // test returns empty array if given blank string
    test('returns empty array', () => {
        const input = '';
        expect(listToArray(input)).toEqual([]);
    });

    // test returns array if given array
    test('returns given array', () => {
        const input = ['one', 'two', 'three'];
        expect(listToArray(input)).toEqual(input);
    });

    // test returns array if given single string
    test('returns given array', () => {
        const input = 'one';
        expect(listToArray(input)).toEqual([input]);
    });

    // test returns array if given comma seperated string
    test('returns array from comma seperated', () => {
        const input = 'one, two, three';
        expect(listToArray(input)).toEqual(['one', 'two', 'three']);
    });
});
