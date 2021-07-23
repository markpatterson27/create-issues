const process = require('process');
const cp = require('child_process');
const path = require('path');
const core = require('@actions/core');
const nock = require('nock');
const action = require('../src/index');

// test outputs triggered
describe("action integration", () => {
    let projectParams;
    let columnParams;
    let issueParams;
    let cardParams;
    let scope;

    beforeEach(() => {
        process.env['INPUT_GITHUB-TOKEN'] = '1234';
        jest.spyOn(core, "setOutput").mockImplementation();
        jest.spyOn(core, "setFailed").mockImplementation();
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});

        let i = 0;
        // chain to single scope
        scope = nock('https://api.github.com')
          .persist()
          // mock create project POST
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
        // nock('https://api.github.com')
          .post(/\/projects\/.*\/columns/)
          .reply(201, (uri, body) => {
            columnParams = body;
            let response = {
                name: body.name,
                id: Math.floor(Math.random() * 10000),
                url: 'www'
            }
            return response;
          })
        // mock create issue POST
        // nock('https://api.github.com')
          .post(/\/repos\/.*\/.*\/issues/)
          .reply(201, (uri, body) => {
            issueParams = body;
            let response = {
                title: body.title,
                body: body.body,
                id:  Math.floor(Math.random() * 10000),
                number: i++,
                html_url: 'www',
                labels: [],
                assignees: [],
                milestone: {}
            }
            return response;
          })
        // mock create card POST
        // nock('https://api.github.com')
          .post(/\/projects\/columns\/.*\/cards/)
          .reply(201, (uri, body) => {
            cardParams = body;
            let response = {
                id: Math.floor(Math.random() * 10000),
                url: 'www'
            }
            return response;
          });

    });

    afterEach(() => {
        nock.cleanAll();
        jest.restoreAllMocks();
    });

    // test no token throws setFailed
    test('no token throws error', () => {
        process.env['INPUT_GITHUB-TOKEN'] = '';
        action.run();
        expect(core.setFailed).toHaveBeenCalled();
        expect(core.setFailed).toBeCalledWith('Input required and not supplied: github-token');
    });

    // test non-existant dir throws setFailed
    test('non-existant dir throws error', () => {
        process.env['INPUT_ISSUES-DIRECTORY'] = 'unknown';
        action.run();
        expect(core.setFailed).toHaveBeenCalled();
        expect(core.setFailed).toBeCalledWith(expect.stringMatching(/Issues directory 'unknown' not found.\.*/));
    });

    // test empty dir throws setFailed
    test('empty dir throws error', () => {
        process.env['INPUT_ISSUES-DIRECTORY'] = 'examples';
        action.run();
        expect(core.setFailed).toHaveBeenCalled();
        expect(core.setFailed).toBeCalledWith(expect.stringMatching(/No files found in directory\.*/));
    });

    // test project create and issue create called
    test('create kanban project and issues', async () => {
        process.env['INPUT_PROJECT-FILE'] = 'examples/kanban-project/project.md';
        process.env['INPUT_ISSUES-DIRECTORY'] = 'examples/kanban-project/ISSUES';
        await action.run();
        expect(scope.interceptors[0].interceptionCounter).toBe(1);
        expect(scope.interceptors[1].interceptionCounter).toBe(3);
        expect(scope.interceptors[2].interceptionCounter).toBe(3);
        expect(scope.interceptors[3].interceptionCounter).toBe(3);
    });
});

// #TODO nock API calls
// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_GITHUB-TOKEN'] = '1234';
    // process.env['INPUT_PROJECT-FILE'] = 'examples/kanban-project/project.md';
    // process.env['INPUT_PROJECT-NAME'] = '';
    // process.env['INPUT_PROJECT-DESCRIPTION'] = '';
    // process.env['INPUT_COLUMN-NAMES'] = '';
    process.env['INPUT_ISSUES-DIRECTORY'] = 'tests/test-files';
    process.env.GITHUB_WORKSPACE = path.join(__dirname, '..');
    const ip = 'src/index.js';
    // const ip = path.join(__dirname, '..', 'src', 'index.js');
    console.log(cp.exec(`node ${ip}`, {env: process.env}).toString());
})