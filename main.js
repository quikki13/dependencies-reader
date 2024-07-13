"use strict";
exports.__esModule = true;

import { fs  }from '[fs]';
const excel = require('excel4node');

var filePath = "./source/package-shome.json";

var obj;

async function getContent(filePath, encoding = "utf-8") {
    if (!filePath) {
        throw new Error("filePath required");
    }
    return fs.readFile(filePath, {
        encoding
    });
}

// Create a new instance of a Workbook class
var workbook = new excel.Workbook();

// Add Worksheets to the workbook
var worksheet = workbook.addWorksheet('Sheet 1');
worksheet.cell(1, 1).string('Package Name');
worksheet.cell(1, 2).string('Version');


(async () => {
    const data = await getContent(filePath);
    obj = JSON.parse(data);
    objDep = {
        ...obj.dependencies,
        ...obj.devDependencies,
        ...obj.peerDependencies,
    }
    await walk(objDep);
    workbook.write('Excel.xlsx');
})();

async function walk(toWalk) {
    return new Promise((resolve, reject) => {
        for (let keys = Object.keys(toWalk), i = 0, end = keys.length; i < end; i++) {
            var key = keys[i],
                value = toWalk[key];
            // console.log("key:", key); // all the property names comes here
            // console.log("values:",value); //gives all the values of the key
            var cellNumber = i + 2;
            worksheet.cell(cellNumber, 1).string(key);
            worksheet.cell(cellNumber, 2).string(value);
            if (i == keys.length - 1) {
                resolve();
            }
        };
    });
};

const button = document.getElementById('upload');
button.addEventListener('onchange', function() {
    console.log('file')
})


function showFile(input) {
    let file = input.files[0];
  
    alert(`File name: ${file.name}`); // например, my.png
    alert(`Last modified: ${file.lastModified}`); // например, 1552830408824
  }