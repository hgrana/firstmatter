/**
 * 
 * Project Homestead
 * 
 * Sequence of creation:
 * Read files from ./homestead/content/
 * Edit each .html from each .json file
 * Save all in the index.html on ./
 * 
 */
'use strict'

// Import the File System library
const fs = require('fs');

let fileConfiguration;
const config = {
  folderToBuild: './homestead/content/',
  filePathToSave: './homestead/architecture/'
}

// Read the configuration file, this file must exist in order to continue.
try {
  fileConfiguration = JSON.parse(fs.readFileSync('./homestead/config.json'));
} catch (error) {
  console.error(error);
  throw error;
}

// Read the content and put it in the var
let contentPosts = [];
let filesToLoad = fs.readdirSync(config.folderToBuild);

try {
  console.log("[PROCESSING] Loading post files...");

  filesToLoad.forEach(file => {
    let wholeFile = JSON.parse(fs.readFileSync(config.folderToBuild + file));
    contentPosts.push(wholeFile);
  });
} catch (error) {
  console.error(error);
}

// Read the architecture and put it in the var
let architecture = {};
let filesToSave = fs.readdirSync(config.filePathToSave);

try {
  console.log("[PROCESSING] Loading architecture files...");

  filesToSave.forEach(file => {
    let wholeFile = fs.readFileSync(config.filePathToSave + file).toString().split("\n");

    architecture[file] = wholeFile;
  });
} catch (error) {
  console.error(error);
}

// Set all the content to the architecture
console.log("[RENDERING] Rendering the architecture with the posts...");

for (const key in architecture) {
  if (architecture.hasOwnProperty(key)) {
    try {
      architecture[key].forEach((line, lineIndex) => {
        if (line.indexOf("<stead>") > -1) {
          contentPosts.forEach(post => {
            fileConfiguration.steads.forEach(stead => {
              if (Array.isArray(post[stead])) {
                architecture[key].splice(lineIndex + 1, 0, post[stead].join("\n"));
              } else {
                architecture[key].splice(lineIndex + 1, 0, post[stead]);
              }
            });

            if (fileConfiguration.separator) architecture[key].splice(lineIndex + 1, 0, fileConfiguration.separatorContent);
          });
        }
      });

      // Output it to the final file
      try {
        console.log("[OUTPUT] Writing the content into the final file...");

        fs.writeFileSync('./' + key, architecture[key].join(''));
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

console.log("[FINISHED] Process finished.");