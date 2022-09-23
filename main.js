// #! /usr/bin/env node

import { generateWebsite } from './helpers.js';
import { Command } from 'commander';
const program = new Command();

//console.log("test");

program
	.option('-i --input <item>', 'get input')
	.option('-v --version', 'displays the program name & version number')
	.option('-h --help', 'displays help message');

program.parse(process.argv);

const options = program.opts();

if (options.version) {
	console.log('Version: 0.1.0');
}

if (options.help) {
	//console.log(generateHelpMessage());
	console.log(`Usage: ./`);
}

if (program.opts().input) {
	console.log('input: ' + program.opts().input);
	generateWebsite(`${program.opts().input}`);
}

function generateHelpMessage() {
	var helpMsg;

	helpMsg = `
    `;

	return helpMsg;
}
