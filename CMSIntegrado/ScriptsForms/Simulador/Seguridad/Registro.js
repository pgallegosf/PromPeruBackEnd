var registro = 0;
var enter = 0;
$(document).ready(function () {
    $('#txtRUC').focus();
    CargarSector();

    $(document).keypress(function (e) {
        if (e.which == 13) {
            Registrar();
        }
    });

    $('#txtRUC').keypress(function () {
        var Ffin = document.getElementById('txtRUC');
        Ffin.maxLength = 11;
        return ValidarSoloNumeros(event);
    });

    $('#txtRUC').on('paste', function (e) {
        return false;
    });

    $('#btnRegistrar').click(function () {
        Registrar();
        return false;
    });

    //$('#btnCancelarRegistro').click(function () {
    //    location.href = urlRaiz + "Simulador/Seguridad/Login";
    //});

    $("#btnTerminos").click(function () {
        var window_width = '800';
        var window_height = '650';
        var window_top = (screen.height - window_height) / 2;
        var window_left = (screen.width - window_width) / 2;
        window.open('Seguridad/TerminosCondiciones.html', 'Términos y condiciones', 'scrollbars=1, resizable = 1, width=' + window_width + ',height=' + window_height + ',top=' + window_top + ',left=' + window_left + '');
    });
});

function Registrar() {
    var email = $('#txtEmail').val();
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (ValidarCamposUsuario() != '') {
        alert(ValidarCamposUsuario(), "WARNING");
        return false;
    } else {
        if ($('#txtClave').val() != $('#txtConfirmarClave').val()) {
            alert('Las contraseñas no coinciden, por favor verifique que las contraseñas coincidan.', 'WARNING');
            return false;
        } else if (!expr.test(email.trim())) {
            alert("El formato del correo " + email + " es incorrecto", "WARNING");
            return false;
        } else if ($('#txtRUC').val().length <= 10) {
            alert('El RUC de la empresa debe tener once caracteres.', 'WARNING')
            return false;
        } else if ($('#chkAceptarTerminos').prop('checked') == false) {
            alert('Debe aceptar los términos y condiciones.', ' WARNING');
        }
        else {
            InsertarNuevoCliente();
        }
    }
}

function ValidarCamposUsuario() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtRUC').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- RUC"
    }
    if ($('#txtRazonSocial').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Razón Social"
    }
    if ($('#ddlSector').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Sector"
    }
    if ($('#txtNombre').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombres"
    }
    if ($('#txtAPaterno').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellido paterno"
    }
    if ($('#txtAMaterno').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellido materno"
    }
    if ($('#txtTelefono').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Teléfono"
    }
    if ($('#txtEmail').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Correo electrónico"
    }
    if ($('#txtClave').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Contraseña"
    }
    if ($('#txtConfirmarClave').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Confirmar contraseña"
    }

    if (mensaje != "") {
        mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
    } else {
        mensaje = "";
    }

    return mensaje;
}

function InsertarNuevoCliente() {
    ShowLoader();
    var ddlSector = $('#ddlSector');
    var RUC = $('#txtRUC');
    var razonSocial = $('#txtRazonSocial');
    var nombre = $('#txtNombre').val().trim();
    var apellidoPaterno = $('#txtAPaterno').val().trim();
    var apellidoMaterno = $('#txtAMaterno').val().trim();
    var txtTelefono = $('#txtTelefono');
    var correo = $('#txtEmail');
    var contrasenia = $('#txtClave');
    var confirmarContrasenia = $('#txtConfirmarClave');

    var nuevoCliente = {
        Clie_Ruc: RUC.val().trim(),
        Clie_RazonSocial: razonSocial.val(),
        Clie_Sector_Id: ddlSector.val(),
        Clie_Nombres: nombre,
        Clie_ApellidoPaterno: apellidoPaterno,
        Clie_ApellidoMaterno: apellidoMaterno,
        Clie_Telefono: txtTelefono.val().trim(),
        Clie_Email: correo.val().trim(),
        Clie_Clave: contrasenia.val().trim(),
    };


    $.ajax({
        url: urlRaiz + "Cliente/InsertarCliente",
        data: { nuevoCliente: JSON.stringify(nuevoCliente) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (result) {
            if (result > 0) {
                //alert('Su cuenta ha sido creada correctamente.', 'CHECK', function () {
                  //  LimpiarCamposUsuario();
                    location.href = urlRaiz + "Simulador/Seguridad/ConfirmacionRegistro/1";
                //});
            }
            else if (result < 0) {
                alert('Ya existe un cliente registrado con el correo ' + correo.val() + '.', 'WARNING');
            } else {
                alert('No fue posible regístrar la cuenta. Inténtelo nuevamente."' + nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno + '"', 'WARNING');
            }
        },
        error: function (result) {
            alert('No fue posible regístrar la cuenta. Inténtelo nuevamente.');
        }
    });
}

function LimpiarCamposUsuario() {
    $('#txtRUC').val('');
    $('#txtRazonSocial').val('');
    $('#ddlSector').val(0);
    $('#txtNombre').val('');
    $('#txtAPaterno').val('');
    $('#txtAMaterno').val('');
    $('#txtTelefono').val('');
    $('#txtEmail').val('');
    $('#txtClave').val('');
    $('#txtConfirmarClave').val('');
}

function CargarSector() {
    var tipo = 1;
    $.ajax({
        url: urlRaiz + "Admin/Tabla/ListarCombosTabla",
        data: { Tipo_Id: tipo },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (res) {
            var listaDatos = res[0];
            for (i = 0; i < listaDatos.length; i++) {
                var option = $(document.createElement('option'));
                option.text(listaDatos[i].Tabl_Nombre);
                option.val(listaDatos[i].Tabl_Id);
                $('#ddlSector').append(option);
            }
        },
        error: function () {
            alert("Error al seleccionar Sector");
        }
    });
}

