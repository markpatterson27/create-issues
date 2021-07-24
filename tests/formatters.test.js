const { projectDetails, findColumnID, issueDetails, issuesDetails, listToArray } = require("../src/formatters");

const testTemplates = {
    basic: {
        action: 'test',
        actor: 'jest tests'
    }
};
const defaultColumns = 'To Do';

// test projectDetails
describe("projectDetails function", () => {
    // test empty inputs returns falsey projectName
    test("empty inputs returns falsey projectName", () => {
        const project = projectDetails('', '', '', '', testTemplates);
        expect(project.projectName).toBeFalsy();
        expect(project.projectDescription).toBeFalsy();
        expect(project.columnNames).toEqual([defaultColumns]);
    });

    // test given project name returns same project name
    // test given project description returns same project description
    // test given project columns returns same project columns
    //   - single
    //   - comma list
    //   - array
    const testColumns = [
        ['single', ['single']],
        ['one, two, three', ['one', 'two', 'three']],
        [['one', 'two', 'three'], ['one', 'two', 'three']]
    ];
    test.each(testColumns)("given inputs return same outputs", (columnInput, columnOutput) => {
        const columns = columnInput;
        const project = projectDetails('', 'Project Name', 'Project description', columns, testTemplates);

        expect(project.projectName).toEqual('Project Name');
        expect(project.projectDescription).toEqual('Project description');
        expect(project.columnNames).toEqual(columnOutput);

    });

    // test given file returns file details
    test("given file returns file project details", () => {
        const project = projectDetails('examples/kanban-project/project.md', '', '', '', testTemplates);
        expect(project.projectName).toEqual('Launch :rocket:');
        expect(project.projectDescription).toEqual('Tasks to complete before initial release.');
        expect(project.columnNames).toEqual(['To do', 'In progress', 'Done']);
    });

    // test given project name overrides file project name
    // test given project description overrides file project description
    // test given project columns overrides file project columns
    test("given inputs override file project details", () => {
        const projectName = 'Project Name';
        const projectDescription = 'Project description';
        const columns = ['single'];
        const project = projectDetails('examples/kanban-project/project.md', projectName, projectDescription, columns, testTemplates);
        expect(project.projectName).toEqual(projectName);
        expect(project.projectDescription).toEqual(projectDescription);
        expect(project.columnNames).toEqual(columns);
    });
});

// test issuesDetails
describe("issuesDetails function", () => {
    const project = {
        projectName: 'Project Name',
        projectDescription: 'Project description',
        columnNames: ['To do', 'In progress', 'Done']
    }
    const columnIDs = [1234, 2345, 3456];
    const templateVariables = {
        ...testTemplates.basic
    };

    beforeEach(() => {
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    // test empty file not added to return array
    test("empty files not in return array", () => {
        const issuesDir = 'tests/test-files';

        const issues = issuesDetails(issuesDir, project, columnIDs, templateVariables);
        expect(issues.length).toEqual(2);
    })
});

// test issueDetails
describe("issueDetails function", () => {
    const project = {
        projectName: 'Project Name',
        projectDescription: 'Project description',
        columnNames: ['To do', 'In progress', 'Done']
    }
    const columnIDs = [1234, 2345, 3456];
    const templateVariables = {
        ...testTemplates.basic
    };

    beforeEach(() => {
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    // test no FM uses filename for title, other attributes nullable
    test("no FM in file uses filename for title", () => {
        const file = 'tests/test-files/noFM.md';

        const nonProjectAttributes = (issue) => {
            expect(issue.title).toEqual('noFM');
            expect(issue.body).toEqual('This file has no front matter content.');
            expect(issue.labels).toEqual([]);
            expect(issue.assignees).toEqual([]);
            expect(issue.milestone).toEqual(undefined);
        }

        // with project, returns columnID
        const issue = issueDetails(file, project, columnIDs, templateVariables);
        nonProjectAttributes(issue);
        expect(issue.columnID).toEqual(1234);

        // without project, does not return columnID
        const noProject = {};
        const issueNoProject = issueDetails(file, noProject, columnIDs, templateVariables);
        nonProjectAttributes(issueNoProject);
        expect(issueNoProject.columnID).toEqual(undefined);
    });

    // test empty file returns undefined?
    test("empty file returns undefined", () => {
        const file = 'tests/test-files/blank.md';

        const issue = issueDetails(file, project, columnIDs, templateVariables);
        expect(issue).toBe(undefined);
    });

    // test with FM returns attributes
    test("FM in file returns attributes", () => {
        const file = 'tests/test-files/issue.md';

        const nonProjectAttributes = (issue) => {
            expect(issue.title).toEqual('Issue Title');
            expect(issue.body).toEqual('Body content for issue.');
            expect(issue.labels).toEqual(['bug']);
            expect(issue.assignees).toEqual(['jest tests']);
            expect(issue.milestone).toEqual(1);
        }

        // with project, returns columnID
        const issue = issueDetails(file, project, columnIDs, templateVariables);
        nonProjectAttributes(issue);
        expect(issue.columnID).toEqual(3456);

        // without project, does not return columnID
        const noProject = {};
        const issueNoProject = issueDetails(file, noProject, columnIDs, templateVariables);
        nonProjectAttributes(issueNoProject);
        expect(issueNoProject.columnID).toEqual(undefined);
    });

    // #TODO test non int-able milestone returns undefined
});

// test findColumnID
describe("findColumnID function", () => {
    const project = {
        columnNames: ['To do', 'In progress', 'Done']
    };
    const columnIDs = [1234, 2345, 3456];
    let parsedFM = {attributes: {}};

    // test column index out of range returns columnIDs index 0 value
    // test column string index returns columnIDs value
    const integerTests = [
        [1, 1234],
        [2, 2345],
        [3, 3456],
        [4, 1234],
        [5, 1234],
        ['1', 1234],
        ['2', 2345],
        ['3', 3456],
        ['4', 1234],
        ['5', 1234],
        [1.1, 1234],
        [2.2, 1234],
        ['two', 1234],
        [-1, 1234],
        [null, 1234]
    ];
    test.each(integerTests)(
        "index %p returns %p", (input, expected) => {
            parsedFM.attributes['column'] = input;
            expect(findColumnID(parsedFM, project, columnIDs)).toEqual(expected);

    });

    // test column name returns columnIDs value
    // test no column returns columnIDs index 0 value
    const stringTests = [
        ['To do', 1234],
        ['In progress', 2345],
        ['Done', 3456],
        ['unknown', 1234],
        ['', 1234],
        ['one', 1234],
        ['two', 1234],
        [undefined, 1234]
    ];
    test.each(stringTests)(
        "name %p returns %p", (input, expected) => {
            parsedFM.attributes['column'] = input;
            expect(findColumnID(parsedFM, project, columnIDs)).toEqual(expected);

    });
});

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
