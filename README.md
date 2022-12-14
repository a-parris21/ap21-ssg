# AP21-SSG

## Overview

This tool is a static site generator (SSG) written in JavaScript and can be run from the Windows CMD or PowerShell.
This SSG allows the user to specify a `.txt` or `.md` file (or a directory of `.txt` or `.md` files types) as input for the program, which will then generate HTML files for each `.txt` file inputted.

## Requirements

All version numbers listed are the recommended versions, though please note that updated/newer version

-   `Node.js` v14.3.0 or higher.
-   `NPM` v6.14.0 or higher.

## Installation


To install this program, first clone the repository to your local machine. This can be done in several ways, though I recommend using the VSC CLI. `git clone <URL_to_this_repo> <destination_directory_file_path>`.

### Examples

-   Windows: `~\Documents\dps909\rel_01\ap21-ssg`

-   Mac/Linux: `~/Documents/dps909/rel_01/ap21-ssg`

Next, open a terminal inside of the newly created folder (this can be via VSC, Windows CMD or Windows PowerShell).

Then, run `npm install` to install the node module dependencies.

## Usage

-

## Options

There are three CLI options available to the user with this program.

-   **node main.js -i "./files/lab2.md"** to parse out the bold data from the `md` files and convert it to `html5` pages

## Examples

Cloning the Repository
`git clone https://github.com/a-parris21/ap21-ssg C:\Users\<username>\Documents\ap21-ssg`

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

-   Parsing the title from the file.
-   Auto-generate an `index.html` file if the user specifies a folder for input.

## New feature

-   Added the new feature in the SSG to deal with the .md file type and convert them to .html file type.
-   To use this feature use this command **node main.js -i "./files/lab2.md"**.
