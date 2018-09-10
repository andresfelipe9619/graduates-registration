var GENERAL_DB = "https://docs.google.com/spreadsheets/d/1s4fI_h4lKP8TUW_3iVTLDxZQOyXCMNUhuRhM1C7bNOA/edit?usp=sharing"
var PROGRAMAS = "https://docs.google.com/spreadsheets/u/1/d/1sJKpKS3B29hDRhpDsxevYcgAkwIKlS49F6-Ec7-fF5c/edit?usp=sharing_eip&ts=5b89b366"

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
    logFunctionOutput(getPrograms, programsObjects)
    return programsObjects
}

function getPeopleRegitered() {
    var peopleSheet = getRawDataFromSheet(GENERAL_DB, "INSCRITOS")
    var peopleObjects = sheetValuesToObject(peopleSheet)
    logFunctionOutput(getPeopleRegitered.name, peopleObjects)
    return peopleObjects
}

function searchPerson(cedula) {
    var person = validatePerson(cedula)

    logFunctionOutput(searchPerson.name, person)

    if (person.isRegitered) {
        return person
    } else {
        return null
    }

}

function registerPerson(person) {

}

function getFacultiesAndPrograms() {
    var result = {
        faculties: null,
        programs: null
    }
    result.programs = getPrograms()
    result.faculties = getFacultiesFromPrograms(result.programs)

    return result
}

function getFacultiesFromPrograms(programs) {
    var faculties = []
    for (var program in programs) {
        if (faculties.indexOf(programs[program].facultad) == -1){
            faculties.push(programs[program])
        }
    }

    return faculties
}



function validatePerson(cedula) {
    var inscritos = getPeopleRegitered();
    // var res = ""
    var result = {
        isRegitered: false,
        index: -1,
        data: null,
    };


    for (var person in inscritos) {
        Logger.log(cedula)
        logFunctionOutput(validatePerson.name, inscritos[person])

        if (String(inscritos[person].cedula) === String(cedula)) {
            result.isRegitered = true
            result.index = person
            result.data = inscritos[person]
        }
    }

    logFunctionOutput(validatePerson.name, result)

    if (result.index > -1) {
        return result
    } else {
        result.isRegitered = false
        return result
    }
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
    logFunctionOutput(sheetValuesToObject.name, peopleWithHeadings)
    return peopleWithHeadings;
}

function logFunctionOutput(functionName, returnValue) {
    Logger.log("Function-------->" + functionName)
    Logger.log("Value------------>")
    Logger.log(returnValue)
    Logger.log("----------------------------------")
}

