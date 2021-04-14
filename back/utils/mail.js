function sendEmail({ subject, body, person }) {
    Logger.log('I like the way you french inhale');
    Logger.log(person);
    if (!person) return;
    MailApp.sendEmail({
        to: person.correo,
        subject: subject,
        name: 'VIDEOCONFERENCIA EGRESADOS 2021',
        htmlBody: body,
    });
}

function sendRegistrationEmail({ person }) {
    const subject = "Registro Exitoso!";
    const body = `
    <div style="text-align:center">
        <h3>INSCRIPCIÓN</h3>
        <h3>VIDEOCONFERENCIA EGRESADOS 2021</h3>
        <p><strong>Fecha de Inscripcion:</strong> ${new Date()} </p>;
        <p><strong>Nombre Completo: </strong> ${person.nombres}  ${" "} ${person.apellidos} </p>
        <p><strong>CC: </strong>${person.cedula}</p>
        <p><strong>Email: </strong>${person.correo}</p>;
        <p><strong>Celular: </strong>${person.celular}</p>;
    </div>`
    return sendEmail({ person, subject, body })
}