$(document).ready(function () {
    ListarGlosario();
    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        }
    });

    $('#btnCancelar').click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $('#btnNuevo').click(function () {
        LimpiarPoppupGlosario();
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        $('#txtNombre').focus();
    });

    $('#btnGuardar').click(function () {
        if (ValidarCamposGlosario() == false) {
            return;
        }
        if ($('#idGlosario').html() == '') {
            InsertarGlosario();
        } else {
            ActualizarGlosario();
        }
    });

    $('#txtNombre').keypress(function () {
        var Ffin = document.getElementById('txtNombre');
        Ffin.maxLength = 50;
    });

    $('#txtDescripcion').keypress(function () {
        var Ffin = document.getElementById('txtDescripcion');
        Ffin.maxLength = 800;
    });
});


function valida_longitud() {
    var contenido_textarea = "";
    var num_caracteres_permitidos = 800;
    num_caracteres = $('#txtDescripcion').val().length;

    if (num_caracteres > num_caracteres_permitidos) {
        $('#txtDescripcion').val().length = contenido_textarea;
    } else {
        contenido_textarea = $('#txtDescripcion').val().length;
    }
    console.log($('#txtDescripcion').keypress());
    if (num_caracteres >= num_caracteres_permitidos) {
        alert('El texto excede los caracteres permitidos.', 'ERROR');
        $('#txtDescripcion').val('');
        return false;
    } 
}

function LimpiarPoppupGlosario() {
    $('#txtNombre').val('');
    $('#txtDescripcion').val('');
    $('#idGlosario').html('');
    $('#btnGuardar').html('<label>Registrar</label>');
    $('#lblRegistro').html('Crear Glosario');
}

function InsertarGlosario() {
    ShowLoader();
    var salida = false;
    var nombre = $('#txtNombre').val();
    var descripcion = $('#txtDescripcion').val();

    var nuevoGlosario = {
        Glos_Nombre: nombre,
        Glos_Descripcion: descripcion
    };

    $.ajax({
        url: urlRaiz + "Glosario/InsertarGlosario",
        data: { nuevoGlosario: JSON.stringify(nuevoGlosario) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            console.log(v);
            if (v > 0) {
                salida = true;
                ListarGlosario();
                alert('Se guardó correctamente.', 'CHECK', function () {
                    LimpiarPoppupGlosario();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v == -1) {
                alert('Ya existe un Glosario con el mismo nombre en el tipo seleccionado.', 'WARNING');
            } else {
                alert('No se pudo guardar el Glosario, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo guardar el Glosario.', 'ERROR');
            HideLoader();
        }
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    }
    HideLoader();
}

function ActualizarGlosario() {
    ShowLoader();
    var usuarioActivo;
    var salida = false;
    var idGlosario = $('#idGlosario').html();
    var nombre = $('#txtNombre').val();
    var descripcion = $('#txtDescripcion').val();

    var tipo = $('#ddlTipo').val();

    var actualizarGlosario = {
        Glos_Id: idGlosario,
        Glos_Nombre: nombre,
        Glos_Descripcion: descripcion
    };

    $.ajax({
        url: urlRaiz + "Glosario/ActualizarGlosario",
        data: { actualizarGlosario: JSON.stringify(actualizarGlosario) },
        type: "PUT",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v > 0) {
                salida = true;
                ListarGlosario();
                alert('Se actualizó correctamente', 'CHECK', function () {
                    LimpiarPoppupGlosario();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v == -1) {
                alert('Ya existe un Glosario con el mismo nombre en el tipo seleccionado.', 'WARNING');
            } else {
                alert('No se pudo actualizar el Glosario, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo actualizar el Glosario.', 'ERROR')
            HideLoader();
        },
        complete: function (res) {
            HideLoader();
        }
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    }
}

function ListarGlosario() {
    var tipoId = $('#ddlTipo').val();

    grilla = new ccG_Objeto("gridGlosario", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "RowNumber", false, 8, "left", "");
    grilla.AgregarColumna("Nombre", "Glos_Nombre", true, 22, "left", "");
    grilla.AgregarColumna("Descripción", "Glos_Descripcion", true, 60, "left", "");
    var btnEditar = "";
    var btnEliminar = "";
    if (editar) {
        btnEditar = '<a href="javascript:EditarGlosario(#Glos_Id);" title="Editar"><span class="fas fa-edit"></span></a>';
    }

    if (eliminar) {
        btnEliminar = '<a href="javascript:EliminarGlosario(#Glos_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>';
    }

    if (editar == true || eliminar == true) {
        grilla.AgregarColumna("", "", false, 10, "center", '<div class="accion-box">' + btnEditar + btnEliminar + '</div>');
    }

    grilla.ServicioParametros = "tipoId:'" + tipoId + "'";
    grilla.ServicioUrl = urlRaiz + "Glosario/ListarGlosarioPaginado";
    grilla.Identificadores = "Glos_Id";    
    grilla.Inicializar();
    HideLoader();
}

function EditarGlosario(gastoId) {
    LimpiarPoppupGlosario();
    if (gastoId != null && gastoId != '') {
        SeleccionarGlosario(gastoId);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Glosario');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    }
}

function SeleccionarGlosario(gastoId) {
    ShowLoader();
    $('#idGlosario').html(gastoId);

    var glosarioSeleccionado = { Glos_Id: gastoId };
    $.ajax({
        url: urlRaiz + "Glosario/SeleccionarGlosario",
        data: { glosarioSeleccionado: JSON.stringify(glosarioSeleccionado) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (s) {
            $('#txtNombre').val(s.Glos_Nombre);
            $('#txtDescripcion').val(s.Glos_Descripcion);

            $('#txtNombre').focus();
        },
        error: function () {
            alert("Error al seleccionar el Glosario.", 'ERROR');
        },
        complete: function () {
            HideLoader();
        }
    });
}

function EliminarGlosario(gastoId) {
    confirm('¿Está seguro de eliminar el Glosario?', function (result) {
        if (result) {
            var idGlosario = { Glos_Id: gastoId };
            $.ajax({
                url: urlRaiz + "Glosario/EliminarGlosario",
                data: { idGlosario: JSON.stringify(idGlosario) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó correctamente.', 'CHECK');
                        LimpiarPoppupGlosario();
                        ListarGlosario();
                    }
                    else {
                        alert('No se pudo eliminar el Glosario porque tiene dependencias.', 'WARNING');
                    }
                },
                error: function (v) {
                    alert('No se pudo eliminar el Glosario.', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
}

function ValidarCamposGlosario() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtNombre').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Nombre"
    }
    if ($('#txtDescripcion').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Descripción"
    }

    if (mensaje != "") {
        mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
        alert(mensaje, "WARNING");
    } else {
        EsValidado = true;
    }
    return EsValidado;
}