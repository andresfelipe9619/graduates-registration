const GENERAL_DB = "https://docs.google.com/spreadsheets/d/1fLFRTUrQ9mRUt0MPZ17wUAIWXhpq2Ah8l_mWhQsGUXQ/edit?usp=sharing";

const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

function normalizeString(value) {
  return String(value || '')
    .trim()
    .replace(/ +/g, '')
    .toLowerCase();
}

function getSheetFromSpreadSheet(sheet, url) {
  const Spreedsheet = SpreadsheetApp.openByUrl(url || GENERAL_DB);
  if (sheet) return Spreedsheet.getSheetByName(sheet);
  return null;
}

function getRawDataFromSheet(sheet, url) {
  const mSheet = getSheetFromSpreadSheet(sheet, url);
  if (mSheet) {
    return mSheet.getSheetValues(
      1,
      1,
      mSheet.getLastRow(),
      mSheet.getLastColumn()
    );
  }
  return null;
}

const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  return getSheets().map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

const addSheet = sheetTitle => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

const deleteSheet = sheetIndex => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

const setActiveSheet = sheetName => {
  SpreadsheetApp.getActive()
    .getSheetByName(sheetName)
    .activate();
  return getSheetsData();
};

function findText({ sheet, text }) {
  let index = -1;
  const textFinder = sheet.createTextFinder(text).matchEntireCell(true);
  const textFound = textFinder.findNext();
  if (!textFound) return { index, data: null };
  const row = textFound.getRow();
  index = row;
  const data = textFound;
  return { index, data };
}

function addHeadings(sheetValues, headings) {
  return sheetValues.map(row => {
    const sheetValuesAsObject = {};

    headings.forEach((heading, column) => {
      sheetValuesAsObject[heading] = row[column];
    });

    return sheetValuesAsObject;
  });
}

function addHeadings(sheetValues, headings) {
  return sheetValues.map(row => {
    const sheetValuesAsObject = {};

    headings.forEach((heading, column) => {
      sheetValuesAsObject[heading] = row[column];
    });

    return sheetValuesAsObject;
  });
}

function sheetValuesToObject(values, headers) {
  const headings = headers || values[0];
  let sheetValues = null;
  if (values) sheetValues = headers ? values : values.slice(1);
  const objectWithHeadings = addHeadings(sheetValues, headings.map(normalizeString));

  return objectWithHeadings;
}


function getHeadersFromSheet(sheet) {
  let headers = [];
  if (!sheet) return headers;
  [headers] = sheet.getSheetValues(1, 1, 1, sheet.getLastColumn());
  return headers;
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
