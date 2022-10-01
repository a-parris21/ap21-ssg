// #! /usr/bin/env node
const { version } = require('./package.json');
import { generateWebsite } from './helpers.js';
import { Command } from 'commander';
const program = new Command();

const help_message = generateHelpMessage();

program.option('-i --input <item>', 'get input')
	.option('-v --version', 'displays the program name & version number')
	.option('-h --help', 'displays help message')
	.option('-l --lang', 'specify the language of the html documents');

program.parse(process.argv);

const options = program.opts();

if (options.version)
{
    console.log("v0.1.0");
}

if (options.help)
{
    console.log(help_message);
}

if (options.input)
{
    generateWebsite(`${options.input}`);
}

if (options.lang)
{
    generateWebsite(`${options.input}`); //modify this to accept a 2nd parameter
}

function generateHelpMessage()
{
    let helpMsg = `----------------------------------------------------------------------\n`;

    helpMsg += `Usage: main.js [options] <filepath>\n\n`;

    helpMsg += `Generate HTML site from .txt file input.\n\n`;

    helpMsg += `Arguments:\n`;
    helpMsg += `  filepath                   pathname to input file or directory\n\n`;

    helpMsg += `Arguments:\n`;
    helpMsg += `  -v --version               display the program name & version number\n`;
    helpMsg += `  -h, --help                 display this help message\n`;
    helpMsg += `  -i, --input                get input from a specified file or folder\n`;
    helpMsg += `----------------------------------------------------------------------\n\n`;


	return helpMsg;
}
