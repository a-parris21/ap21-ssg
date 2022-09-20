# AP21-SSG

## Overview

This tool is a static site generator (SSG) written in JavaScript and can be run from the Windows CMD or PowerShell.
This SSG allows the user to specify a `.txt` file (or a directory of `.txt` files) as input for the program, which will then generate HTML files for each `.txt` file inputted.

## Requirements

All version numbers listed are the recommended versions, though please note that updated/newer versios 
- `Node.js` v14.3.0 or higher.
- `NPM` v6.14.0 or higher.

## Installation
To install this program, either clone the repository to your local machine or download the code as a `.zip` archive.

Next, navigate to the directory where the files from this repos were cloned/saved.
Open a CLI terminal and run `npm install` to install the node module dependencies.

## Usage
Execute `main.js [options]` in the directory where `main.js` is located.  
Note that on Windows you may need to prefix this with the Node interpreter, `node /main.js [options]`.

## Options
| Long      | Short | Description                                                                               |
| --------- | ----- | ----------------------------------------------------------------------------------------- |
| --help    | -h    | Displays the help message.                                                                    |
| --input   | -i    | Specify file or folder for input. In case of folder will generate recurseively? |
| --version | -v    | Prints the version number.                                                                |  
### Examples
- `main.js --input ./input_data/`
- `main.js -i ./input_data/Sherlock-Holmes-Selected-Stories/`
- `main.js -i ./input_data/Sherlock-Holmes-Selected-Stories/Silver Blaze.txt`

## Optional features developed

- Parsing the title from the file.
- Auto-generate an `index.html` file if the user specifies a folder for input.
