import fs, { stat } from 'fs';
import path from 'path';
import readline from 'readline';

const dist_path = './dist';

var bookNames = new Array();

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
            console.log("isDir = " + stats.isDirectory() + " | isFile = " + stats.isFile());
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

                            /*readBookFileMd(inputStr + '/' + oneFile).then(function (data) {
                                writeBookFile(oneFile, data);
                            }, function (err) {
                                console.log(err);
                            });*/
                            readBookFileMd(inputStr + '/' + oneFile)
                            .then(function (data) {
                                writeBookFile(oneFile, data);
                            }).catch(function (err) {
                                console.log(err);
                            });
                        }
                        else {
                            console.log("neither .txt nor .md file, cannot parse");
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
                else if (path.extname(oneFile) == '.md') {
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
                    console.log("neither .txt nor .md file, cannot parse");
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

// Accepts the name of a file as a string literal. Reads the file line by line and returns a object containing the file's contents.
function readBookFileTxt(filePath) {
    return new Promise(async (res, rej) => {
        const fileReadStream = readline.createInterface({input: fs.createReadStream(filePath),});

        var myBuffer = ""; // Buffer to hold lines read from the file.
        var title = "";
        var paragraph = "";
        var htmlBody = "";
        var counter = 0; // The number of consecutive empty lines found.

        var arr = new Array();

        let i = 0;
        for await (const line of fileReadStream)
        {
            {/*
            // If the line is NOT empty then append it to the buffer.
            if (line.length > 0) {
                if (myBuffer != "")
                {
                    // If 2 or more consecutive empty lines have been found and a title has NOT been set, then set the title.
                    if ((counter >= 2) && (title == "")) 
                    {
                        title = myBuffer;
                    }
                    // If 1 empty line was found, then end the current paragraph and append it to 'htmlBody'.
                    else if (counter == 1)
                    {
                        htmlBody += "<p>" + paragraph + "</p>";
                        paragraph = "";
                    }
                    // Otherwise, append the buffer's contents to the current paragraph.
                    else {
                        paragraph += myBuffer + "<br/>";
                    }
                }

                myBuffer = line;
                counter = 0;
            }
            // Otherwise, if it is empty, then increment 'counter'.
            else {
                counter++;
            }
            
            console.log(`${i}: buffer = ${myBuffer}\ntitle = ${title}\nparagraph = ${paragraph}\nbody = ${htmlBody}\n--------------\n\n`);
            i++;
            */}

            arr.push(line);
        }

        for (let i=0; i < arr.length; i++) {
            console.log(`arr[${i}]: ${arr[i]}`);
        }

        var htmlString = `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            <h1>${title}</h1>
            ${htmlBody}
        </body>
        </html>`;
        //console.log("**\n" + htmlString + "*******************\n");

        res(htmlString);
    });
}

// Accepts the contents of a file as a string literal. Creates an HTML file containing the content.
function writeBookFile(fileName, data) {
    return new Promise( (res, rej) => {
        var htmlFilePath = dist_path + "/" + getFileNameNoExt(fileName) + '.html';
        var body_str = "";
        // getting the error here commented out for now and used mine to test mine .md work
        /*for (let i = 0; i < data.paragraphs.length; i++) {
            if (i > 0) {
                body_str += "<br/>";
            }
            body_str += data.paragraphs[i];
        }
        */
        for (var line of data) {
			if (line !== '\n') {
				body_str += `<p>${line}</p>`;
			} else {
				body_str += '\n';
			}
		}
       // content = htmlTemplateStart + title + htmlTemplateMiddle;
        //content += htmlTemplateEnd;   

        const htmlStr =
            `<!doctype html>
            <html lang="en">
            <head>
            <meta charset="utf-8">
            <title>${data.title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
            <h1>${data.title}</h1>
            ${body_str}
            </body>
            </html>`;

        // Write the html file contents ('htmlStr') to the specified file path
        fs.writeFile(htmlFilePath, htmlStr, (err)=>{
            if (err) {
                console.log(err);
            }
            console.log('file created ' + fileName);
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
        console.log("File created");
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

// lab 2 work here
// made the changes on the above functions to make it work with the new lab 2 requirements
// fe bugs in the code, but it works for the most part
// please review my changes

//new function to deal with .md files

function  readBookFileMd(fileName) {
    return new Promise((res, rej) => {
        // create a read stream
        const fileReadStream = fs.createReadStream(fileName, 'utf8');
        // create an array to store the lines
        const array = [];
        // md pattern
        const mdPattern = /\*\*(.*)\*\*/g;
        // read the file line by line
        (async () => {
        for await (const line of fileReadStream)  {
            if (line != '') {
                do {
                    // match the pattern
                    var match = mdPattern.exec(line);
                    if (match) {
                        // push the match to the array
                        console.log(match[1]);
                        array.push(match[1]);
                    }
                } while (match);
            } else {
                // push the line to the array
                array.push(line);
            }
            }
        })();
        res(array);
    });
}