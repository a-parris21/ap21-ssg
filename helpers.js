import fs, { stat } from 'fs';
import path from 'path';
import readline from 'readline';

const dist_path = './dist';

export function generateWebsite(inputStr)
{
    makeDistFolder();

    // Get the filename from the full pathname.
    const fileName = path.basename(inputStr);

    // Check whether the filepath is a single file or a folder.
	fs.lstat(inputStr, (err, stats) => {
		if (err) {
			console.log(err);
			return;
		}
        else {
            // If a folder was specified, parse each file individually.
			if (stats.isDirectory()) {
				fs.readdir(inputStr, (err, files) => {

					files.forEach((oneFile) => {
						if (err) {
							console.log(err);
							return;
						}
						else if (path.extname(oneFile) == '.txt') {
							readBookFileTxt(inputStr + '/' + oneFile)
                            .then(function (data) {
								writeBookFile(oneFile, data);
							})
                            .catch(function (err) {
                                console.log(err);
                            });
						}
                        else if (path.extname(oneFile) == '.md') {
                            console.log(".md file found");

                            readBookFileMd(inputStr + '/' + oneFile)
                            .then(function (data) {
                                writeBookFile(oneFile, data);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                        else {
                            console.log("Invalid file type. Cannot parse.");
                        }
					});

					generateIndexHtmlFile(files, true);
				});
			}
            // Otherwise, if the filepath was a single file then parse it.
            else {
				if (path.extname(fileName) == '.txt') {

					readBookFileTxt(inputStr)
                    .then((data) => {
						writeBookFile(fileName, data);
					})
                    .catch(function (err) {
                        console.log(err);
                    });
				}
                else if (path.extname(fileName) == '.md') {
                    console.log(".md file found");

                    readBookFileMd(inputStr)
                    .then(function (data){
                        writeBookFile(fileName, data);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                }
                else {
                    console.log("Invalid file type. Cannot parse.");
                }
			}
		} // end else no errors
	});
}

function makeDistFolder() {
    // If the /dist directory exists, remove the folder and all of its contents
    if (fs.existsSync(dist_path)) {
		fs.rmSync(dist_path, { recursive: true, force: true });
	}

    // Create a new /dist directory, if it does not already exist.
    /* Note: This IF statement may be redundant, since the /dist folder should be deleted 
       by the above code block before execution reaches this line. */
    if (!fs.existsSync(dist_path)) {
		fs.mkdirSync(dist_path);
	}
}

// Accepts the filepath as a string. Reads and parses the file line by line. Returns an HTML string generated using the file contents.
function readBookFileTxt(filePath) {
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
function writeBookFile(fileName, dataArr) {
    return new Promise( (res, rej) => {
        var htmlFilePath = dist_path + "/" + getFileNameNoExt(fileName) + '.html';
        
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
                myBuffer += dataArr[i];
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


        const htmlStr = generateBookHtmlPage(title, htmlBody);

        // Write the html file contents ('htmlStr') to the specified file path
        fs.writeFile(htmlFilePath, htmlStr, (err)=>{
            if (err) {
                console.log(err);
            }
            console.log(`File created: ${htmlFilePath}`);
        });

        res(htmlFilePath);
    });
}

// Generates the index.html file.
function generateIndexHtmlFile(books) {
    const indexFilePath = dist_path + "/index.html";
    const indexTitle = "AP21 SSG";

    // Generate the head and the beginning of the body elements for the index.html file.
    var htmlStr = 
    `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>${indexTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>`;
    
    // Create an unordered list of hyperlinks for each of the books in the array.
    for (let i=0; i < books.length; i++) {
        htmlStr += 
        `<li><ul>
        <a href="${dist_path}/${books[i]}.html">${books[i]}</a>
        </ul></li>`;
    }
    
    // Finish the html string.
    htmlStr += `</body></html>`;

    // Write the html file contents ('htmlStr') to the specified file path
    fs.writeFile(indexFilePath, htmlStr, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`File created: ${indexFilePath}`);
    });
}

// Generates the HTML string for a webpage for a single book.
function generateBookHtmlPage(bookTitle, paragraphs) {
    var str = `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>${bookTitle}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <h1>${bookTitle}</h1>
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
    var last_dot = str.lastIndexOf('.');

    // Make a substring from index 0 up to but excluding the char at 'last_dot'
    str = str.substring(0, last_dot);

    return str;
}


//-------------------------------------

// Edited Anshul's code for Lab 2 -- where initial markdown support was added. Requires further debugging.

/* Accepts a string in MD syntax, parses it and returns an HTML compatible version. 
    Note: Does not work completely as intended. Will not parse correctly multiple instances of MD bold syntax within the same line.

    Input:                      "This **is** a **cat**."
    Expected HTML Output:       "This <b>is</b> a <b>cat</b>." 
    Actual HTML Output:         "This <b>is** a **cat</b>." 
*/
function parseMarkdown(mdStr) {
    const mdBold = /\*\*(.*)\*\*/gim;

    var htmlText = mdStr.replace(mdBold, "<b>$1</b>");

    return htmlText;
}

// Modified version of 'readBookFileTxt()' which calls the 'parseMarkdown' function when pushing to the 'linesArr'.
function readBookFileMd(filePath) {
    return new Promise(async (res, rej) => {
        const fileReadStream = readline.createInterface({input: fs.createReadStream(filePath),});

        var linesArr = new Array();
        for await (const line of fileReadStream) {
            linesArr.push(parseMarkdown(line)); // parse 'line' before pushing it to 'linesArr'
        }

        res(linesArr);
    });
}