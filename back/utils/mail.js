function sendEmail({ subject, body, person }) {
    Logger.log('I like the way you french inhale');
    Logger.log(person);
    if (!person) return;
    MailApp.sendEmail({
        to: person.correo,
        subject: subject,
        name: 'NOCHE DE GALA EGRESADOS ' + year,
        htmlBody: body,
    });
}

function sendRegistrationEmail({ person }) {
    const subject = "Registro Exitoso!";
    const body = `
    <div style="text-align:center">
        <h3>INSCRIPCIÓN NOCHE DE GALA EGRESADOS 2022</h3>
        <p>Su inscripción a la Noche de Gala para Egresados 2022 se ha realizado satisfactoriamente. Usted cuenta con 48 horas  para realizar el pago, de lo contrario su cupo será liberado. Una vez efectuado el pago, la Universidad del Valle validará el mismo y se enviará al correo electrónico registrado, un código QR para ingreso al evento. Cualquier inquetud no dude en comunicarse con nosotros al correo soyegresado@correounivalle.edu.co </p>
        <hr />
        <h3>INFORMACIÓN DEL EVENTO</h3>
        Fecha: Viernes 25 de Noviembre de `+year+`
        <br>Hora: De 7:00 PM a 2:00 AM
        <br>Lugar: Club Farallones Cali, Avenida El Banco - Parcelación Alférez Real - Carrera 127 Pance.
        <hr />
        <h3>INFORMACIÓN DE LA INSCRIPCIÓN</h3>
        <p><strong>Fecha de Inscripcion:</strong> ${new Date()} </p>
        <p><strong>Nombre Completo: </strong> ${person.nombres}  ${" "} ${person.apellidos} </p>
        <p><strong>CC: </strong>${person.cedula}</p>
        <p><strong>Email: </strong>${person.correo}</p>
        <p><strong>Celular: </strong>${person.celular}</p>
        <hr />
    </div>
    <p></p>
    <strong>Coordinación Área de Egresados
    <br>Vicerrectoría de Extensión y Proyección Social
    <br>Universidad del Valle</strong>`
    return sendEmail({ person, subject, body })
}