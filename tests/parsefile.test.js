const { test, expect, beforeEach } = require('@jest/globals');
const { readTextFile, parseTemplate, parseMatter, listFiles } = require('../src/parsefile');

const testContent = {
    noFM: "This is some text without front matter content.",
    basicFM: `---
title: Front Matter Test
type: basic attributes and body match
---
This is some text that includes front matter content.`,
    specialChars: `---
t!tle: Front Matter Test
type: special characters match 'n stuff
🌎 ground control: lift-off 🚀
---
This is some text that includes '$pecial characters'.

And multiple lines.`,
    projectColumnString: `---
title: 'Launch :rocket:'
columns: 'To do, In progress, Done'
---
Tasks to complete before initial release.
`,
    projectColumnList: `---
title: 'Launch :rocket:'
columns:
  - To do
  - In progress
  - Done
---
Tasks to complete before initial release.`,
    issue: `---
title: Issue
assignees: {{ actor }}
labels:
  - bug
  - help wanted
milestone: 1
---
This needs to be fixed.
`,
    templateChars: `---
title: Templating Test
assignees: {{ actor }}
---
The {{ action }} action is just tesing.
`
};
const testTemplates = {
    basic: {
        action: 'test',
        actor: 'jest tests'
    }
};

// test readFile
describe("readFile function", () => {
    beforeEach(() => {
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    // test throws error if input not string
    test('throws not string', () => {
        const input = 5;
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {readTextFile(input);}).toThrow(TypeError);
        expect(() => {readTextFile(input);}).toThrow("File path not a string");
    });

    // test throws file not found error
    test('gives file not found warning', () => {
        const input = 'unknown.md';
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        // expect(readTextFile(input)).rejects.toThrow('ENOENT');
        // expect(() => {readTextFile(input);}).toThrow('ENOENT');
        readTextFile(input);
        expect(console.warn).toHaveBeenCalled();
    });

    // test throws error if not text file
    // #TODO

    // test reads file correctly
    test('reads file contents', () => {
        const filePath = 'examples/kanban-project/project.md';
        const expected = testContent.projectColumnList;
        expect(readTextFile(filePath)).toEqual(expected);
    });
});

// test listFiles
describe("listFiles function", () => {
    beforeEach(() => {
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    // test throws error if input not string
    test('throws not string', () => {
        const input = 5;
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {listFiles(input);}).toThrow(TypeError);
        expect(() => {listFiles(input);}).toThrow("File path not a string");
    });

    // test throws directory not found error
    test('throws dir not found error', () => {
        const input = 'unknown';
        expect(() => {listFiles(input);}).toThrow('ENOENT');
    });

    // test sends directory empty message
    test('warns dir empty', () => {
        const dirPath = 'examples';
        jest.spyOn(console, 'error').mockImplementation(() => {});
        // jest.spyOn(console, 'warn').mockImplementation(() => {});
        // expect(listFiles(dirPath)).toEqual([]);
        // expect(console.warn).toHaveBeenCalled();
        expect(() => {listFiles(dirPath);}).toThrow('Directory empty');
        expect(console.error).toHaveBeenCalled();
    });

    // reads directory content - returns only files
    test('reads file contents', () => {
        const dirPath = 'examples/kanban-project';
        const expected = ['project.md'];
        expect(listFiles(dirPath)).toEqual(expected);
    });
});

// test parseTemplate
describe("parseTemplate function", () => {
    beforeEach(() => {
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    // test throws error if input not string
    test('throws not string', () => {
        const content = 5;
        const templates = {};
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {parseTemplate(content, templates);}).toThrow(TypeError);
        expect(() => {parseTemplate(content, templates);}).toThrow("Content not a string");
    });

    // test throws error if templates not object
    test('throws not object', () => {
        const content = 'string';
        const templates = 'string';
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {parseTemplate(content, templates);}).toThrow(TypeError);
        expect(() => {parseTemplate(content, templates);}).toThrow("Templates not an object");
    });

    // test empty string
    test('returns empty string', () => {
        const content = '';
        const templates = testTemplates.basic;

        const expected = '';

        expect(parseTemplate(content, templates)).toEqual(expected);
    });

    // test populated string, empty templates
    test('returns detemplated string', () => {
        const content = testContent.templateChars;
        const templates = {};

        const expected = `---
title: Templating Test
assignees: 
---
The  action is just tesing.
`;

        expect(parseTemplate(content, templates)).toEqual(expected);
    });

    // test populated string, populated templates
    test('returns parsed string', () => {
        const content = testContent.templateChars;
        const templates = testTemplates.basic;

        const expected = `---
title: Templating Test
assignees: jest tests
---
The test action is just tesing.
`;

        expect(parseTemplate(content, templates)).toEqual(expected);
    });
});

// test parseMatter
describe("parseMatter function", () => {
    beforeEach(() => {
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    // test throws error if input not string
    test('throws not string', () => {
        const input = 5;
        // expect(parseMatter(5)).toThrow('content not a string');
        expect(() => {parseMatter(input);}).toThrow(TypeError);
        expect(() => {parseMatter(input);}).toThrow("Content not a string");
    });

    // test no input
    // #TODO
    
    // test empty string
    test("returns empty parsed attributes and body", () => {
        const input = "";

        const expected = {
            attributes: {},
            body: ''
        };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test no front matter in string
    test("returns body with empty parsed attributes", () => {
        const input = testContent.noFM;

        const expected = {
            attributes: {},
            body: 'This is some text without front matter content.'
        };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test populated string
    test("returns parsed attributes and body", () => {
        const input = testContent.basicFM;

        const expected = {
            attributes: {
                title: 'Front Matter Test',
                type: 'basic attributes and body match'
            },
            body: 'This is some text that includes front matter content.'
        };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test special characters string
    test("returns special characters in attributes and body", () => {
        const input = testContent.specialChars;

        // unslugged
        const expected = {
            attributes: {
                't!tle': 'Front Matter Test',
                type: 'special characters match \'n stuff',
                '🌎 ground control': 'lift-off 🚀'
            },
            body: 'This is some text that includes \'$pecial characters\'.\n\nAnd multiple lines.'
        };

        // // slugged
        // const expected = {
        //     attributes: {
        //         'ttle': 'Front Matter Test',
        //         type: 'special characters match \'n stuff',
        //         'ground-control': 'lift-off 🚀'
        //     },
        //     body: 'This is some text that includes \'$pecial characters\'.\n\nAnd multiple lines.'
        // };

        expect(parseMatter(input)).toEqual(expected);
    });

    // test list attribute
    test("returns list attribute", () => {
        const input = testContent.projectColumnList;

        const expected = {
            attributes: {
                'title': 'Launch :rocket:',
                columns: ['To do', 'In progress', 'Done']
            },
            body: 'Tasks to complete before initial release.'
        };

        expect(parseMatter(input)).toEqual(expected);
    });
});
