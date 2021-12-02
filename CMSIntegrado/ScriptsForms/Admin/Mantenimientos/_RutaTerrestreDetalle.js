


$(document).ready(function () {

    //ListarUsuarios();

    $("#btnNuevoProveedor").click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    });

    $("#btnCancelarProveedor").click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $("#btnNuevaFactura").click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    });


    $("#btnCancelar").click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $("#btnNuevaProducto").click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    });

    
    $("#btnCancelarProducto").click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $('#reveal-modal-bg2').trigger('reveal:close');
});

function EditarFactura(usuaId) {
    if (usuaId != null && usuaId != '') {
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Tarifa');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        //ShowPopUp('divPopup');
    }
}

function EliminarFactura(usuaNombre, usuaId) {
    confirm('¿Está seguro de eliminar la tarifa "' + usuaNombre + '"?', function (result) {
        if (result) {
            var idUsuario = { Usua_Id: usuaId };
            $.ajax({
                url: urlRaiz + "Usuario/EliminarUsuario",
                data: { idUsuario: JSON.stringify(idUsuario) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó la ruta "' + usuaNombre + '"', 'CHECK');
                        LimpiarPoppupUsuario();
                        ListarUsuarios();
                    }
                    else
                        alert('No se pudo eliminar la factura "' + usuaNombre + '" porque tiene dependencias', 'WARNING');
                },
                error: function (v) {
                    alert('No se pudo eliminar la ruta "' + usuaNombre + '"', 'ERROR');
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
