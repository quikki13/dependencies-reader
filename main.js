const {
    promises: fs
} = require("fs");
const excel = require('excel4node');

var filePath = "./source/package-lock.json";

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
worksheet.cell(1, 3).string('Url');
worksheet.cell(1, 4).string('Dependencies');


(async () => {
    const data = await getContent(filePath);
    obj = JSON.parse(data);
    await walk(obj.dependencies);
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
            worksheet.cell(cellNumber, 2).string(value.version);
            worksheet.cell(cellNumber, 3).string(value.resolved);
            if (value.requires) {
                var dependencies;
                var dependenciesArray = [];
                for (let resolverKeys = Object.keys(value.requires), j = 0, end = resolverKeys.length; j < end; j++) {
                    dependenciesArray.push(resolverKeys[j]);
                };
                dependenciesArray.forEach(function (element, keys) {
                    if (keys == 0) {
                        dependencies = element;
                    } else {
                        dependencies += " ," + element;
                    }
                });
                worksheet.cell(cellNumber, 4).string(dependencies);
            }else{
                worksheet.cell(cellNumber, 4).string("NA");
            }
            if (i == keys.length - 1) {
                resolve();
            }
        };
    });
};