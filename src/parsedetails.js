// const fs = require('fs');
// const path = require('path');
const { listToArray } = require('./helpers');
const { readTextFile, parseTemplate, parseMatter } = require('./parsefile');

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

module.exports = { projectDetails }
