#! /usr/bin/env node

import {generateWebsite} from './helpers.js';
import {program} from 'commander';

program
.option('--version, -v', 'displays the version number')
.option('--help, -h', 'displays help message')
.option('--input, -i', 'get input from a specified file or folder');

program.parse(process.argv);

if (program.opts().version)
{
    console.log("Version: 0.1");
}

if (program.opts().help)
{
    console.log("pending help message");
}

if (program.opts().input)
{
    generateWebsite(`${program.opts().input}`);
}