var registro = 0;
var enter = 0;
var recuperarClave = false;
$(document).ready(function () {
    $('#txtUsuario').focus();
    var $txtUsuario = $('#txtUsuario');
    var $txtContrasenia = $('#txtContrasenia');
    var $divRegistro = $('#divRegistro');
    var $divRecuperar = $('#divRecuperarCuenta');
    var $divLogin = $('#divLogin');
    var $nombre = $('#txtNombresR');
    var $apellidoPaterno = $('#txtApellidoPaternoR');
    var $apellidoMaterno = $('#txtApellidoMaternoR');
    var $correo = $('#txtEmailR');
    var $contrasenia = $('#txtContraseniaR');
    var $confirmarContrasenia = $('#txtConfirmarContraseniaR');
    var $empresa = $('#txtNombreEmpresaR');
    var $RUC = $('#txtRuc');
    var $RazonSocial = $('#txtNombreEmpresaR');
    var $txtEmailR = $('#txtEmailR');
    var $txtCorreo = $('#txtCorreo');
    var $txtCodigoRecuperacion = $('#txtCodigoRecuperacion');
    var $btnRegistrar = $("#btnRegistrar");
    var $lblmensaje = $('#lblmensaje');
    var $txtNuevoPass = $('#txtNuevoPass');
    var $txtConfirmarPass = $('#txtConfirmarPass');
    var $lblNuevoUsuario = $('#lblNuevoUsuario');

    $(document).keypress(function (e) {
        if (e.which == 13) {
            if (recuperarClave) {
                RecuperarClave();
            } else {
                Login();
            }
        }
    });

    $lblNuevoUsuario.click(function () {
        $divRegistro.show();
        $divLogin.hide();
        enter = 0;
        $txtUsuario.val('');
        $txtContrasenia.val('');
    });

    $RUC.keypress(function () {
        var Ffin = document.getElementById('txtRuc');
        Ffin.maxLength = 11;
        return ValidarSoloNumeros(event);
    });
    $RUC.on('paste', function (e) {
        return false;
    });

    $btnRegistrar.click(function () {
        var email = $correo.val();


        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ($nombre.val() == "" || $apellidoPaterno.val() == "" || $apellidoMaterno.val() == "" || $correo.val() == "" || $contrasenia.val() == "" || $confirmarContrasenia.val() == "" ||
            $RazonSocial.val() == "" || $RUC.val() == "") {
            CampoObligatorio();
            ValidarCamposUsuario();
        } else if ($contrasenia.val() != $confirmarContrasenia.val()) {
            alert('Las contraseñas no coinciden, por favor verifique que las contraseñas coincidan.', 'WARNING');
        } else if (!expr.test(email.trim())) {
            alert("El formato del correo " + email + " es incorrecto", "WARNING");
        } else if ($RUC.val().length <= 10) {
            alert('El ruc de la empresa debe tener once caracteres.', 'WARNING')
        }
        else {
            ShowLoader();
            //InsertarNuevoUsuario();
        }
    });

    $('#lblRecuperarPass').click(function () {
        recuperarClave = true;
        $('#txtCorreo').val('');
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        $('#txtCorreo').focus();
    });

    $('#btnIngresarCodigo').click(function () {
        $('#lblayuda').hide();
        $txtCorreo.hide();
        $txtCodigoRecuperacion.show();
        $txtNuevoPass.show();
        $txtConfirmarPass.show();
        $('#btnEnviarCodigo').hide();
        $('#btnIngresarCodigo').hide();
        $('#btnIngresar').show();
    });

    $('#btnIngresar').click(function () {
        Login();
    });

    $('#btnEnviarCodigo').click(function () {
        RecuperarClave();
    });

    $('#btnCancelar').click(function () {
        recuperarClave = false;
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        $('#txtCorreo').val('');
    });

    $txtUsuario.click(function () {
        $lblmensaje.hide();
    });

    $txtContrasenia.click(function () {
        $lblmensaje.hide();
    })

    $('#btnCancelarR').click(function () {
        $divRegistro.hide();
        $divLogin.show();
        $nombre.val('').attr('class', 'texto1');
        $apellidoPaterno.val('').attr('class', 'texto1');
        $apellidoMaterno.val('').attr('class', 'texto1');
        $correo.val('').attr('class', 'texto1');
        $contrasenia.val('').attr('class', 'texto1');
        $confirmarContrasenia.val('').attr('class', 'texto1');
        $RazonSocial.val('').attr('class', 'texto1');
        $RUC.val('').attr('class', 'texto1');
    });
});

function Login() {

    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    var usuario = $('#txtUsuario').val().trim();
    var contrasenia = $('#txtContrasenia').val().trim();
    if (usuario == '' && contrasenia == '') {
        alert('Introduzca correo electrónico y contraseña', "warning");
        return false;
    } else if (contrasenia == '') {
        alert('Introduzca contraseña', "warning");
        return false;
    } else if (usuario == '') {
        alert('Introduzca correo electrónico', "warning");
        return false;
    } else {
        if (!expr.test(usuario)) {
            alert("El formato del correo electrónico es incorrecto", 'ERROR');
            return false;
        } else {
            ShowLoader();
            $.ajax({
                url: urlRaiz + "Admin/Seguridad/Autenticar",
                data: { usuario: usuario.trim(), clave: contrasenia },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (result) {
                    if (result == 1) {
                        alert('Usuario o contraseña incorrectos.', 'ERROR');
                        return false;
                    } else if (result == 2) {
                        location.href = urlRaiz + "Admin/Inicio/Index";
                        //HelperCargarVista(urlRaiz + "Inicio/Index");
                    }
                    else if (result == 3) {
                        alert('La contraseña es incorrecta', 'WARNING');
                        return false;
                    } else if (result == 0) {
                        alert('No se puede loguear al usuario "' + usuario + '"', 'ERROR');
                        return false;
                    } else if (result == 4) {
                        alert('El usuario "' + usuario + '" no tiene permitido el ingreso, por favor <br> comuníquese con el administrador.', 'WARNING');
                        return false;
                    }
                },
                error: function (result) {
                    console.log('111');
                    HideLoader();
                },
                complete: function (result) {
                    console.log('222');
                    HideLoader();
                }
            });
        }
    }

}

function ValidarCamposUsuario() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtNombresR').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombres"
    }
    if ($('#txtApellidoPaternoR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellido paterno"
    }
    if ($('#txtApellidoMaternoR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellido materno"
    }
    if ($('#txtEmailR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Correo electrónico"
    }
    if ($('#txtContraseniaR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Contraseña"
    }
    if ($('#txtConfirmarContraseniaR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Confirmar contraseña"
    }
    if ($('#txtNombreEmpresaR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombre de la empresa"
    }
    if ($('#txtRuc').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- RUC"
    }
    if ($('#txtFechaNacimientoR').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Fecha de nacimiento"
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
    if ($('#txtRuc').val() == '') {
        $('#txtRuc').attr('class', 'CajaRequeridaLogin');
    }
    if ($('#txtFechaNacimientoR').val() == '') {
        $('#txtFechaNacimientoR').attr('class', 'CajaRequeridaLogin');
    }
}

function colorNormal(este) {
    $('#' + este).attr('class', 'texto1');
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
                Usua_Email: correo
            };
            console.log(recuperarClave);
            $.ajax({
                url: urlRaiz + 'Admin/Usuario/RecuperarClaveUsuario',
                data: { recuperarClave: JSON.stringify(recuperarClave) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (result) {
                    if (result == 1) {
                        alert('La contraseña ha sido enviada al correo electrónico.', 'CHECK', function () {
                            $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                        });

                    } else if (result == 0) {
                        alert('La contraseña no ha podido ser enviada, por favor verifique el correo ingresado.', 'WARNING');
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
