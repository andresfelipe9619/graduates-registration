var GENERAL_DB = "https://docs.google.com/spreadsheets/d/1s4fI_h4lKP8TUW_3iVTLDxZQOyXCMNUhuRhM1C7bNOA/edit?usp=sharing"
var PROGRAMAS = "https://docs.google.com/spreadsheets/d/1JBq9HT1yLVKGmpiB6fpOc6Lf0kqoZBziya0M5_dTjbo/edit?usp=sharing"

function doGet(request) {
    return HtmlService.createTemplateFromFile('index')
        .evaluate();
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
}

function getSheetFromSpreadSheet(url, sheet) {
    var Spreedsheet = SpreadsheetApp.openByUrl(url);
    if (url && sheet) return Spreedsheet.getSheetByName(sheet);
}
function getRawDataFromSheet(url, sheet) {
    var mSheet = getSheetFromSpreadSheet(url, sheet);
    if (mSheet) return mSheet.getSheetValues(1, 1, mSheet.getLastRow(), mSheet.getLastColumn());
}

function getPrograms() {
    var programsSheet = getRawDataFromSheet(PROGRAMAS, "PROGRAMAS")
    var programsObjects = sheetValuesToObject(programsSheet)
    // logFunctionOutput(getPrograms.name, programsObjects)
    return programsObjects
}

function getPeopleRegistered() {
    var peopleSheet = getRawDataFromSheet(GENERAL_DB, "INSCRITOS")
    var peopleObjects = sheetValuesToObject(peopleSheet)
    logFunctionOutput(getPeopleRegistered.name, peopleObjects)
    return peopleObjects
}

function searchPerson(cedula) {
    var person = validatePerson(cedula)
    logFunctionOutput(searchPerson.name, person)
    return person
}

function registerPerson(person) {
    var inscritosSheet = getSheetFromSpreadSheet(GENERAL_DB, "INSCRITOS");
    var headers = inscritosSheet.getSheetValues(1, 1, 1, inscritosSheet.getLastColumn())[0];
    person.push({ name: "hora_registro", value: new Date() })
    person.push({ name: "comprobado", value: "NO" })
    var personValues = objectToSheetValues(person, headers)
    var finalValues = personValues.map(function (value) {
        return String(value)
    })
    inscritosSheet.appendRow(finalValues)
    var result = { data: finalValues, ok: true }
    logFunctionOutput(registerPerson.name, result)
    return result;
}

function getSRAPerson(cedula) {

    var options = {
        'method': 'post',
        'contentType': 'application/x-www-form-urlencoded',
        'payload': 'cedula=' + cedula,
        'validateHttpsCertificates': false
    }
    var result = UrlFetchApp.fetch('http://arzayus.co/egresados-script.php', options).getContentText();
    logFunctionOutput(getSRAPerson.name, result)

    return result;
}

function getFacultiesAndPrograms() {
    var result = {
        faculties: null,
        programs: null
    }
    var programs = getPrograms()
    var lastPrograms = []
    var esta = false

    for (var program in programs) {
        for (var last in lastPrograms) {
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
    var faculties = []
    for (var program in programs) {
        if (faculties.indexOf(programs[program].facultad) < 0) {
            Logger.log('FACULTAD QUE NO ESTA')
            Logger.log(programs[program].facultad)
            faculties.push(programs[program].facultad)
        }
    }

    return faculties
}

function validatePerson(cedula) {
    var inscritos = getPeopleRegistered();
    // var res = ""
    var result = {
        isRegistered: false,
        index: -1,
        data: null,
    };


    for (var person in inscritos) {
        Logger.log(cedula)
        logFunctionOutput(validatePerson.name, inscritos[person])

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
    var arrayValues = new Array(headers.length)
    var lowerHeaders = headers.map(function (item) {
        return item.toLowerCase()
    })

    Logger.log('HEADERS')
    Logger.log(lowerHeaders)
    Logger.log('OBJECT')
    Logger.log(object)
    for (var item in object) {
        for (var header in lowerHeaders) {
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

function sheetValuesToObject(sheetValues) {
    var headings = sheetValues[0].map(String.toLowerCase);
    var people = sheetValues.slice(1);
    var peopleWithHeadings = addHeadings(people, headings);

    function addHeadings(people, headings) {
        return people.map(function (personAsArray) {
            var personAsObj = {};

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

