const github = require('@actions/github');
const nock = require('nock');
const { createProject } = require('../src/createissues');

const token = '1234';
const octokit = new github.getOctokit(token);

// test createProject
describe("createProject function", () => {
    let projectParams;
    let columnParams;
    beforeEach(() => {
        // mock create project POST
        nock('https://api.github.com')
          .post(/\/repos\/.*\/.*\/projects/)
          .reply(201, (uri, body) => {
            projectParams = body;
            let response = {
                name: body.name,
                body: body.body,
                id:  Math.floor(Math.random() * 10000),
                number: 1,
                html_url: 'www'
            }
            return response;
          })
        // mock create columns POST
        nock('https://api.github.com')
          .post(/\/projects\/.*\/columns/)
          .times(4)
          .reply(201, (uri, body) => {
            columnParams = body;
            let response = {
                name: body.name,
                id: Math.floor(Math.random() * 10000),
                url: 'www'
            }
            return response;
          })
        
        jest.spyOn(octokit.rest.projects, 'createForRepo');
        jest.spyOn(octokit.rest.projects, 'createColumn');
    });
    afterEach(() => {
        nock.cleanAll();
        jest.clearAllMocks();
    });

    // test calls createForRepo and createColumn for single column input
    test("creates new project with single column", async () => {
        const project = {
            projectName: 'Project Name',
            projectDescription: 'Project description',
            columnNames: ['single']
        }
        const columnIDs = await createProject(octokit, project);
        expect(octokit.rest.projects.createForRepo).toHaveBeenCalledTimes(1);
        expect(octokit.rest.projects.createColumn).toHaveBeenCalledTimes(1);
        expect(projectParams).toEqual({ name: 'Project Name', body: 'Project description' });
        expect(columnParams).toEqual({ name: 'single' });
        expect(columnIDs.length).toBe(1);
    });

    // test calls createForRepo and createColumn 3 times for 3 columns input
    test("creates new project with three columns", async () => {
        const project = {
            projectName: 'Project Name',
            projectDescription: 'Project description',
            columnNames: ['one', 'two', 'three']
        }
        const columnIDs = await createProject(octokit, project);
        expect(octokit.rest.projects.createForRepo).toHaveBeenCalledTimes(1);
        expect(octokit.rest.projects.createColumn).toHaveBeenCalledTimes(3);
        expect(projectParams).toEqual({ name: 'Project Name', body: 'Project description' });
        expect(columnParams).toEqual({ name: 'three' });
        expect(columnIDs.length).toBe(3);
    });
});