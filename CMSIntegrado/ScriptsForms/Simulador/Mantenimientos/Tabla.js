$(document).ready(function () {
    ShowLoader();
    $('#txtDescripcion').focus();
    ListarTablaTipo();
    ListarTablaTipoDetallePaginado();

    $(document).keyup(function (event) {
        if (event.which == 27) {
            HidePopUp('divPopup');
        }
    });

    var $ddlTablaTipo = $('#ddlTablaTipo');
    var $btnNuevaTablaDetalle = $('#btnNuevo');
    var $btnGuardarTablaDetalle = $('#btnGuardar');
    var $btnCancelar = $('#btnCancelar');
    var $btnEliminar = $('#btnEliminar');
    var $btnListarTablaDetalle = $('#btnListarTablaDetalle');
    var $txtDescripcion = $('#txtDescripcion');
    var $idTablatd = $('#idTablatd');
    var $txtAbreviatura = $('#txtAbreviatura');
    var $txtComentario = $('#txtComentario');
    var $chkEstado = $('#chkEstado');

    $btnGuardarTablaDetalle.click(function () {
        var mensaje = "";
        if ($('#ddlTablaTipo').val() == 0) mensaje += (mensaje == "" ? "" : "<br />") + "- Tipo"
        if ($('#txtDescripcion').val().trim() == "") mensaje += (mensaje == "" ? "" : "<br />") + "- Nombre"
        if (mensaje.trim() == "") {
            if ($idTablatd.html() == '') {
                InsertarTablaTipoDetalle();
            } else {
                ActualizarTablaTipoDetalle();
            }
        } else {
            mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
            alert(mensaje, "WARNING");
            return false;
        }
    });

    $btnListarTablaDetalle.click(function () {
        $('#txtDescripcion').focus();
        ListarTablaTipoDetallePaginado();
        ShowPopUp('divPopup');
    });

    $btnCancelar.click(function () {
        $('#txtDescripcion').focus();
        HidePopUp('divPopup');
    });

    $btnNuevaTablaDetalle.click(function () {
        LimpiarPoppupTablaTipoDetalle();
        ShowPopUp('divPopup');
        $('#txtDescripcion').focus();
    });

    $btnEliminar.click(function () {
        $('#txtDescripcion').focus();
        if ($idTablatd.html() != 0 && $idTablatd.html() != '') {
            EliminarTablaTipoDetalle($idTablatd.html(), $txtDescripcion.val());
        } else {
            alert('No ha seleccionado un tipo de detalle', 'WARNING')
        }
    });


    $('#txtDescripcion').keypress(function (event) {
        var Ffin = document.getElementById('txtDescripcion');
        Ffin.maxLength = 100;
        return ValidarSoloLetras(event);
    });

    $('#txtDescripcion').on('paste', function (e) {
        return false;
    });

    $('#txtAbreviatura').keypress(function (event) {
        var Ffin = document.getElementById('txtAbreviatura');
        Ffin.maxLength = 4;
        return ValidarSoloLetras(event);
    });

    $('#txtAbreviatura').on('paste', function (e) {
        return false;
    });

    $('#txtDescripcion').keyup(function () {
        $('#tablatipo').html(1);
    });

    $('#txtAbreviatura').keyup(function () {
        $('#tablatipo').html(1);
    });

    $('#txtComentario').keyup(function () {
        $('#tablatipo').html(1);
    });
});

function ListarTablaTipoDetallePaginado() {
    grilla = new ccG_Objeto("gridTablastd", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "RowNumber", false, 8, "left", "");
    grilla.AgregarColumna("Tipo", "Tipo_Nombre", [true, '%LIKE%', 'return ValidarSoloLetras(event);'], 30, "left", "");
    grilla.AgregarColumna("Nombre", "Tabl_Nombre", true, 10, "left", "");
    grilla.AgregarColumna("Abreviatura", "Tabl_Abreviatura", true, 10, "left", "");
    grilla.AgregarColumna("Estado", "Tabl_ActivoDescripcion", [true, 'LIKE%', 'return ValidarSoloLetras(event);'], 10, "left", "");
    var btnEditar = "<button onclick='EditarTablaTipoDetalle(#Tabl_Id);' title='Editar'><span class='icon-pencil'></span></button>";
    var btnEliminar = "<button onclick='EliminarTablaTipoDetalle(#Tabl_Id,\"#Tabl_Nombre\");' title='Eliminar'><span class='icon-cross'></span></button>";
    grilla.AgregarColumna("", "", false, 10, "center", '<div style="min-width:70px">' + btnEditar + btnEliminar + '</div>');
    grilla.ServicioUrl = urlRaiz + "TablaTipoDetalle/ListarTablaTipoDetallePaginado";
    grilla.Identificadores = "Tabl_Id,Tipo_Id,Tabl_Nombre";
    grilla.MinWidth = "400px";
    grilla.Inicializar();
}

function LimpiarPoppupTablaTipoDetalle() {
    $('#tablatipo').html(0);
    $('#idTablatd').html('');
    $('#ddlTablaTipo').val(0);
    $('#txtDescripcion').val('');
    $('#txtAbreviatura').val('');
    $('#txtComentario').val('');
    $('#chkEstado').val(0);
    $('#txtDescripcion').focus();
}

function NuevaTablaTipoDetalle() {
    $('#gestionTablatd').html("Nueva tabla");
    ShowPopUp('divPopup');
}


$('#chkEstado').change(function () {
    $('#tablatipo').html(1);
});

function InsertarTablaTipoDetalle() {
    var tablatdActivo;

    var salida = false;
    if ($('#chkEstado').is(':checked')) {
        tablatdActivo = true;
    }
    else {
        tablatdActivo = false;
    }

    var tablatipo = $('#ddlTablaTipo').val();
    var nombre = $('#txtDescripcion').val();
    var abreviatura = $('#txtAbreviatura').val();
    var comentario = $('#txtComentario').val();

    var tablatdNueva = { Tipo_Id: tablatipo, Tabl_Nombre: nombre, Tabl_Abreviatura: abreviatura, Tabl_Comentario: comentario, Tabl_Activo: tablatdActivo };
    var marca = $("#ddlTablaTipo option:selected").html();

    $('#txtDescripcion').focus();
    $.ajax({
        url: urlRaiz + "TablaTipoDetalle/InsertarTablaTipoDetalle",
        data: { tablatd: JSON.stringify(tablatdNueva) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v == 0) {
                alert('No se pudo guardar la tabla tipo detalle"' + nombre + '", por favor' + '<br>' + 'verifique que los datos sean correctos', 'WARNING');
            }
            else if (v == 1) {
                salida = true;
                alert('Se creó la tabla tipo detalle "' + nombre + '" correctamente', 'CHECK', function () {
                    ListarTablaTipoDetallePaginado();
                    LimpiarPoppupTablaTipoDetalle();
                    HidePopUp('divPopup');
                });
            } else if (v == 2) {
                alert('La tabla tipo detalle "' + nombre + '" ya existe', 'WARNING');
            } else if (v == 3) {
                alert('La abreviatura "' + abreviatura + '" ya existe', 'WARNING');
            }
            else {
                alert('No se pudo crear la tabla tipo detalle "' + nombre + '"', 'WARNING')
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function () {
            HideLoader();
            alert("Error al seleccionar tabla tipo detalle", 'WARNING');
        }

    });

    if (salida) {
        HidePopUp('divPopup');
    }
    HideLoader();
}

function ActualizarTablaTipoDetalle() {

    var emprId = $('#idEmpr').html();
    var tablId = $('#idTablatd').html();

    var salida = false;
    var tablatdActivo;
    if ($('#chkEstado').is(':checked')) {
        tablatdActivo = true;
    } else {
        tablatdActivo = false;
    }
    var tablatipo = $('#ddlTablaTipo').val();
    var nombre = $('#txtDescripcion').val();
    var abreviatura = $('#txtAbreviatura').val();
    var comentario = $('#txtComentario').val();
    var tablatdNueva = {
        Empr_Id: emprId,
        Tabl_Id: tablId,
        Tipo_Id: tablatipo,
        Tabl_Nombre: nombre,
        Tabl_Abreviatura: abreviatura,
        Tabl_Comentario: comentario,
        Tabl_Activo: tablatdActivo
    };

    $.ajax({
        url: urlRaiz + "TablaTipoDetalle/ActualizarTablaTipoDetalle",
        data: { tablatdNueva: JSON.stringify(tablatdNueva) },
        type: "PUT",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v == 0) {
                alert('No se pudo actualizar la tabla tipo "' + nombre + '", por favor' + '<br>' + 'verifique que los datos sean correctos', 'WARNING');
            }
            else if (v == 1) {
                salida = true;
                alert('Se actualizó la tabla "' + nombre + '" correctamente', 'CHECK', function () {
                    ListarTablaTipoDetallePaginado();
                    LimpiarPoppupTablaTipoDetalle();
                    HidePopUp('divPopup');
                });
            } else if (v == 2) {
                alert('La tabla "' + nombre + '" existe', 'WARNING');
                ShowPopUp('divPopup');
            }
            else {
                alert('No se pudo actualizar la tabla "' + nombre + '"', 'WARNING')
            }
        },
        error: function (v) {
            alert('No se pudo actualizar la tabla "' + nombre, 'ERROR')
            HideLoader();
        },
        complete: function (res) {
            HideLoader();
        }
    });
    if (salida) {
        HidePopUp('divPopup');
    }
}

function EliminarTablaTipoDetalle(tablId, descripcion) {
    $('#txtDescripcion').focus();
    confirm('¿Está seguro de eliminar la tabla "' + descripcion + '"?', function (result) {
        if (result) {
            $.ajax({
                url: urlRaiz + "TablaTipoDetalle/EliminarTablaTipoDetalle",
                data: { tabl_Id: tablId },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó la tabla tipo detalle "' + descripcion + '"', 'CHECK');
                        ListarTablaTipoDetallePaginado();
                        LimpiarPoppupTablaTipoDetalle();
                    }
                    else
                        alert('No se pudo eliminar la tabla tipo detalle"' + descripcion + '" porque tiene dependencias', 'WARNING');
                },
                error: function (v) {
                    alert('No se pudo eliminar la tabla tipo detalle"' + descripcion + '"', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
}

function EditarTablaTipoDetalle(tablId) {
    if (tablId != null && tablId != '') {
        SeleccionarTablaTipoDetalle(tablId);
        ShowPopUp('divPopup');
    }
}

function SeleccionarTablaTipoDetalle(tablId) {
    $('#txtDescripcion').focus();
    $.ajax({
        url: urlRaiz + "TablaTipoDetalle/SeleccionarTablaTipoDetalle",
        data: { Tabl_Id: tablId },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (s) {
            $('#gestionTablatd').html('Editar tabla: ' + s.Tabl_Nombre);
            $('#idTablatd').html(s.Tabl_Id);
            $('#idEmpr').html(s.Empr_Id);
            $('#ddlTablaTipo').val(s.Tipo_Id);
            $('#txtDescripcion').val(s.Tabl_Nombre);
            $('#txtAbreviatura').val(s.Tabl_Abreviatura);
            $('#txtComentario').val(s.Tabl_Comentario);

            if (s.Tabl_Activo == true) {
                $('#chkEstado').prop('checked', 'checked');
            }
            else {
                $('#chkEstado').prop('checked', '');
            }
        },
        error: function () {
            alert("Error al seleccionar tabla de tipos", 'ERROR');
        }
    });
}

function ListarTablaTipo() {

    $.ajax({
        url: urlRaiz + "TablaTipoDetalle/ListarTablaTipo",
        data: '',
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (res) {
            var listaDatos = res[0];
            for (i = 0; i < listaDatos.length; i++) {
                var option = $(document.createElement('option'));
                option.text(listaDatos[i].Tipo_Nombre);
                option.val(listaDatos[i].Tipo_Id);
                $("#ddlTablaTipo").append(option);
            }
        },
        error: function () {
            alert("Error al seleccionar tabla", 'ERROR');
        }
    });
    HideLoader();
}