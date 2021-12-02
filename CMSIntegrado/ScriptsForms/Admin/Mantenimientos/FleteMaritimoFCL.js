$(document).ready(function () {
    $('#txtContenedor20').focus();
    ListarPais(0);
    ListarFleteMaritimoFCL();
    var $btnNuevoFleteMaritimoFCL = $('#btnNuevo');
    var $btnGuardarFleteMaritimoFCL = $('#btnGuardar');
    var $btnListarFleteMaritimoFCL = $('#btnListarFleteMaritimoFCL');
    var $btnCancelar = $('#btnCancelar');
    var $idFleteMaritimoFCL = $('#idFleteMaritimoFCL');

    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        }
    });

    $btnCancelar.click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $btnNuevoFleteMaritimoFCL.click(function () {
        LimpiarPoppupFleteMaritimoFCL();
        ListarPais(0);
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        $('#txtContenedor20').focus();
    });

    $btnGuardarFleteMaritimoFCL.click(function () {
        if (ValidarCamposFleteMaritimoFCL() == false) {
            return;
        }
        if ($('#idFleteMaritimoFCL').html() == '') {
            InsertarFleteMaritimoFCL();
        } else {
            ActualizarFleteMaritimoFCL();
        }
    });

    $('#ddlPais').change(function () {
        $('#ddlPuerto').prop('disabled', $("#ddlPais").val() == 0 ? true : false);
        limpiarCombo('ddlPuerto');
        ListarPuerto($('#ddlPais').val());
    });

    $('#txtContenedor20').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtContenedor40').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtContenedorReefer').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtDiasTransito').keypress(function () {
        return ValidarSoloNumeros(event);
    });
});

function LimpiarPoppupFleteMaritimoFCL() {
    $('#txtContenedor20').val('');
    $('#txtContenedor40').val('');
    $('#txtContenedorReefer').val('');
    $('#txtDiasTransito').val('');
    limpiarCombo('ddlPais');
    limpiarCombo('ddlPuerto');
    $('#ddlPuerto').prop('disabled', true);
    $('#idFleteMaritimoFCL').html('');
    $('#btnGuardar').html('<label>Registrar</label>');
    $('#lblRegistro').html('Crear Flete Marítimo FCL');
}

function InsertarFleteMaritimoFCL() {
    ShowLoader();
    var salida = false;
    var contenedor20 = $('#txtContenedor20').val().trim();
    var contenedor40 = $('#txtContenedor40').val().trim();
    var contenedorReefer = $('#txtContenedorReefer').val().trim();
    var diasTransito = $('#txtDiasTransito').val().trim();
    var puerto = $('#ddlPuerto').val();

    var nuevoFleteMaritimoFCL = {
        Puer_Id: puerto,
        Ffcl_Contenedor20: contenedor20,
        Ffcl_Contenedor40: contenedor40,
        Ffcl_ContenedorReefer: contenedorReefer,
        Ffcl_DiasTransito:diasTransito
    };

    $.ajax({
        url: urlRaiz + "FleteMaritimoFCL/InsertarFleteMaritimoFCL",
        data: { nuevoFleteMaritimoFCL: JSON.stringify(nuevoFleteMaritimoFCL) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            console.log(v);
            if (v > 0) {
                salida = true;
                ListarFleteMaritimoFCL();
                alert('Se guardó correctamente.', 'CHECK', function () {
                    LimpiarPoppupFleteMaritimoFCL();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v == -1) {
                alert('Ya existe un Flete Marítimo FCL en el puerto seleccionado.', 'WARNING');
            } else {
                alert('No se pudo guardar el Flete Marítimo FCL, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo guardar el Flete Marítimo FCL.', 'ERROR')
            HideLoader();
        }
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    }
    HideLoader();
}

function ActualizarFleteMaritimoFCL() {
    ShowLoader();
    var usuarioActivo;
    var salida = false;
    var idFlete = $('#idFleteMaritimoFCL').html();
    var contenedor20 = $('#txtContenedor20').val().trim();
    var contenedor40 = $('#txtContenedor40').val().trim();
    var contenedorReefer = $('#txtContenedorReefer').val().trim();
    var diasTransito = $('#txtDiasTransito').val().trim();
    var puerto = $('#ddlPuerto').val();

    var actualizarFleteMaritimoFCL = {
        Ffcl_Id: idFlete,
        Puer_Id: puerto,
        Ffcl_Contenedor20: contenedor20,
        Ffcl_Contenedor40: contenedor40,
        Ffcl_ContenedorReefer: contenedorReefer,
        Ffcl_DiasTransito: diasTransito
    };

    $.ajax({
        url: urlRaiz + "FleteMaritimoFCL/ActualizarFleteMaritimoFCL",
        data: { actualizarFleteMaritimoFCL: JSON.stringify(actualizarFleteMaritimoFCL) },
        type: "PUT",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v > 0) {
                salida = true;
                ListarFleteMaritimoFCL();
                alert('Se actualizó correctamente', 'CHECK', function () {
                    LimpiarPoppupFleteMaritimoFCL();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v == -1) {
                alert('Ya existe un Flete Marítimo FCL en el puerto seleccionado.', 'WARNING');
            } else {
                alert('No se pudo actualizar el Flete Marítimo FCL, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo actualizar el Flete Marítimo FCL.', 'ERROR')
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

function ListarFleteMaritimoFCL() {
    grilla = new ccG_Objeto("gridFleteMaritimoFCL", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "RowNumber", false, 8, "left", "");
    grilla.AgregarColumna("País", "Pais_Nombre", true, 20, "left", "");
    grilla.AgregarColumna("Puerto", "Puer_Nombre", true, 22, "left", "");
    grilla.AgregarColumna("Contenedor de 20", "Ffcl_Contenedor20", true, 10, "right", "");
    grilla.AgregarColumna("Contenedor de 40", "Ffcl_Contenedor40", true, 10, "right", "");
    grilla.AgregarColumna("Contenedor Reefer", "Ffcl_ContenedorReefer", true, 10, "right", "");
    grilla.AgregarColumna("Días de tránsito", "Ffcl_DiasTransito", true, 10, "right", "");
    var btnEditar = "";
    var btnEliminar = "";
    if (editar) {
        btnEditar = '<a href="javascript:EditarFleteMaritimoFCL(#Ffcl_Id);" title="Editar"><span class="fas fa-edit"></span></a>';
    }

    if (eliminar) {
        btnEliminar = '<a href="javascript:EliminarFleteMaritimoFCL(#Ffcl_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>';
    }

    if (editar == true || eliminar == true) {
        grilla.AgregarColumna("", "", false, 10, "center", '<div class="accion-box">' + btnEditar + btnEliminar + '</div>');
    }

    grilla.ServicioUrl = urlRaiz + "FleteMaritimoFCL/ListarFleteMaritimoFCLPaginado";
    grilla.Identificadores = "Ffcl_Id";
   
    grilla.Inicializar();
    HideLoader();
}

function EditarFleteMaritimoFCL(idFleteMaritimo) {
    LimpiarPoppupFleteMaritimoFCL();
    if (idFleteMaritimo != null && idFleteMaritimo != '') {
        SeleccionarFleteMaritimoFCL(idFleteMaritimo);
        $('#ddlPuerto').prop('disabled', false);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Flete Marítimo FCL');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    }
}

function SeleccionarFleteMaritimoFCL(idFleteMaritimo) {
    ShowLoader();
    $('#idFleteMaritimoFCL').html(idFleteMaritimo);

    var FleteMaritimoFCLSeleccionado = { Ffcl_Id: idFleteMaritimo };
    $.ajax({
        url: urlRaiz + "FleteMaritimoFCL/SeleccionarFleteMaritimoFCL",
        data: { FleteMaritimoFCLSeleccionado: JSON.stringify(FleteMaritimoFCLSeleccionado) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (s) {
            $('#txtContenedor20').val(s.Ffcl_Contenedor20);
            $('#txtContenedor40').val(s.Ffcl_Contenedor40);
            $('#txtContenedorReefer').val(s.Ffcl_ContenedorReefer);
            $('#txtDiasTransito').val(s.Ffcl_DiasTransito);

            ListarPais(s.Pais_Id);
            ListarPuerto(s.Pais_Id, s.Puer_Id);

            $('#txtContenedor20').focus();
        },
        error: function () {
            alert("Error al seleccionar el Flete Marítimo FCL.", 'ERROR');
        },
        complete: function () {
            HideLoader();
        }
    });
}

function EliminarFleteMaritimoFCL(idFleteMaritimo) {
    confirm('¿Está seguro de eliminar el Flete Marítimo FCL?', function (result) {
        if (result) {
            var idFleteMaritimoFCL = { Ffcl_Id: idFleteMaritimo };
            $.ajax({
                url: urlRaiz + "FleteMaritimoFCL/EliminarFleteMaritimoFCL",
                data: { idFleteMaritimoFCL: JSON.stringify(idFleteMaritimoFCL) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó correctamente.', 'CHECK');
                        LimpiarPoppupFleteMaritimoFCL();
                        ListarFleteMaritimoFCL();
                    }
                    else {
                        alert('No se pudo eliminar el Flete Marítimo FCL porque tiene dependencias.', 'WARNING');
                    }
                },
                error: function (v) {
                    alert('No se pudo eliminar el Flete Marítimo FCL.', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
}

function ValidarCamposFleteMaritimoFCL() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#ddlPais').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- País"
    }
    if ($('#ddlPuerto').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Puerto"
    }
    if ($('#txtContenedor20').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Contenedor de 20"
    }
    if ($('#txtContenedor40').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Contenedor de 40"
    }
    if ($('#txtContenedorReefer').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Contenedor Reefer"
    }
    if ($('#txtDiasTransito').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Días de tránsito"
    }

    if (mensaje != "") {
        mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
        alert(mensaje, "WARNING");
    } else {
        EsValidado = true;
    }
    return EsValidado;
}

function ListarPais(seleccion) {
    $.ajax({
        url: urlRaiz + "Admin/Pais/ListarPaises",
        async: false,
        type: "POST", contenType: "application/json;charset=utf-8",
        success: function (res) {
            var listaDatos = res;
            for (i = 0; i < listaDatos.length; i++) {
                var option = $(document.createElement('option'));
                option.text(listaDatos[i].Pais_Nombre);
                option.val(listaDatos[i].Pais_Id);
                $("#ddlPais").append(option);
            }
            if (seleccion > 0) {
                $("#ddlPais").val(seleccion);
            }
        },
        error: function () { }
    });
}

function ListarPuerto(paisId,seleccion) {
    $("#ddlPuerto").empty();
    if (paisId != '') {
        $.ajax({
            url: urlRaiz + "Admin/Puerto/ListarPuertoPaginado",
            type: "POST", contenType: "application/json;charset=utf-8",
            async: false,
            data: { filter: 'Pais_Id=' + paisId, sorting: '', pageNumber: 1, pageSize: 0 },
            success: function (res) {
                var listaDatos = res;
                $("#ddlPuerto").append(new Option('--Seleccione--', ''));
                for (i = 0; i < listaDatos.length; i++) {
                    $("#ddlPuerto").append(new Option(listaDatos[i].Puer_Nombre, listaDatos[i].Puer_Id));
                }
                if (seleccion > 0) {
                    $("#ddlPuerto").val(seleccion);
                }
            },
            error: function () { }
        });
    }
}

function limpiarCombo(combo) {
    var option = $(document.createElement('option'));
    option.text('--Seleccione--');
    option.val(0);
    $('#' + combo).empty().append(option);
}