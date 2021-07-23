const github = require('@actions/github');

async function createProject(octokit, project) {
    let columnIDs = [];

    // create project
    console.log('Creating project...')

    // #TODO catch API call errors
    const responseProject = await octokit.rest.projects.createForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        name: project.projectName,
        body: project.projectDescription,
    });
    console.log(`Create project response - status: ${responseProject.status}`)

    // create columns
    for (let columnName of project.columnNames) {
        // console.log(`Column name: ${columnName}`);  //debug
        // create column
        // #TODO catch API call errors
        let responseColumn = await octokit.rest.projects.createColumn({
            project_id: responseProject.data.id,
            name: columnName,
        });
        console.log(`Create column response - status: ${responseColumn.status}`)
        let columnID = responseColumn.data.id;
        columnIDs.push(columnID);
    }
    // console.log(`Column IDs: ${columnIDs}`);  //debug
    return columnIDs;
}

async function createIssue(octokit, issue) {
    // create issue
    console.log(`Creating issue ${issue.title}...`);

    // #TODO catch API call errors
    const responseIssue = await octokit.rest.issues.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        assignees: issue.assignees,
        milestone: issue.milestone,
    });
    console.log(`Create issue ${issue.title} response - status: ${responseIssue.status}`);

    if (issue.columnID) {
        // add issue to project board
        // #TODO catch API call errors
        const responseCard = await octokit.rest.projects.createCard({
            column_id: issue.columnID,
            note: null,
            content_id: responseIssue.data.id,
            content_type: "Issue",
        });
        console.log(`Add issue ${issue.title} to project card response - status: ${responseCard.status}`);
    }
}

module.exports = { createProject, createIssue }
