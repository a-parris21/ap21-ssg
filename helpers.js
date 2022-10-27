import fs, { stat } from 'fs';
import path from 'path';
import readline from 'readline';
import configStyle from './main.js';



var allFileNames = new Array(String);

function makeOutputFolder(outputDir)
{
    // If the /dist directory exists, remove the folder and all of its contents
    if (fs.existsSync(outputDir))
    {
		fs.rmSync(outputDir, { recursive: true, force: true });
	}

    // Create a new /dist directory, if it does not already exist.
    /* Note: This IF statement may be redundant, since the /dist folder should be deleted 
       by the above code block before execution reaches this line. */
    if (!fs.existsSync(outputDir))
    {
		fs.mkdirSync(outputDir);
	}
}

function setOutputFolder(outputDir)
{
    var outputPath = "./";
    
    if (outputDir.length > 0)
    {
        var temp = new String(outputDir);
        var pathStartWithDot = new RegExp('^\.\/.*');
        var pathStartNoDot = new RegExp('^\/.*');

        if (pathStartWithDot.test(temp))
        {
            outputPath += temp.substring(2);
        }
        else if (pathStartNoDot.test(temp))
        {
            outputPath += temp.substring(1);
        }
        else
        {
            outputPath = temp;
        }
    }
    else
    {
        outputPath = "./dist";
    }

    makeOutputFolder(outputPath.valueOf());

    return outputPath.valueOf();
}

export function generateWebsite(inputStr, outputStr, htmlLang, configStyle = '')
{
    var outputFolder = setOutputFolder(outputStr);
    parseDir(inputStr, outputFolder, htmlLang);
    if (allFileNames > 1)
    {
        generateIndexHtmlFile(allFileNames, outputStr, htmlLang);
    }

    return 0;
}

function parseDir(inputStr, outputStr, htmlLang)
{
    if (!fs.existsSync(inputStr) || !fs.existsSync(outputStr))
    {
        if (!fs.existsSync(inputStr))
            console.log(`Input path <${inputStr}> does not exist.`);
        
        if (!fs.existsSync(outputStr))
            console.log(`Output path <${outputStr}> does not exist.`);
            
        return -1;
    }

    // Check whether the filepath is a single file or a folder.
    fs.lstat(inputStr, (err, stats) =>
    {
        if (err)
        {
            console.log(err);
            return -1;
        }
        else
        {
            // If a folder was specified, parse each file individually.
            if (stats.isDirectory())
            {
                fs.readdir(inputStr, (err, files) =>
                {

                    if (files.length > 0)
                    {
                        files.forEach((oneFile) =>
                        {
                            oneFile = inputStr + '/' + oneFile;
                            parseDir(oneFile, outputStr, htmlLang);
                        });
                    }
                    else
                    {
                        console.log(`${inputStr} is an empty directory. No files to parse.`);
                    }
                });
            }
            // Otherwise, if the filepath was a single file then parse it.
            else
            {
                parseOneFile(inputStr, outputStr, htmlLang);
            }
        } // end else no errors
    });
}

// Accepts the filepath as a string. Reads and parses the file line by line. Returns an HTML string generated using the file contents.
function readFileTxt(filePath)
{
    return new Promise(async (res, rej) =>
    {
        const fileReadStream = readline.createInterface({input: fs.createReadStream(filePath)});

        var linesArr = new Array();
        for await (const line of fileReadStream)
        {
            linesArr.push(line);
        }

        res(linesArr);
    });
}

// Accepts the contents of a file as a string literal. Creates an HTML file containing the content.
function writeHtmlFile(fileName, outputDir, htmlLang, dataArr)
{
    return new Promise( (res, rej) =>
    {
        var htmlFilePath = outputDir + "/" + path.basename(fileName) + '.html';
        
        var htmlData = generateHtmlBody(dataArr);

        const htmlStr = generateHtmlPage(htmlData.title_, htmlData.body_, htmlLang, configStyle);

        // Write the html file contents ('htmlStr') to the specified file path
        fs.writeFile(htmlFilePath, htmlStr, (err) =>
        {
            if (err)
            {
                console.log(err);
                return -1;
            }
            console.log(`File created: ${htmlFilePath}`);
        });

        res(htmlFilePath);
    });
}

// Generates the index.html file.
function generateIndexHtmlFile(filenames, outputDir, htmlLang = 'en-CA', configStyle = '')
{
    const indexFilePath = outputDir + "/index.html";
    const indexTitle = "AP21 SSG";

    // Generate the head and the beginning of the body elements for the index.html file.
    var htmlStr = 
    `<!doctype html>
    <html lang="${htmlLang}">
    <head>
    <meta charset="utf-8">
    <title>${indexTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>`;
    
    // Create an unordered list of hyperlinks for each of the filenames in the array.
    for (let i=0; i < filenames.length; i++)
    {
        htmlStr += 
        `<ul><li>
        <a href="${outputDir}/${filenames[i]}.html">${filenames[i]}</a>
        </li></ul>`;
    }
    
    // Finish the html string.
    htmlStr += `</body></html>`;

    // Write the html file contents ('htmlStr') to the specified file path
    fs.writeFile(indexFilePath, htmlStr, (err) =>
    {
        if (err)
        {
            console.log(err);
            return -1;
        }
        console.log(`File created: ${indexFilePath}`);
    });
}

// Generates the HTML string for a webpage for a single file.
function generateHtmlPage(title, paragraphs, htmlLang = 'en-CA', configStyle = '')
{
    if(configStyle) 
    {
        var str = `<!doctype html>
        <html lang="${htmlLang}">
        <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="${configStyle}"/>
        </head>
        <body>
        <h1>${title}</h1>
        ${paragraphs}
        </body>
        </html>`;
        
    }
    else 
    {
        var str = `<!doctype html>
        <html lang="${htmlLang}">
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
        
    }

    return str;
}

// Edited Anshul's code for Lab 2 -- where initial markdown support was added. Requires further debugging.

/* Accepts a string in MD syntax, parses it and returns an HTML compatible version. 
    Note: Does not work completely as intended. Will not parse correctly multiple instances of MD bold syntax within the same line.

    Input:                      "This **is** a **cat**."
    Expected HTML Output:       "This <b>is</b> a <b>cat</b>." 
    Actual HTML Output:         "This <b>is** a **cat</b>." 
*/
function parseMarkdown(mdStr)
{
    const mdBold = /\*\*(.*)\*\*/gim;       // reg expression for bold syntax
    const mdInlineCode = /\`(.*)\`/gim;     // reg exp for in-line code syntax
    const mdHr = /^(\s*)\-\-\-(\s*$)/gm;      // reg exp for horizontal rule

    var htmlText = mdStr.replace(mdBold, "<b>$1</b>")
    .replace(mdInlineCode, "<code>$1</code>")
    .replace(mdHr, "<hr><br/>");

    return htmlText;
}

// Modified version of 'readFileTxt()' which calls the 'parseMarkdown' function when pushing to the 'linesArr'.
function readFileMd(filePath)
{
    return new Promise(async (res, rej) =>
    {
        const fileReadStream = readline.createInterface({input: fs.createReadStream(filePath),});

        var linesArr = new Array();
        for await (const line of fileReadStream)
        {
            linesArr.push(parseMarkdown(line)); // parse 'line' before pushing it to 'linesArr'
        }

        res(linesArr);
    });
}

// Accepts an array of lines which were read from a file, 
function generateHtmlBody(dataArr)
{
    var myBuffer = ""; // Buffer to hold lines read from the file.
    var title = "";
    var paragraph = "";
    var htmlBody = "";
    var emptyLines = 0;

    // Check the text for a title.
    let x = 0;
    for (let i=0; i < dataArr.length; i++)
    {
        if (dataArr[i].length > 0)
        {
            myBuffer = dataArr[i];
            emptyLines = 0;
        }
        else
        {
            emptyLines++;
        }

        if (emptyLines == 2)
        {
            title = myBuffer;
            myBuffer = "";
            emptyLines = 0;
            break;
        }
    }

    // Note that this loop will end before the last paragraph is added to the html string.
    for (let i=x+1; i < dataArr.length; i++)
    {
        if (dataArr[i].length > 0)
        {
            myBuffer += dataArr[i] + "<br>";
        }
        
        {
            if (myBuffer.length > 0)
            {
                paragraph = myBuffer;
                htmlBody += `<p>${paragraph}</p>\n`;
                myBuffer = "";
            }
        }
    }

    // Get the last paragraph.
    if (myBuffer.length > 0)
    {
        paragraph = myBuffer;
        htmlBody += `<p>${paragraph}</p>\n`;
        myBuffer = "";
    }

    var obj = {
        title_: title,
        body_: htmlBody
    };

    return obj;
}


function parseOneFile(inputStr, outputStr, htmlLang)
{
    // Get the filename from the full pathname.
    const fileName = path.basename(inputStr);
    
    if (path.extname(fileName) == '.txt')
    {
        readFileTxt(inputStr)
        .then((data) =>
        {
            writeHtmlFile(fileName, outputStr, htmlLang, data);
        })
        .catch(function (err)
        {
            console.log(err);
            return -1;
        });
    }
    else if (path.extname(fileName) == '.md')
    {
        readFileMd(inputStr)
        .then((data) =>
        {
            writeHtmlFile(fileName, outputStr, htmlLang, data);
        })
        .catch(function (err)
        {
            console.log(err);
            return -1;
        });
    }
    else
    {
        console.log("Invalid file type. Cannot parse.");
    }
}