import fs from 'fs';
import { path } from 'path';
import { rawListeners } from 'process';
import { readline } from 'readline';
import { addAbortSignal } from 'stream';

const dist_path = '../dist';

const htmlTemplateStart =
`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>`;

const htmlTemplateMiddle =
`</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>`;

const htmlTemplateEnd = 
`</body>
</html>`;

export function genIndexHtml(inputStr)
{
    // Filepath for the output directory.
    const output_dir = makeDistFolder();

    // Get the filename from the full pathname.
    const fileName = path.basename(inputStr);

    // Check whether the pathname points to a single file or a directory
    fs.lstat(inputStr, (err, stats) => {
        // use 'stats' to check if dir or file

        // If the pathname points to a file
        if (stats.isFile()) {
            if (isTxtFile(fileName))
            {
                readFile(inputStr).then((result) => {
                    writeFile()
                });
            }
        }
        // Otherwise
        else {
        }
    });
}

function genHtmlText()

function makeDistFolder() {
    // If the /dist directory exists, remove the folder and all of its contents
    if ( fs.existsSync(dist_path) )
    {
        fs.rmSync(dist_path, {
            recursive: true,
            force: true
        });
    }

    // Create a new /dist directory, if it does not already exist.
    /* Note: This IF statement may be redundant, since the /dist folder should be deleted 
       by the above code block before execution reaches this line. */
    if ( !fs.existsSync(dist_path) )
    {
        fs.mkdirSync(dist_path);
    }

    return dist_path;
}

// Accepts the name of a file as a string literal. Reads the file line by line and returns a object containing the file's contents.
function readBookFile(filePath) {
    return new Promise(async, (res, rej) => {
        var contents = {
            title: "",
            paragraphs: new Array()
        };
        
        const fileReadStream = fs.createReadStream(filePath);
        var lineStr = readline.createInterface({ 
            input: fileReadStream 
        });

        // variable to track the number of empty lines
        let emptyLines = 0;

        // variable to hold the text before it is set as a paragraph or the title
        let textBlock = "";

        // variable to store a paragraph once it's been completely parsed
        let oneParagraph = "";

        // stores TRUE if the title has been found, FALSE otherwise
        let titleFound = false;

        // Read the file line by line
        lineStr.on("line", (data) => {
            // If the line is empty then increment the empty lines counter
            if (line.length === 0) {
                emptyLines++;
            }
            // If 2 or more consecutive empty lines are found AND the title has NOT been set, then set the title.
            else if (!titleFound && emptyLines === 2)
            {
                // Set the title and set 'titleFound' to TRUE
                contents.title = textBlock;
                titleFound = true;
                
                // Set 'textBlock' to the next line.
                textBlock = line;

                // Reset the empty lines counter
                emptyLines = 0;
            }
            // If any empty lines are found and the title has already been set then create a new paragraph.
            else if (titleFound && emptyLines > 0 && emptyLines < 2) {
                // Set 'paragraph' to an HTML string containing the completed paragraph in 'textBlock'.
                oneParagraph = `<p>${textBlock}</p>`;

                // Append the completed paragraph to 'contents.paragraphs'
                contents.paragraphs.push(paragraph);

                // Set 'textBlock' to the next line.
                textBlock = line;

                // Reset the empty lines counter
                emptyLines = 0;
            }
            // Otherwise, append the current line to the text block.
            else {
                textBlock += (' ' + line);
            }
        });

        res(contents);
    });
}

// Accepts the contents of a file as a string literal. Creates an HTML file containing the content.
function writeBookFile(fileName, data) {
    return new Promise(async, (res, rej) => {
        var htmlFilePath = dist_path + getFileNameNoExt(fileName) + '.html';
        var title = data.title;
        var content = "";
        var lineNumber = 0;


    });
}

// Accepts the name of a file as a string literal. Returns TRUE if it is a .txt file, else returns FALSE.
function isTxtFile(fileName) {
    var r = false;

    if (path.extname(fileName) = ".txt") {
        r = true;
    }

    return r;
}

// Accepts the name of a file as a string literal. Returns the filename without the .txt extenstion.
function getFileNameNoExt(fileName) {
    var str = new String();
    str = fileName;
    
    // Get the index of the last '.' char in the filename
    var last_dot = str.lastIndexOf('.');

    // Make a substring from index 0 up to but excluding the char at 'last_dot'
    str.substring(0, last_dot);

    return str;
}

