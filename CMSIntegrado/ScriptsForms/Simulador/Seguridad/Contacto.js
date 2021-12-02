$(document).ready(function () {
    $('#txtNombre').focus();
    CargarSector();
    var $btnNuevoSector = $('#btnNuevo');
    var $idContacto = $('#idContacto');

    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        }
    });

    $('#btnCancelar').click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $('#btnEnviar').click(function () {
        if (ValidarCamposSector() == false) {
            return;
        } else {
            var email = $('#txtCorreo').val();
            expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (!expr.test(email.trim())) {
                alert("El formato del correo " + email + " es incorrecto", "WARNING");
                return false;
            } else if ($('#txtRUC').val().length <= 10) {
                alert('El RUC de la empresa debe tener once caracteres.', 'WARNING')
                return false;
            }
            else {
                InsertarContacto();
            }
        }
    });

    $('#txtNombres').keypress(function () {
        return ValidarSoloLetras(event);
    });

    $('#txtApellidos').keypress(function () {
        return ValidarSoloLetras(event);
    });

    $('#txtRUC').keypress(function () {
        return ValidarSoloNumeros(event);
    });
    $('#txtMensaje').keydown(function (e) {
        if (e.keyCode == 17 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 46 || e.keyCode == 8) {
            return true;
        }
        n = $("#txtMensaje").val().length;
        if (n >= 500) {
            $("#txtCantidad").text(500);
            return false;
        } else {

            return true;
        }
    });
    $('#txtMensaje').keyup(function (e) {

        n = $("#txtMensaje").val().length;
        if (n > 500) {
            $("#txtMensaje").val($("#txtMensaje").val().substr(0, 500));
            $('#txtCantidad').text($("#txtMensaje").val().length);
        } else {
            $('#txtCantidad').text($("#txtMensaje").val().length);
        }
    });
    $("#txtMensaje").bind({
        paste: function () {

        },
        cut: function (x) {
            x
        }
    });
});

function LimpiarPoppupContacto() {
    $('#txtNombres').val('');
    $('#txtApellidos').val('');
    $('#txtRUC').val('');
    $('#ddlSector').val(0);
    $('#txtCorreo').val('');
    $('#txtMensaje').val('');
}

function InsertarContacto() {
    var salida = false;
    var nombres = $('#txtNombres').val().trim();
    var apellidos = $('#txtApellidos').val().trim();
    var ruc = $('#txtRUC').val().trim();
    var sector = $('#ddlSector').val();
    var correo = $('#txtCorreo').val().trim();
    var mensaje = $('#txtMensaje').val().trim();

    var nuevoContacto = {
        Cont_Nombres: nombres,
        Cont_Apellidos: apellidos,
        Cont_Ruc: ruc,
        Cont_Sector_Id: sector,
        Cont_Email: correo,
        Cont_Mensaje: mensaje
    };
    ShowLoader();
    $.ajax({
        url: urlRaiz + "Simulador/Contacto/InsertarContacto",
        data: { nuevoContacto: JSON.stringify(nuevoContacto) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v > 0) {
                salida = true;
                LimpiarPoppupContacto();
                //alert('Se envió correctamente.', 'CHECK', function () {
                //LimpiarPoppupContacto();
                location.href = urlRaiz + "Simulador/Seguridad/ConfirmacionRegistro/2";
                //location.href = urlRaiz + "Simulador/Seguridad/Login";
                //});
            } else {
                alert('No se pudo enviar, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo enviar.', 'ERROR')
            HideLoader();
        }
    });

    HideLoader();
}

function ValidarCamposSector() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtNombres').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombres"
    }

    if ($('#txtApellidos').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellidos"
    }

    if ($('#txtRUC').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- RUC"
    }

    if ($('#ddlSector').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Sector"
    }

    if ($('#txtCorreo').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Correo electrónico"
    }

    if ($('#txtMensaje').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Mensaje"
    }

    if (mensaje != "") {
        mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
        alert(mensaje, "WARNING");
    } else {
        EsValidado = true;
    }
    return EsValidado;
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