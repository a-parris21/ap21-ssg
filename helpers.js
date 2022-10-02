import fs, { stat } from 'fs';
import path from 'path';
import readline from 'readline';

const dist_path = "./dist";
var htmlLangAttribute = "en-CA";
var allFileNames = new Array(String);

export function setHtmlLang(lang) {
    if (lang.length > 0)
    {
        var language = new String(lang);
        htmlLangAttribute = language;
    }
}

function setOutputFolder(outputDir) {
    var outputPath = "./";
    
    if (outputDir.length > 0)
    {
        var temp = new String(outputDir);
        var pathStartWithDot = new RegExp('^\.\/.*');
        var pathStartNoDot = new RegExp('^\/.*');

        if (pathStartWithDot.test(temp)) {
            outputPath += temp.substring(2);
        }
        else if (pathStartNoDot.test(temp)) {
            outputPath += temp.substring(1);
        }
        else {
            outputPath = temp;
        }
    }
    else
    {
        outputPath = new String(dist_path);
    }

    makeOutputFolder(outputPath.valueOf());
}

export function generateWebsite(inputStr, outputStr)
{
    setOutputFolder(outputStr);
    console.log(`in:${inputStr}|out:${outputStr}`);

    parseFile(inputStr, outputStr);
    if (allFileNames > 1) {
        generateIndexHtmlFile(allFileNames, outputStr);
    }

    return 0;
}

function makeOutputFolder(outputDir) {
    // If the /dist directory exists, remove the folder and all of its contents
    if (fs.existsSync(outputDir)) {
		fs.rmSync(outputDir, { recursive: true, force: true });
	}

    // Create a new /dist directory, if it does not already exist.
    /* Note: This IF statement may be redundant, since the /dist folder should be deleted 
       by the above code block before execution reaches this line. */
    if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir);
	}
}

function parseFile(inputStr, outputStr) {
    // Get the filename from the full pathname.
    const fileName = path.basename(inputStr);

    // Check whether the filepath is a single file or a folder.
	fs.lstat(inputStr, (err, stats) => {
		if (err) {
			console.log(err);
			return -1;
		}
        else {
            // If a folder was specified, parse each file individually.
			if (stats.isDirectory()) {
				fs.readdir(inputStr, (err, files) => {

                    if (files.length > 0)
                    {
                        files.forEach((oneFile) => {
                            oneFile = inputStr + '/' + oneFile;
                            //console.log(`Currently parsing ${oneFile}.`);
                            parseFile(oneFile, outputStr);
                        });
                    }
                    else {
                        console.log(`${inputStr} is an empty directory. No files to parse.`);
                    }
				});
			}
            // Otherwise, if the filepath was a single file then parse it.
            else {
				if (path.extname(fileName) == '.txt') {
					readFileTxt(inputStr)
                    .then((data) => {
						writeHtmlFile(fileName, outputStr, data);
					})
                    .catch(function (err) {
                        console.log(err);
                        return -1;
                    });
				}
                else if (path.extname(fileName) == '.md') {
                    readFileMd(inputStr)
                    .then(function (data){
                        writeHtmlFile(fileName, outputStr, data);
                    })
                    .catch(function (err) {
                        console.log(err);
                        return -1;
                    });
                }
                else {
                    console.log("Invalid file type. Cannot parse.");
                }
			}
		} // end else no errors
	});
}

// Accepts the filepath as a string. Reads and parses the file line by line. Returns an HTML string generated using the file contents.
function readFileTxt(filePath) {
    return new Promise(async (res, rej) => {
        const fileReadStream = readline.createInterface({input: fs.createReadStream(filePath),});

        var linesArr = new Array();
        for await (const line of fileReadStream) {
            linesArr.push(line);
        }

        res(linesArr);
    });
}

// Accepts the contents of a file as a string literal. Creates an HTML file containing the content.
function writeHtmlFile(fileName, outputDir, dataArr) {
    return new Promise( (res, rej) => {
        var htmlFilePath = outputDir + "/" + getFileNameNoExt(fileName) + '.html';
        
        var myBuffer = ""; // Buffer to hold lines read from the file.
        var title = "";
        var titleIndex = -1;
        var paragraph = "";
        var htmlBody = "";
        var emptyLines = 0;

        // Check the text for a title.
        let x = 0;
        for (let i=0; i < dataArr.length; i++)
        {
            if (dataArr[i].length > 0) {
                myBuffer = dataArr[i];
                emptyLines = 0;
            }
            else {
                emptyLines++;
            }

            if (emptyLines == 2) {
                title = myBuffer;
                myBuffer = "";
                emptyLines = 0;
                break;
            }
        }

        // Note that this loop will end before the last paragraph is added to the html string.
        for (let i=x+1; i < dataArr.length; i++)
        {
            if (dataArr[i].length > 0) {
                myBuffer += dataArr[i] + "<br>";
            }
            else {
                if (myBuffer.length > 0) {
                    paragraph = myBuffer;
                    htmlBody += `<p>${paragraph}</p>\n`;
                    myBuffer = "";
                }
            }
        }

        // Get the last paragraph.
        if (myBuffer.length > 0) {
            paragraph = myBuffer;
            htmlBody += `<p>${paragraph}</p>\n`;
            myBuffer = "";
        }


        const htmlStr = generateHtmlPage(title, htmlBody);

        // Write the html file contents ('htmlStr') to the specified file path
        fs.writeFile(htmlFilePath, htmlStr, (err)=>{
            if (err) {
                console.log(err);
                return -1;
            }
            console.log(`File created: ${htmlFilePath}`);
        });

        res(htmlFilePath);
    });
}

// Generates the index.html file.
function generateIndexHtmlFile(filenames, outputDir) {
    const indexFilePath = outputDir + "/index.html";
    const indexTitle = "AP21 SSG";

    // Generate the head and the beginning of the body elements for the index.html file.
    var htmlStr = 
    `<!doctype html>
    <html lang="${htmlLangAttribute}">
    <head>
    <meta charset="utf-8">
    <title>${indexTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>`;
    
    // Create an unordered list of hyperlinks for each of the filenames in the array.
    for (let i=0; i < filenames.length; i++) {
        htmlStr += 
        `<li><ul>
        <a href="${outputDir}/${filenames[i]}.html">${filenames[i]}</a>
        </ul></li>`;
    }
    
    // Finish the html string.
    htmlStr += `</body></html>`;

    // Write the html file contents ('htmlStr') to the specified file path
    fs.writeFile(indexFilePath, htmlStr, (err) => {
        if (err) {
            console.log(err);
            return -1;
        }
        console.log(`File created: ${indexFilePath}`);
    });
}

// Generates the HTML string for a webpage for a single file.
function generateHtmlPage(title, paragraphs) {
    var str = `<!doctype html>
        <html lang="${htmlLangAttribute}">
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <h1>${title}</h1>
            ${paragraphs}
        </body>
        </html>`;

    return str;
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
    var lastDot = str.lastIndexOf('.');

    // Make a substring from index 0 up to but excluding the char at 'lastDot'
    str = str.substring(0, lastDot);

    return str;
}

// Edited Anshul's code for Lab 2 -- where initial markdown support was added. Requires further debugging.

/* Accepts a string in MD syntax, parses it and returns an HTML compatible version. 
    Note: Does not work completely as intended. Will not parse correctly multiple instances of MD bold syntax within the same line.

    Input:                      "This **is** a **cat**."
    Expected HTML Output:       "This <b>is</b> a <b>cat</b>." 
    Actual HTML Output:         "This <b>is** a **cat</b>." 
*/
function parseMarkdown(mdStr) {
    const mdBold = /\*\*(.*)\*\*/gim;       // reg expression for bold syntax
    const mdInlineCode = /\`(.*)\`/gim;     // reg exp for in-line code syntax
    const mdHr = /^(\s*)\-\-\-(\s*$)/gm;      // reg exp for horizontal rule

    var htmlText = mdStr.replace(mdBold, "<b>$1</b>")
    .replace(mdInlineCode, "<code>$1</code>")
    .replace(mdHr, "<hr><br/>");

    return htmlText;
}

// Modified version of 'readFileTxt()' which calls the 'parseMarkdown' function when pushing to the 'linesArr'.
function readFileMd(filePath) {
    return new Promise(async (res, rej) => {
        const fileReadStream = readline.createInterface({input: fs.createReadStream(filePath),});

        var linesArr = new Array();
        for await (const line of fileReadStream) {
            linesArr.push(parseMarkdown(line)); // parse 'line' before pushing it to 'linesArr'
        }

        res(linesArr);
    });
}