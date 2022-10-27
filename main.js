// #! /usr/bin/env node

import { generateWebsite } from './helpers.js';
import { Command } from 'commander';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const program = new Command();
const { version } = require('./package.json');
const help_message = generateHelpMessage();

const data = require('./config.json');

const configInput = data.input || '';
const configOutput = data.output || './dist';
const configStyle = data.stylesheet;
const configLang = data.lang || 'en';

program.option('-i --input <item>', 'get input')
	.option('-v --version', 'displays the program name & version number')
	.option('-h --help', 'displays help message')
	.option('-l --lang <item>', 'specify the language of the html documents')
	.option('-o --output <item>', 'specify the output folder where the html files will be generated')
	.option('-c --config <item>', 'specify the config file that will contain all SSG options');

program.parse(process.argv);

const options = program.opts();

if(options.config) 
{
    generateWebsite(`${configInput}`, `${configOutput}`, `${configLang}`, `${configStyle || ''}`);
}

if(!options.config) 
{

    if (options.version)
    {
        console.log(`${version}`);
    }

    if (options.help)
    {
        console.log(help_message);
    }

    if (options.input)
    {
        if (options.output)
        {
            generateWebsite(`${options.input}`, `${options.output}`, `${options.lang || ''}`);
        }
        else
        {
            generateWebsite(`${options.input}`, '', `${options.lang || ''}`);
        }
    }
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
    helpMsg += `  -c, --config               specify the config file that will contain all SSG options\n`;
    helpMsg += `----------------------------------------------------------------------\n\n`;


	return helpMsg;
}

export default configStyle;