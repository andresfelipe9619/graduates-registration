const GENERAL_DB = "https://docs.google.com/spreadsheets/d/1fLFRTUrQ9mRUt0MPZ17wUAIWXhpq2Ah8l_mWhQsGUXQ/edit?usp=sharing"
const PROGRAMAS = "https://docs.google.com/spreadsheets/d/1JBq9HT1yLVKGmpiB6fpOc6Lf0kqoZBziya0M5_dTjbo/edit?usp=sharing"
const API_URL = "https://gentle-shore-15094.herokuapp.com/"

function doGet(request) {
    return HtmlService.createTemplateFromFile("index.html")
        .evaluate() // evaluate MUST come before setting the Sandbox mode
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

function getSheetFromSpreadSheet(url, sheet) {
    let Spreedsheet = SpreadsheetApp.openByUrl(url);
    if (url && sheet) return Spreedsheet.getSheetByName(sheet);
}

function getRawDataFromSheet(url, sheet) {
    let mSheet = getSheetFromSpreadSheet(url, sheet);
    if (mSheet) return mSheet.getSheetValues(1, 1, mSheet.getLastRow(), mSheet.getLastColumn());
}

function getPrograms() {
    let programsSheet = getRawDataFromSheet(PROGRAMAS, "PROGRAMAS")
    let programsObjects = sheetValuesToObject(programsSheet)
    // logFunctionOutput(getPrograms.name, programsObjects)
    return programsObjects
}

function getPeopleRegistered() {
    let peopleSheet = getRawDataFromSheet(GENERAL_DB, "INSCRITOS")
    let peopleObjects = sheetValuesToObject(peopleSheet)
    // logFunctionOutput(getPeopleRegistered.name, peopleObjects)
    return peopleObjects
}

function searchPerson(cedula) {
    let person = validatePerson(cedula)
    logFunctionOutput(searchPerson.name, person)
    return person
}

function registerPerson(person) {
    let inscritosSheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
    let headers = inscritosSheet.getSheetValues(1, 1, 1, inscritosSheet.getLastColumn())[0];
    person.push({ name: "hora_registro", value: new Date() })
    person.push({ name: "pago_comprobado", value: "NO" })

    logFunctionOutput('perosn', person)

    let personValues = objectToSheetValues(person, headers)
    let finalValues = personValues.map(function (value) {
        return String(value)
    })

    inscritosSheet.appendRow(finalValues)
    let result = { data: finalValues, ok: true }
    logFunctionOutput(registerPerson.name, result)
    return result;
}

function getSRAPerson(cedula) {

    let options = {
        'method': 'post',
        'contentType': 'application/x-www-form-urlencoded',
        'payload': 'cedula=' + cedula,
        'validateHttpsCertificates': false
    }
    let result = UrlFetchApp.fetch(API_URL, options).getContentText();
    logFunctionOutput(getSRAPerson.name, result)

    return result;
}

function getFacultiesAndPrograms() {
    let result = {
        faculties: null,
        programs: null
    }
    let programs = getPrograms()
    let lastPrograms = []
    let esta = false

    for (let program in programs) {
        for (let last in lastPrograms) {
            if (String(programs[program].nombre) === String(lastPrograms[last].nombre)) {
                esta = true
                break
            } else {
                esta = false
            }
        }
        if (!esta) {
            lastPrograms.push(programs[program])
        }
    }
    result.faculties = getFacultiesFromPrograms(programs)
    result.programs = lastPrograms
    //logFunctionOutput(getFacultiesAndPrograms.name, result)
    return result
}

function getFacultiesFromPrograms(programs) {
    let faculties = []
    for (let program in programs) {
        if (faculties.indexOf(programs[program].facultad) < 0) {
            Logger.log('FACULTAD QUE NO ESTA')
            Logger.log(programs[program].facultad)
            faculties.push(programs[program].facultad)
        }
    }

    return faculties
}

function validatePerson(cedula) {
    let inscritos = getPeopleRegistered();
    // let res = ""
    let result = {
        isRegistered: false,
        index: -1,
        data: null,
    };

    for (let person in inscritos) {
        if (String(inscritos[person].cedula) === String(cedula)) {
            result.isRegistered = true
            result.index = person
            result.data = inscritos[person]
        }
    }

    logFunctionOutput(validatePerson.name, result)

    if (result.index > -1) {
        return result
    } else {
        result.isRegistered = false
        return result
    }
}

function objectToSheetValues(object, headers) {
    let arrayValues = new Array(headers.length)
    let lowerHeaders = headers.map(function (item) {
        return item.toLowerCase()
    })

    Logger.log('HEADERS')
    Logger.log(lowerHeaders)
    Logger.log('OBJECT')
    Logger.log(object)
    for (let item in object) {
        for (let header in lowerHeaders) {
            if (String(object[item].name) == String(lowerHeaders[header])) {
                if (object[item].name == "nombres" || object[item].name == "apellidos") {
                    arrayValues[header] = object[item].value.toUpperCase()
                    Logger.log(arrayValues)
                } else {
                    arrayValues[header] = object[item].value
                    Logger.log(arrayValues)
                }
            }
        }
    }
    //logFunctionOutput(objectToSheetValues.name, arrayValues)
    return arrayValues
}

function getCurrentFolder(name, mainFolder) {
    //se crea la carpeta que va conener todos los docmuentos
    let nameFolder = "documentos";
    let FolderFiles,
        folders = mainFolder.getFoldersByName(nameFolder);
    if (folders.hasNext()) {
        FolderFiles = folders.next();
    } else {
        FolderFiles = mainFolder.createFolder(nameFolder);
    }

    // se crea la carpeta que va contener los documentos de cada inscrito
    let currentFolder,
        folders = FolderFiles.getFoldersByName(name);
    if (folders.hasNext()) {
        currentFolder = folders.next();
    } else {
        currentFolder = FolderFiles.createFolder(name);
    }

    return currentFolder;
}

function getMainFolder() {
    let dropbox = "Cena Gala";
    let mainFolder,
        folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
        mainFolder = folders.next();
    } else {
        mainFolder = DriveApp.createFolder(dropbox);
    }
    return mainFolder;
}

function createStudentFolder(numdoc, data) {
    //se crea la carpeta que va contener los arhivos actuales
    let result = {
        url: '',
        file: ''
    }
    let mainFolder = getMainFolder();
    let currentFolder = getCurrentFolder(numdoc, mainFolder);
    result.url = currentFolder.getUrl();

    let contentType = data.substring(5, data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7)),
        blob = Utilities.newBlob(bytes, contentType, file);

    let file = currentFolder.createFile(blob);
    file.setDescription("Subido Por " + numdoc);
    file.setName(numdoc + "_documento");
    result.file = file.getName();
    return result;
}

function generatePayment(index) {
    let inscritosSheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
    let headers = inscritosSheet.getSheetValues(1, 1, 1, inscritosSheet.getLastColumn())[0];
    let pagoIndex = headers.indexOf('PAGO_GENERADO')
    Logger.log(pagoIndex)
    Logger.log(index)
    logFunctionOutput(generatePayment.name, inscritosSheet.getRange(index, pagoIndex).getValues())
    inscritosSheet.getRange(index + 1, pagoIndex + 1).setValues([['SI']])
    return true
}

function sheetValuesToObject(sheetValues) {
    let headings = sheetValues[0].map(String.toLowerCase);
    let people = sheetValues.slice(1);
    let peopleWithHeadings = addHeadings(people, headings);

    function addHeadings(people, headings) {
        return people.map(function (personAsArray) {
            let personAsObj = {};

            headings.forEach(function (heading, i) {
                personAsObj[heading] = personAsArray[i];
            });

            return personAsObj;
        });
    }
    // logFunctionOutput(sheetValuesToObject.name, peopleWithHeadings)
    return peopleWithHeadings;
}

function logFunctionOutput(functionName, returnValue) {
    Logger.log("Function-------->" + functionName)
    Logger.log("Value------------>")
    Logger.log(returnValue)
    Logger.log("----------------------------------")
}

