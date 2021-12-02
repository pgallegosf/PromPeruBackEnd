//cargarPerfil();

$(document).ready(function () {
    //ValidarAccesoGeneral();
    $('#txtNombre').focus();
    //ListarUsuarios();
    var $btnNuevoUsuario = $('#btnNuevo');
    var $btnGuardarUsuario = $('#btnGuardar');
    var $btnListarUsuario = $('#btnListarUsuario');
    var $txtFechaNacimiento = $('#txtFechaNacimiento');
    var $btnCancelar = $('#btnCancelar');
    var $idUsuario = $('#idUsuario');
    var $txtNombre = $('#txtNombre');
    var $txtAMaterno = $('#txtAMaterno');
    var $txtAPaterno = $('#txtAPaterno');

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

    $('#txtTelefono').keypress(function () {
        var Ffin = document.getElementById('txtTelefono');
        Ffin.maxLength = 9;
        return ValidarTelefono(event);
    });

    $('#txtTelefono').on('paste', function (e) {
        return false;
    });

    $txtFechaNacimiento.on('paste', function (e) {
        return false;
    });

    $('#txtNombre').keypress(function (event) {
        var Ffin = document.getElementById('txtNombre');
        Ffin.maxLength = 25;
        return ValidarSoloLetras(event);
    });

    $('#txtNombre').on('paste', function (e) {
        return false;
    });

    $('#txtAPaterno').keypress(function (event) {
        var Ffin = document.getElementById('txtAPaterno');
        Ffin.maxLength = 30;
        return ValidarSoloLetras(event);
    });

    $('#txtAPaterno').on('paste', function (e) {
        return false;
    });

    $('#txtAMaterno').keypress(function (event) {
        var Ffin = document.getElementById('txtAMaterno');
        Ffin.maxLength = 30;
        return ValidarSoloLetras(event);
    });

    $('#txtAMaterno').on('paste', function (e) {
        return false;
    });

    $btnNuevoUsuario.click(function () {
        LimpiarPoppupUsuario();
        //ShowPopUp('divPopup'); 

        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });

        $('#txtNombre').focus();
    })

    $btnGuardarUsuario.click(function () {
        var clave = $('#txtClave').val();
        var claveAlternativa = $('#txtConfirmarClave').val();
        var email = $('#txtEmail').val();

        var num = 0;
        expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (ValidarCamposUsuario() == false) {
            return;
        } 
        /* else if (clave.trim() != claveAlternativa.trim()) {
            alert('Las contraseñas no coinciden', 'WARNING');
        } */
        else if (!expr.test(email)) {
            alert("El formato del correo " + email + " es incorrecto", 'WARNING');
        } 
        /* else if ($('#txtClave').val() == '') {
            alert("Ingrese una contraseña.", 'WARNING');

        } else if ($('#txtConfirmarClave').val() == '') {
            alert("Ingrese confirmación de contraseña", 'WARNING');
        } */
        else if ($('#idUsuario').html() == '') {
            InsertarUsuario();
        } else {
            ActualizarUsuario();
        }
    })

    $('#txtNombre').keyup(function () {
        $('#usuario').html(1);
    });

    $('#txtAPaterno').keyup(function () {
        $('#usuario').html(1);
    });

    $('#txtAMaterno').keyup(function () {
        $('#usuario').html(1);
    });

    $('#txtEmail').keyup(function () {
        $('#usuario').html(1);
    });

    $('#txtTelefono').keyup(function () {
        $('#usuario').html(1);
    });

    $('#txtClave').keyup(function () {
        $('#usuario').html(1);
    });

    $('#txtConfirmarClave').keyup(function () {
        $('#usuario').html(1);
    });
});

function LimpiarPoppupUsuario() {
    $('#txtEmail').val('');
    $('#txtNombre').val('');
    $('#txtAPaterno').val('');
    $('#txtAMaterno').val('');
    $('#ddlPerfil').val(0);
    $('#txtTelefono').val('');
    $('#txtClave').val('');
    $('#txtConfirmarClave').val('');
    $('#idUsuario').html('');
    $('#txtNombre').focus();
    $('#chkActivo').prop('checked', 'checked');
    $('#btnGuardar').val('Registrar');
    $('#lblRegistro').html('Crear Usuario');
	$('#lblRegistrar').html('Registrar');
}

function InsertarUsuario() {
    ShowLoader();
    var usuarioActivo;
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
        usuarioActivo = true;
    }
    else {
        usuarioActivo = false;
    }

    var nuevoUsuario = {
        Usua_Nombres: nombre,
        /* Usua_ApellidoPaterno: apepat,
        Usua_ApellidoMaterno: apemat, */
        Usua_Email: email,
        /* Usua_Telefono: telefono,
        Usua_Clave: clave, */
        Perf_Id: perfil,
        Usua_Activo: usuarioActivo
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
                LimpiarPoppupUsuario();
                alert('Se guardó el usuario "' + nombre + ' ' + apepat + '  ' + apemat + '" correctamente', 'CHECK', function () {
                    LimpiarPoppupUsuario();
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
    alert('Se guardó el usuario "' + nombre + '" correctamente', 'CHECK', function () {
        LimpiarPoppupUsuario();
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        HidePopUp('divPopup');
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
    HideLoader();
}

function ActualizarUsuario() {
    ShowLoader();
    var usuarioActivo;
    var salida = false;
    var nombre = $('#txtNombre').val();
    var apepat = $('#txtAPaterno').val();
    var apemat = $('#txtAMaterno').val();
    var email = $('#txtEmail').val();
    var telefono = $('#txtTelefono').val();
    var clave = $('#txtClave').val();
    var perfil = $('#ddlPerfil').val();

    if ($('#chkActivo').prop('checked')) {
        usuarioActivo = true;
    }
    else {
        usuarioActivo = false;
    }

    var usuario = $('#idUsuario').html();

    var actualizarUsuario = {
        Usua_Id: usuario,
        Usua_Nombres: nombre,
        Usua_ApellidoPaterno: apepat,
        Usua_ApellidoMaterno: apemat,
        Usua_Email: email,
        Usua_Activo: usuarioActivo,
        Usua_Telefono: telefono,
        Usua_Clave: clave,
        Perf_Id: perfil
    };

    $.ajax({
        url: urlRaiz + "Usuario/ActualizarUsuario",
        data: { actualizarUsuario: JSON.stringify(actualizarUsuario) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v == "true") {
                salida = true;
                ListarUsuarios();
                alert('Se actualizó el usuario "' + nombre + ' ' + apepat + '  ' + apemat + '" correctamente', 'CHECK', function () {
                    LimpiarPoppupUsuario();
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

function EditarUsuario(usuaId) {
    if (usuaId != null && usuaId != '') {
        //SeleccionarUsuario(usuaId);
        $('#lblRegistrar').html('Actualizar');
        $('#lblRegistro').html('Actualizar Usuario');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        //ShowPopUp('divPopup');
    }
}

function EliminarUsuario(usuaNombre, usuaId) {
    confirm('¿Está seguro de eliminar al usuario "' + usuaNombre + '"?', function (result) {
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
                        LimpiarPoppupUsuario();
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


function ListarUsuarios() {
    grilla = new ccG_Objeto("gridUsuarios", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "RowNumber", false, 10, "left", "");
    grilla.AgregarColumna("Usuario", "NombreCompleto", [true, '%LIKE%', 'return ValidarSoloLetras(event);'], 35, "left", "");
    grilla.AgregarColumna("Correo", "Usua_Email", true, 25, "left", "");
    grilla.AgregarColumna("Teléfono", "Usua_Telefono", true, 10, "left", "");
    grilla.AgregarColumna("Estado", "Usua_ActivoDescripcion", [true, 'LIKE%', 'return ValidarSoloLetras(event);'], 10, "left", "");
    var btnEditar = "";
    var btnEliminar = "";
    if (editar) {
        btnEditar = '<a href="javascript:EditarUsuario(#Usua_Id);" title="Editar"><span class="fas fa-edit"></span></a>';
    }

    if (eliminar) {
        btnEliminar = '<a href="javascript:EliminarUsuario(\'#NombreCompleto\',#Usua_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>';
    }

    if (editar == true || eliminar == true) {
        grilla.AgregarColumna("", "", false, 10, "center", '<div class="accion-box">' + btnEditar + btnEliminar + '</div>');
    }
    grilla.ServicioUrl = urlRaiz + "Usuario/ListarUsuarioPaginado";
    grilla.Identificadores = "Usua_Id, NombreCompleto, Usua_Nombres";
    grilla.MinWidth = "400px";
    grilla.MaxWidth = "700px";
    grilla.Inicializar();
}

function ValidarCamposUsuario() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtNombre').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombres"
    }

    if ($('#txtAPaterno').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellido paterno"
    }

    if ($('#txtAMaterno').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Apellido materno"
    }

    if ($('#txtEmail').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Correo electrónico"
    }

    if ($('#ddlPerfil').val() == 0 || $('#ddlPerfil').val() == '' || $('#ddlPerfil').val() == null) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Perfil"
    }

    if ($('#txtClave').val() == '') {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Contraseña"
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
    $('#usuario').html(1);
}
