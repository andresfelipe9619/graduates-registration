const PROGRAMAS = "https://docs.google.com/spreadsheets/d/1JBq9HT1yLVKGmpiB6fpOc6Lf0kqoZBziya0M5_dTjbo/edit?usp=sharing";
const API_URL = "https://gentle-shore-15094.herokuapp.com/";

function doGet(request) {
    return HtmlService.createTemplateFromFile("index.html")
        .evaluate() // evaluate MUST come before setting the Sandbox mode
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent();
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
    const options = {
        'method': 'post',
        'contentType': 'application/x-www-form-urlencoded',
        'payload': 'cedula=' + cedula,
        'validateHttpsCertificates': false
    }
    const result = UrlFetchApp.fetch(API_URL, options).getContentText();
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

export function getPeopleRegisteredSheet() {
    const sheet = global.getSheetFromSpreadSheet('COMMENTS');
    const headers = global.getHeadersFromSheet(sheet);
    return { sheet, headers };
}

function validatePerson(cedula) {
    let { sheet, headers } = getPeopleRegisteredSheet();
    let result = {
        isRegistered: false,
        index: -1,
        data: null,
    };
    const { index } = global.findText({ sheet, text: cedula });
    result.index = index;
    logFunctionOutput(validatePerson.name, result)
    if (result.index === -1) {
        result.isRegistered = false
        return result;
    }
    const entityRange = sheet.getSheetValues(
        +index,
        1,
        1,
        sheet.getLastColumn()
    );
    Logger.log(`${cedula} Range: ${entityRange.length}`);
    Logger.log(entityRange);
    const [entityData] = global.sheetValuesToObject(entityRange, headers);
    Logger.log(`${cedula} Data:`);
    Logger.log(entityData);
    result.isRegistered = true
    result.data = entityData
    return result
}

function getEntityData(entity) {
    const rawEntities = global.getRawDataFromSheet(entity);
    const entities = global.sheetValuesToObject(rawEntities);
    return entities;
}

function getPrograms() {
    return getEntityData('PROGRAMAS');
}

function getPeopleRegistered() {
    return getEntityData('INSCRITOS');
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

function logFunctionOutput(functionName, returnValue) {
    Logger.log("Function-------->" + functionName)
    Logger.log("Value------------>")
    Logger.log(returnValue)
    Logger.log("----------------------------------")
}

