var registro = 0;
var enter = 0;
var recuperarClave = false;
$(document).ready(function () {
    $('#txtUsuario').focus();
    //CargarSector();
    var $txtUsuario = $('#txtUsuario');
    var $txtContrasenia = $('#txtContrasenia');
    var $divRegistro = $('#divRegistro');
    var $divRecuperar = $('#divRecuperarCuenta');
    var $divLogin = $('#divLogin');
    var $RUC = $('#txtRUC');
    var $RazonSocial = $('#txtRazonSocial');
    var $Sector = $('#ddlSector');
    var $nombre = $('#txtNombre');
    var $apellidoPaterno = $('#txtAPaterno');
    var $apellidoMaterno = $('#txtAMaterno');
    var $telefono = $('#txtTelefono');
    var $correo = $('#txtEmail');
    var $contrasenia = $('#txtClave');
    var $confirmarContrasenia = $('#txtConfirmarClave');
    var $txtCodigoRecuperacion = $('#txtCodigoRecuperacion');
    var $correoRecuperacion = $('#txtCorreo');
    var $btnRegistrar = $("#btnRegistrar");
    var $btnEnviarCodigo = $("#btnEnviarCodigo");

    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (recuperarClave) {
                RecuperarClave();
            } else {
                Login();
            }
        }
    });

    $RUC.keypress(function () {
        var Ffin = document.getElementById('txtRUC');
        Ffin.maxLength = 11;
        return ValidarSoloNumeros(event);
    });
    $RUC.on('paste', function (e) {
        return false;
    });

    $btnRegistrar.click(function () {
        var email = $correo.val();
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (ValidarCamposUsuario() == false) {
            return false;
        } else if ($contrasenia.val() != $confirmarContrasenia.val()) {
            alert('Las contraseñas no coinciden, por favor verifique que las contraseñas coincidan.', 'WARNING');
            return false;
        } else if (!expr.test(email.trim())) {
            alert("El formato del correo " + email + " es incorrecto", "WARNING");
            return false;
        } else if ($RUC.val().length <= 10) {
            alert('El RUC de la empresa debe tener once caracteres.', 'WARNING')
            return false;
        }
        else {
            InsertarNuevoUsuario();
        }
    });


    //$('#lblRegistrarse').click(function () {
    //    console.log('aqui');
    //    location.href = "Seguridad/Registro.html";
    //})

    $('#lblRecuperarPass').click(function () {
        recuperarClave = true;
        $('#txtCorreo').val('');
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        $('#txtCorreo').focus();
    })

    $('#btnCancelarRegistro').click(function () {
        recuperarClave = false;
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $('#btnIngresar').click(function () {
        Login();
    });

    $('#btnEnviarCodigo').click(function () {
        RecuperarClave();
    });

    $('#btnCancelar').click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });
});

function Login() {
	location.href="Usuario.html";
	return;
    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    var usuario = $('#txtUsuario').val().trim();
    var contrasenia = $('#txtContrasenia').val().trim();
    if (usuario == '' && contrasenia == '') {
        alert('Introduzca correo electrónico y contraseña', "WARNING");
        return false;
    } else if (contrasenia == '') {
        alert('Introduzca contraseña', "WARNING");
        return false;
    } else if (usuario == '') {
        alert('Introduzca correo electrónico', "WARNING");
        return false;
    } else {
        if (!expr.test(usuario)) {
            alert("El formato del correo electrónico es incorrecto", 'WARNING');
            return false;
        } else {
            location.href="Mantenimiento.html";
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
        alert(mensaje, "WARNING");
    } else {
        EsValidado = true;
    }
}

function CampoObligatorio() {
    if ($('#txtNombresR').val() == "") {
        $('#txtNombresR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtApellidoPaternoR').val() == '') {
        $('#txtApellidoPaternoR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtApellidoMaternoR').val() == '') {
        $('#txtApellidoMaternoR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtEmailR').val() == '') {
        $('#txtEmailR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtContraseniaR').val() == '') {
        $('#txtContraseniaR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtConfirmarContraseniaR').val() == '') {
        $('#txtConfirmarContraseniaR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtNombreEmpresaR').val() == '') {
        $('#txtNombreEmpresaR').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtRUC').val() == '') {
        $('#txtRUC').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtFechaNacimientoR').val() == '') {
        $('#txtFechaNacimientoR').attr('class', 'CajaRequeridaLogin');
    }
}

function RecuperarClave() {
    var correo = $('#txtCorreo').val().trim();
    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (correo == '') {
        alert('Por favor ingrese correo.', 'WARNING');
    } else {
        if (!expr.test(correo)) {
            alert("El formato del correo " + correo + " es incorrecto", 'WARNING');
        } else {
            var recuperarClave = {
                Clie_Email: correo
            };

            $.ajax({
                url: urlRaiz + 'Cliente/RecuperarClaveCliente',
                data: { recuperarClave: JSON.stringify(recuperarClave) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (result) {
                    if (result == 1) {
                        alert('La contraseña ha sido enviada al correo electrónico.', 'CHECK', function () {
                            $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                        });
                    } else if (result == 2) {
                        alert('La contraseña no ha sido enviada al correo electrónico.', 'WARNING');
                    } else {
                        alert('Hubo un problema al verificar el usuario, por favor inténtelo mas tarde.', 'WARNING');
                    }
                },
                error: function (result) {
                    alert('Hubo un problema al verificar el usuario, por favor inténtelo mas tarde.', 'WARNING');
                },
                complete: function (result) {
                }
            });
        }
    }
}

function InsertarNuevoUsuario() {
    ShowLoader();
    var ddlSector = $('#ddlSector');
    var RUC = $('#txtRUC');
    var razonSocial = $('#txtRazonSocial');
    var nombre = $('#txtNombre');
    var apellidoPaterno = $('#txtAPaterno');
    var apellidoMaterno = $('#txtAMaterno');
    var txtTelefono = $('#txtTelefono');
    var correo = $('#txtEmail');
    var contrasenia = $('#txtClave');
    var confirmarContrasenia = $('#txtConfirmarClave');
    //var parametro = { Usua_Nombre: nombre.val().trim(), Usua_ApellidoPaterno: apellidoPaterno.val().trim(), Usua_ApellidoMaterno: apellidoMaterno.val().trim(), Usua_Email: correo.val().trim(), Usua_Clave: contrasenia.val().trim(), Usua_ClaveAlternativa: confirmarContrasenia.val().trim(), Usua_Activo: true, Empr_Ruc: RUC.val().trim(), Empr_RazonSocial: RazonSocial.val().trim() };
    var nuevoCliente = {
        Clie_Ruc: RUC.val().trim(),
        Clie_RazonSocial: razonSocial.val(),
        Clie_Sector_Id: ddlSector.val(),
        Clie_Nombres: nombre.val().trim(),
        Clie_ApellidoPaterno: apellidoPaterno.val().trim(),
        Clie_ApellidoMaterno: apellidoMaterno.val().trim(),
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
                alert('Se registró correctamente', 'CHECK', function () {
                    HidePopUp('divRegistro');
                    LimpiarCamposUsuario();
                    location.href = urlRaiz + "Simulador/Inicio/Simulaciones";
                });
            }
            else {
                alert('No se pudo regístrar el cliente "' + nombre + ' ' + apellidoPaterno + ' ' + apellidoMaterno + '"', 'WARNING');
            }
        },
        error: function (result) {
            alert('Error al regístrar el cliente');
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
            console.log(urlRaiz + "Admin/Tabla/ListarCombosTabla");
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