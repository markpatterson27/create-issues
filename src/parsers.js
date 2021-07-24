/**
 * Functions to parse data from files.
 */
const fm = require('front-matter');
const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

// read in markdown file
function readTextFile(filePath) {

    // throw error if filePath not string
    if (typeof filePath !== 'string') {
        // throw new Error('content not a string');
        throw new TypeError("File path not a string");
    }

    // filePath will be relative to repo root, not to action workspace. need to use full path
    const workspace = process.env.GITHUB_WORKSPACE;
    const fullPath = path.join(workspace, filePath);

    // check file is text file
    // #TODO

    try {
        let contents = fs.readFileSync(fullPath, {encoding: 'utf-8'});

        // remove CR for consistency across platforms
        contents = contents.replace(/\r/g, '');

        return contents;
    } catch (error) {
        if (error.code === 'ENOENT') {
            // don't throw error, but give warning
            console.warn(`::warning::File '${filePath}' not found! You may need to use actions/checkout to clone the repository first.`);
            // error.message += `\nFile ${filePath} not found! You may need to use actions/checkout to clone the repository first.`
        } else {
            throw error;
        }
    }
}

// return files in directory
function listFiles(dirPath) {

    // throw error if filePath not string
    if (typeof dirPath !== 'string') {
        // throw new Error('content not a string');
        throw new TypeError("Directory path not a string");
    }

    // filePath will be relative to repo root, not to action workspace. need to use full path
    const workspace = process.env.GITHUB_WORKSPACE;
    const fullPath = path.join(workspace, dirPath);

    try {
        // return only filenames, not sub-dir
        const files =  fs.readdirSync(fullPath, {withFileTypes: true})
            .filter(item => !item.isDirectory())
            .map(item => item.name);

        if (files.length === 0) {
            let emptyDirError = new Error("Directory empty");
            emptyDirError.code = 'EMPTYDIR';
            throw emptyDirError;
        }

        return files;
    } catch (error) {
        // console.log(error.name);
        if (error.code === 'ENOENT') {
            console.error(`::error::Issues directory '${dirPath}' not found.`);
            error.message = `Issues directory '${dirPath}' not found.\n\n` + error.message;
        } else if (error.code === 'EMPTYDIR') {
            console.error(`::error::No files found in directory '${dirPath}'`);
            error.message = `No files found in directory '${dirPath}'.\n\n` + error.message;
        }
        else {
            console.error(`::error::Unable to read issues directory '${dirPath}'.`);
            error.message = `Unable to read issues directory '${dirPath}'.\n\n` + error.message;
        }
        throw error;
    }
}

// parse through templating
function parseTemplate(content, templateVariables) {

    // throw error if not a string
    if (typeof content !== 'string') {
        // throw new Error('content not a string');
        throw new TypeError("Content not a string");
    }
    // throw error if not an object
    if (typeof templateVariables !== 'object') {
        // throw new Error('content not a string');
        throw new TypeError("Templates not an object");
    }

    // configure templating
    nunjucks.configure({ 
        autoescape: false,
        throwOnUndefined: false
    });

    // add additional templates
    templateVariables = {
        ...templateVariables,
        env: process.env
    }

    // console.log(templateVariables);

    // render content
    const parsed = nunjucks.renderString(content, templateVariables);

    // console.log(parsed);

    return parsed;
}

// parse through frontmatter
function parseMatter(content) {

    // throw error if not a string
    if (typeof content !== 'string') {
        // throw new Error('content not a string');
        throw new TypeError("Content not a string");
    }

    // parse content
    const { attributes, body } = fm(content);

    const parsed = {
        attributes: attributes,
        body: body
    };

    // console.log(parsed);

    return parsed;
}

module.exports = { readTextFile, listFiles, parseTemplate, parseMatter };
