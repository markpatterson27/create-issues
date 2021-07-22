const { projectDetails } = require("../src/parsedetails");

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