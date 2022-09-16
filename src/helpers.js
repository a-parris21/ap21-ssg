import fs from 'fs';
import { path } from 'path';
import { readline } from 'readline';

export function genHtml(input_str)
{
    // Filepath for the output directory.
    const output_dir = makeDistFolder();


}

function genHtmlText()

function makeDistFolder() {
    const dist_path = '../dist';

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