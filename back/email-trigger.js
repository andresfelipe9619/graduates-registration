const SELECTED_PERSON = { data: null, type: null, isApproved: false, row: null };
// const today = new Date();
// const year = today.getFullYear();

function onSpreadSheetEdit(e) {
  Logger.log(JSON.stringify(e, null, 4));
  let range = e.range;
  Logger.log("value");
  Logger.log(range.getValue());
  Logger.log("column");
  Logger.log(range.getColumn());
  checkEditedCell(range);
}

function valueToString(value) {
  return value.toString();
}

function checkEditedCell(range) {
  if (!(range.getColumn() == 9)) return;
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let sheetValues = sheet.getSheetValues(
    range.getRow(),
    1,
    1,
    sheet.getLastColumn()
  );
  let valuesNextRow = sheet.getSheetValues(
    range.getRow() + 1,
    1,
    1,
    sheet.getLastColumn()
  );
  let rawPerson = sheetValues[0];
  let nextRow = valuesNextRow[0];
  Logger.log("range");
  Logger.log(rawPerson);
  rawPerson = rawPerson.map(valueToString);
  nextRow = nextRow.map(valueToString);
  if (!rawPerson) return;

  SELECTED_PERSON.row = range.getRow();
  SELECTED_PERSON.data = {
    cedula: rawPerson[2],
    nombre: rawPerson[0] + " " + rawPerson[1],
    email: rawPerson[3],
    pago_total: "100000",
    programa: rawPerson[5],
    dependecia: "Cena Egresados " + year,
    celular: rawPerson[4]
  };
  Logger.log("person");
  Logger.log(SELECTED_PERSON);
  let nextRowHasItems = !!(nextRow[0].length && nextRow[1].length);
  Logger.log("has items below?");
  Logger.log(nextRowHasItems);
  handleOnPaymentChange(range);
}

function handleOnPaymentChange(range) {
  SELECTED_PERSON.type = "PAY";
  if (range.getValue() == "SI") {
    Logger.log("Payment accepted");
    return sendAttendantPayApprovedMail();
  }
  Logger.log("Payment NOT accepted");
}

function getSheetFromSpreadSheet(url, sheet) {
  let Spreedsheet = SpreadsheetApp.openByUrl(url);
  if (url && sheet) return Spreedsheet.getSheetByName(sheet);
}

function sendAttendantPayApprovedMail() {
  Logger.log("Building Email...");
  let htmlBody = buildAttendantPayApprovedBody();
  let subject = "Confirmación de pago Asistente";
  sendEmail(subject, htmlBody);
}

function sendEmail(subject, body) {
  Logger.log("I like the way you french inhale");
  if (SELECTED_PERSON.data) {
    MailApp.sendEmail({
      to: SELECTED_PERSON.data.email,
      subject: subject,
      name: "Cena Egresados " + year,
      htmlBody: body
    });
  }
}

function getPersonQR() {
  let qrserver = "http://api.qrserver.com/v1/create-qr-code/";
  let qrimage =
    " " +
    "<strong>Su ID digital está aquí:</strong><br/>" +
    '<img src="' +
    qrserver +
    "?color=000000&amp;bgcolor=FFFFFF&amp;" +
    "data=" +
    SELECTED_PERSON.data.cedula +
    '&amp;qzone=1&amp;margin=0&amp;size=400x400&amp;ecc=L" alt="qr code" />';
  return qrimage;
}

function buildAttendantPayApprovedBody() {
  let body = "";
  let successMsg = getSuccessMessage();
  body = successMsg;
  let qr = getPersonQR();
  body = body.concat(qr);
  return body;
}

function getSuccessMessage() {
  return (
    "<p>Reciba de parte de la Universidad del Valle un cálido saludo. " +
    "Su transacción ha sido registrada exitosamente. Es un gusto contar con su asistencia a la Noche de Gala para Egresados " + year + ". Una oportunidad  para compartir e iniciar las festividades navideñas con la familia univalluna." +
    "<br/>" +
    '<br/> En este email adjuntaremos un código QR, por favor, preséntarlo en las <span style="text-decoration: underline"> mesas de registro</span> al ingreso del evento.' +
    "<br/>" +
    "<br/> Fecha: Viernes 06 de diciembre de " + year +
    "<br/> Hora: De 7:00 PM a 2:00 AM " +
    "<br/> Lugar: Hotel Dann Carlton Cali, Salón Ritz. " +
    "<br/>" +
    "<br/> Nos vemos pronto." +
    "<br/>" +
    "<br/> <strong>Equipo Organizador</strong>" +
    "<br/> <strong>Noche de Gala Egresados " + year + "</strong>" +
    "<br/> <strong>Universidad del Valle  </strong></p>"
  );
}