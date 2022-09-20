#! /usr/bin/env node

import {generateWebsite} from './helpers.js';
//import {program} from 'commander';
import { Command } from 'commander';
const program = new Command();

//console.log("test");

program
.option('-v --version', 'displays the version number')
.option('-h --help', 'displays help message')
.option('-i --input', 'get input from a specified file or folder');

program.parse(process.argv);

const options = program.opts();

if (options.version)
{
    console.log("Version: 0.1");
}

if (options.help)
{
    //console.log(generateHelpMessage());
    //console.log(`does this put in a new line`);
}

if (options.input)
{
    generateWebsite(`${program.opts().input}`);
}

function generateHelpMessage()
{
    var helpMsg;

    helpMsg = 
    `
    `;

    return helpMsg;
}