//cargarPerfil();

$(document).ready(function () {
    //ValidarAccesoGeneral();
    $('#txtNombre').focus();
    //ListarUsuarios();
    var $btnNuevoPerfil = $('#btnNuevo');
    var $btnGuardarPerfil = $('#btnGuardar');
    //var $btnListarPerfil = $('#btnListarPerfil');
    var $btnCancelar = $('#btnCancelar');
    var $idPerfil = $('#idPerfil');
    var $txtNombre = $('#txtNombre');

    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
            //ShowPopUp('divPopup');
        }
    });

    $btnCancelar.click(function () {
        //HidePopUp('divPopup');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });


    $('#txtNombre').keypress(function (event) {
        var Ffin = document.getElementById('txtNombre');
        Ffin.maxLength = 25;
        return ValidarSoloLetras(event);
    });

    $('#txtNombre').on('paste', function (e) {
        return false;
    });

    $btnNuevoPerfil.click(function () {
        LimpiarPoppupPerfil();
        //ShowPopUp('divPopup'); 

        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });

        $('#txtNombre').focus();
    })

    $btnGuardarPerfil.click(function () {
        var clave = $('#txtClave').val();
        var claveAlternativa = $('#txtConfirmarClave').val();
        var email = $('#txtEmail').val();

        var num = 0;
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (ValidarCamposPerfil() == false) {
            return;
        }
        else if ($('#idPerfil').html() == '') {
            InsertarPerfil();
        } else {
            ActualizarPerfil();
        }
    })

    $('#txtNombre').keyup(function () {
        $('#perfil').html(1);
    });
});

function LimpiarPoppupPerfil() {
    
    $('#txtNombre').val('');
    $('#idPerfil').html('');
    $('#txtNombre').focus();
    $('#chkActivo').prop('checked', 'checked');
    $('#btnGuardar').val('Registrar');
    $('#lblRegistro').html('Crear Perfil');
}

function InsertarPerfil() {
    ShowLoader();
    var perfilActivo;
    var Anulacion;
    var salida = false;
    var nombre = $('#txtNombre').val().trim();
    /* var apepat = $('#txtAPaterno').val().trim();
    var apemat = $('#txtAMaterno').val().trim(); */
    var email = $('#txtEmail').val();
    /* var telefono = $('#txtTelefono').val();
    var clave = $('#txtClave').val(); */
    var perfil = $('#ddlPerfil').val();

    if ($('#chkActivo').prop('checked')) {
        perfilActivo = true;
    }
    else {
        perfilActivo = false;
    }

    var nuevoPerfil = {
        Usua_Nombres: nombre,
        Perf_Id: perfil,
        Usua_Activo: perfilActivo
    };

    /* $.ajax({
        url: urlRaiz + "Usuario/InsertarUsuario",
        data: { nuevoUsuario: JSON.stringify(nuevoUsuario) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v == 2) {
                salida = true;
                ListarUsuarios();
                LimpiarPoppupPerfil();
                alert('Se guardó el usuario "' + nombre + ' ' + apepat + '  ' + apemat + '" correctamente', 'CHECK', function () {
                    LimpiarPoppupPerfil();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                    //HidePopUp('divPopup');
                });
            }
            else if (v == 1) {
                alert('El correo electrónico ya existe', 'WARNING');
                return;
            } else {
                alert('No se pudo guardar al usuario "' + nombre + '  ' + apepat + '  ' + apemat + '", por favor' + '<br>' + 'verifique que los datos sean correctos', 'WARNING');
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo guardar al usuario "' + nombre + '  ' + apepat + '  ' + apemat + '".', 'ERROR')
            HideLoader();
        }
    }); */
    alert('Se guardó el perfil "' + nombre + '" correctamente', 'CHECK', function () {
        LimpiarPoppupPerfil();
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        HidePopUp('divPopup');
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
    HideLoader();
}

function ActualizarPerfil() {
    ShowLoader();
    var perfilActivo;
    var salida = false;
    var nombre = $('#txtNombre').val();
    if ($('#chkActivo').prop('checked')) {
        perfilActivo = true;
    }
    else {
        perfilActivo = false;
    }

    var perfil = $('#idPerfil').html();

    var actualizarPerfil = {
        Usua_Id: perfil,
        Usua_Nombres: nombre,
        Usua_ApellidoPaterno: apepat,
        Usua_ApellidoMaterno: apemat,
        Usua_Email: email,
        Usua_Activo: perfilActivo,
        Usua_Telefono: telefono,
        Usua_Clave: clave,
        Perf_Id: perfil
    };

    $.ajax({
        url: urlRaiz + "Perfil/ActualizarPerfil",
        data: { actualizarPerfil: JSON.stringify(actualizarPerfil) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v == "true") {
                salida = true;
                ListarUsuarios();
                alert('Se actualizó el usuario "' + nombre + ' ' + apepat + '  ' + apemat + '" correctamente', 'CHECK', function () {
                    LimpiarPoppupPerfil();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                    //HidePopUp('divPopup');
                });
            }
            else if (v == "1") {
                alert('Se ha excedido en el número de caracteres, por favor verifique los datos ingresados', 'WARNING');
            } else {
                alert('No se pudo actualizar al usuario "' + nombre + '  ' + apepat + '  ' + apemat + '", por favor' + '<br>' + 'verifique que los datos sean correctos', 'WARNING');
            }
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo actualizar usuario "' + nombre + '  ' + apepat + '  ' + apemat + '"', 'ERROR')
            HideLoader();
        },
        complete: function (res) {
            HideLoader();
        }
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
}

function EditarPerfil(usuaId) {
    if (usuaId != null && usuaId != '') {
        //SeleccionarUsuario(usuaId);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Perfil');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        //ShowPopUp('divPopup');
    }
}

function EliminarPerfil(usuaNombre, usuaId) {
    confirm('¿Está seguro de eliminar al perfil "' + usuaNombre + '"?', function (result) {
        if (result) {
            var idUsuario = { Usua_Id: usuaId };
            $.ajax({
                url: urlRaiz + "Usuario/EliminarUsuario",
                data: { idUsuario: JSON.stringify(idUsuario) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó el usuario "' + usuaNombre + '"', 'CHECK');
                        LimpiarPoppupPerfil();
                        ListarUsuarios();
                    }
                    else
                        alert('No se pudo eliminar el usuario "' + usuaNombre + '" porque tiene dependencias', 'WARNING');
                },
                error: function (v) {
                    alert('No se pudo eliminar el usuario "' + usuaNombre + '"', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    //HidePopUp('divPopup');
}

function SeleccionarUsuario(usuaId) {
    ShowLoader();
    $('#idUsuario').html(usuaId);

    var usuarioSeleccionado = { Usua_Id: usuaId };
    $.ajax({
        url: urlRaiz + "Usuario/SeleccionarUsuario",
        data: { usuarioSeleccionado: JSON.stringify(usuarioSeleccionado) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (s) {
            console.log(s);
            $('#txtEmail').val(s.Usua_Email);
            $('#txtNombre').val(s.Usua_Nombres);
            $('#txtAPaterno').val(s.Usua_ApellidoPaterno);
            $('#txtAMaterno').val(s.Usua_ApellidoMaterno);
            $('#ddlPerfil').val(s.Perf_Id);
            $('#txtTelefono').val(s.Usua_Telefono);
            $('#txtClave').val(s.Usua_Clave);
            $('#txtConfirmarClave').val(s.Usua_Clave);

            if (s.Usua_Activo) {
                $('#chkActivo').prop('checked', 'checked');
            } else {
                $('#chkActivo').prop('checked', '');
            }
            $('#txtNombre').focus();
        },
     
        complete: function () {
            HideLoader();
        }
    });
}


function ListarPerfiles() {
}

function ValidarCamposPerfil() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtNombre').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombres"
    }
    if (mensaje != "") {
        mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
        alert(mensaje, "WARNING");
    } else {
        EsValidado = true;
    }
    return EsValidado;
}

function cargarPerfil() {
    var tipo = 1;
    $.ajax({
        url: urlRaiz + "Perfil/ListarPerfilPaginado",
        data: { filter: 'Perf_Activo = 1 ', sorting: '', pageNumber: 1, pageSize: 0 },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (res) {
            console.log(res);
            var listaDatos = res;
            for (i = 0; i < listaDatos.length; i++) {
                var option = $(document.createElement('option'));
                option.text(listaDatos[i].Perf_Nombre);
                option.val(listaDatos[i].Perf_Id);
                $('#ddlPerfil').append(option);
            }
        },
        error: function () {
            alert("Error al cargar los perfiles.", "WARNING");
            HideLoader();
        },
        complete: function () {
            HideLoader();
        }
    });
}

function modificacion() {
    $('#perfil').html(1);
}
