const core = require('@actions/core');
const github = require('@actions/github');
const { createProject } = require('./createissues');
const { projectDetails, issuesDetails } = require('./parsedetails');

// most @actions toolkit packages have async methods
async function run() {
    try {
        // action inputs
        const token = core.getInput('github-token', {required: true});
        const projectFile = core.getInput('project-file');
        const projectName = core.getInput('project-name');
        const projectDescription = core.getInput('project-description');
        const columnNames = core.getInput('column-names');
        const issuesDir = core.getInput('issues-directory');

        // auth octokit
        const octokit = new github.getOctokit(token);

        // templates
        const templateVariables = {
            ...github.context
        };

        // project details
        const project = projectDetails(projectFile, projectName, projectDescription, columnNames, templateVariables);
        // console.log(project);   //debug

        let columnIDs = [];
        if (project.projectName) {
            // create project
            columnIDs = await createProject(octokit, project);
        }
        // console.log(columnIDs);   //debug

        // send issueDir, columnIDs, project, templateVars. return array of issues
        const issues = issuesDetails(issuesDir, project, columnIDs, templateVariables);

        // for each issue
        //   create issue - send octokit, issue. return ?
        //   if project: add to column
        

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
