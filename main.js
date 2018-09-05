<script type="text/babel">
$(document)
    .ready(function() {
      $('.ui.form')
      .form({
        on: 'blur',
        fields: {
          nombres: {
            identifier  : 'nombres',
            rules: [
              {
                type   : 'text',
                prompt : 'Por favor ingrese un nombre valido'
              },
              {
                type   : 'empty',
                prompt : 'Por favor ingrese un nombre'
              }
              
            ]
          },
          apellidos: {
            identifier  : 'apellidos',
            rules: [
              {
                type   : 'text',
                prompt : 'Por favor ingreseun apellido valido'
              },
              {
                type   : 'empty',
                prompt : 'Por favor ingrese un apellido'
              }
            ]
          },
          cedula: {
            identifier  : 'cedula',
            rules: [
              {
                type   : 'number',
                prompt : 'Por favor ingrese un numero valido'
              },
              {
                type   : 'empty',
                prompt : 'Por favor ingrese un numero'
              }
            ]
          },
          email: {
            identifier  : 'email',
            rules: [
              {
                type   : 'email',
                prompt : 'Por favor ingrese a valid e-mail'
              },
              {
                type   : 'empty',
                prompt : 'Por favor ingrese a value'
              }
            ]
          },
          programa: {
            identifier  : 'programa',
            rules: [
              {
                type   : 'text',
                prompt : 'Por favor ingrese un programa valido'
              },
              {
                type   : 'empty',
                prompt : 'Por favor ingrese un programa'
              }
            ]
          },
          facultad: {
            identifier  : 'facultad',
            rules: [
              {
                type   : 'text',
                prompt : 'Por favor ingrese una facultad valido'
              },
              {
                type   : 'empty',
                prompt : 'Por favor ingrese una facultad'
              }
            ]
          },
        }
      })
    })
  ;


</script>

