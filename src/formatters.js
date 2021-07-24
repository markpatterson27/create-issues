/**
 * Functions to reformat and rearrange data into formats accepted by API calls.
 */
const path = require('path');
const { readTextFile, parseTemplate, parseMatter, listFiles } = require('./parsers');

// process action inputs and return project details - name, description and columns
function projectDetails(projectFile, projectName, projectDescription, columnNames, templateVariables) {

    const defaultColumns = 'To Do';
    let parsedFM = {
        attributes: {
            title: '',
            columns: defaultColumns
        },
        body: ''
    }

    if (projectFile) {

        let contents = readTextFile(projectFile);

        if (contents) {
            const parsedTemplates = parseTemplate(contents, templateVariables);
            parsedFM = parseMatter(parsedTemplates);
        }
    }

    return {
        projectName: (projectName) ? projectName : parsedFM.attributes.title,
        projectDescription: (projectDescription)? projectDescription : parsedFM.body,
        columnNames: (columnNames)? listToArray(columnNames) : listToArray(parsedFM.attributes.columns)
    }
}

// process action inputs and return issues details
function issuesDetails(issuesDir, project, columnIDs, templateVariables) {
    let issues = [];

    // find files
    const files = listFiles(issuesDir);

    // loop through files
    for (let file of files) {
        let filePath = path.join(issuesDir, file);
        let issue = issueDetails(filePath, project, columnIDs, templateVariables);
        if (issue) {
            issues.push(issue);
        }
    }
    // console.log(issues); //debug
    return issues;
}

// process issue file and return issue details
function issueDetails(file, project, columnIDs, templateVariables) {
    let parsedFM = {};
    let issue = {};
    
    // read file and parse contents
    let contents = readTextFile(file);
    if (contents) {
        const parsedTemplates = parseTemplate(contents, templateVariables);
        parsedFM = parseMatter(parsedTemplates);
    }

    // if empty file, don't process
    if (parsedFM.body) {
        // if no title, use file name
        issue.title = (parsedFM.attributes.title) ? parsedFM.attributes.title : path.parse(file).name;

        issue.body = parsedFM.body;

        issue.labels = listToArray(parsedFM.attributes.labels);
        issue.assignees = listToArray(parsedFM.attributes.assignees);
        issue.milestone = parseInt(parsedFM.attributes.milestone) || undefined;

        // find column ID to use
        if (project.projectName) {
            issue.columnID = findColumnID(parsedFM, project, columnIDs);
        }

        // console.log(issue); //debug
        return issue;
    }
    return;
}

// process column attribute and return associated column ID
function findColumnID(parsedFM, project, columnIDs) {
    // console.log(Number(parsedFM.attributes.column)); //debug
    // if column is int AND int <= columnIDs.length -> use int
    if (Number.isInteger(Number(parsedFM.attributes.column)) && 0 < Number(parsedFM.attributes.column) && Number(parsedFM.attributes.column) <= columnIDs.length) {
        return columnIDs[Number(parsedFM.attributes.column)-1];
    }
    // if column is not number AND string -> match for index
    else if (!(Number(parsedFM.attributes.column)) && typeof parsedFM.attributes.column === 'string') {
        let i = project.columnNames.indexOf(parsedFM.attributes.column);
        i = (i > 0) ? i : 0;
        return columnIDs[i];
    }
    // else 1
    else {
        return columnIDs[0];
    }
}

// convert input to an array
function listToArray (list) {
    if (!list) return []
    return Array.isArray(list) ? list : list.split(', ')
}

module.exports = { projectDetails, issuesDetails, issueDetails, findColumnID, listToArray }
