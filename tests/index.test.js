const process = require('process');
const cp = require('child_process');
const path = require('path');

// #TODO nock API calls
// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_GITHUB-TOKEN'] = '1234';
    // process.env['INPUT_PROJECT-FILE'] = 'examples/kanban-project/project.md';
    // process.env['INPUT_PROJECT-NAME'] = '';
    // process.env['INPUT_PROJECT-DESCRIPTION'] = '';
    // process.env['INPUT_COLUMN-NAMES'] = '';
    process.env.GITHUB_WORKSPACE = path.join(__dirname, '..');
    const ip = 'src/index.js';
    // const ip = path.join(__dirname, '..', 'src', 'index.js');
    console.log(cp.execSync(`node ${ip}`, {env: process.env}).toString());
})