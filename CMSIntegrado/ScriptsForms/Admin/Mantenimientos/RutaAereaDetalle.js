


$(document).ready(function () {

    //ListarUsuarios();
    const $seleccionArchivos = document.querySelector("#seleccionArchivo"),
    $imagenPrevisualizacion = document.querySelector("#imagenPrevisualizacion");
    // Escuchar cuando cambie
	$seleccionArchivos.addEventListener("change", () => {
        // Los archivos seleccionados, pueden ser muchos o uno
        const archivos = $seleccionArchivos.files;
        // Si no hay archivos salimos de la función y quitamos la imagen
        if (!archivos || !archivos.length) {
          $imagenPrevisualizacion.src = "";
          return;
        }
        // Ahora tomamos el primer archivo, el cual vamos a previsualizar
        const primerArchivo = archivos[0];
        // Lo convertimos a un objeto de tipo objectURL
        const objectURL = URL.createObjectURL(primerArchivo);
        // Y a la fuente de la imagen le ponemos el objectURL
        $imagenPrevisualizacion.src = objectURL;
      });
    $("#btnNuevoProveedor").click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    });

    $("#btnCancelarProveedor").click(function () {
        $('.reveal-modal-bg2').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $("#btnNuevaFactura").click(function () {
        $('#btnGuardar').html('<label>Registrar</label>');
        $('#lblRegistro').html('Crear Ruta');
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
   
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Ruta');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        //ShowPopUp('divPopup');
    
}

function EliminarFactura(usuaNombre, usuaId) {
    confirm('¿Está seguro de eliminar la ruta "' + usuaNombre + '"?', function (result) {
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
