const github = require('@actions/github');

async function createProject(octokit, project) {
    let columnIDs = [];

    // create project
    console.log('Creating project...')

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

module.exports = { createProject }
