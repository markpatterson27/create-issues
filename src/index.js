const core = require('@actions/core');

// most @actions toolkit packages have async methods
async function run() {
    try {
        // action inputs
        const token = core.getInput('github-token', {required: true});
        const projectFile = core.getInput('project-file');
        const projectName = core.getInput('project-name');
        const projectDescription = core.getInput('project-description');

        // auth octokit

        // if project-file or project-name
        //   process file or inputs
        //   create project
        //   create columns - return column IDs

        // read issues dir
        // for each file
        //   process file
        //   create issue
        //   if project: add to column
        

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
