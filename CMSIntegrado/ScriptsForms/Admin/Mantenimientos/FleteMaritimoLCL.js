$(document).ready(function () {
    $('#txtFletePorTon').focus();
    ListarPais(0);
    ListarFleteMaritimoLCL();
    CargarTablas(2, 'ddlServicio');
    CargarTablas(3, 'ddlFrecuencia');
    var $btnNuevoFleteMaritimoLCL = $('#btnNuevo');
    var $btnGuardarFleteMaritimoLCL = $('#btnGuardar');
    var $btnListarFleteMaritimoLCL = $('#btnListarFleteMaritimoLCL');
    var $btnCancelar = $('#btnCancelar');
    var $idFleteMaritimoLCL = $('#idFleteMaritimoLCL');

    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        }
    });

    $btnCancelar.click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $btnNuevoFleteMaritimoLCL.click(function () {
        LimpiarPoppupFleteMaritimoLCL();
        ListarPais(0);
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        $('#txtFletePorTon').focus();
    });

    $btnGuardarFleteMaritimoLCL.click(function () {
        if (ValidarCamposFleteMaritimoLCL() == false) {
            return;
        }
        if ($('#idFleteMaritimoLCL').html() == '') {
            InsertarFleteMaritimoLCL();
        } else {
            ActualizarFleteMaritimoLCL();
        }
    });

    $("#ddlPais").change(function () {
        $('#ddlPuerto').prop('disabled', $("#ddlPais").val() == 0 ? true : false);
        limpiarCombo('ddlPuerto');
        ListarPuerto($('#ddlPais').val(),0);
    });

    $('#txtFletePorTon').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtFleteMinimo').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtFlete').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtDiasTransito').keypress(function () {
        return ValidarSoloNumeros(event);
    });
});

function LimpiarPoppupFleteMaritimoLCL() {
    $('#txtFletePorTon').val('');
    $('#txtFleteMinimo').val('');
    $('#txtFlete').val('');
    $('#txtDiasTransito').val('');
    $('#txtNotas').val('');
    limpiarCombo('ddlPais');
    limpiarCombo('ddlPuerto');
    $('#ddlPuerto').prop('disabled', true);
    $('#ddlServicio').val(0);
    $('#ddlFrecuencia').val(0);
    $('#idFleteMaritimoLCL').html('');
    $('#btnGuardar').html('<label>Registrar</label>');
    $('#lblRegistro').html('Crear Flete Marítimo LCL');
}

function InsertarFleteMaritimoLCL() {
    ShowLoader();
    var salida = false;
    var fletePorTon = $('#txtFletePorTon').val().trim();
    var fleteMinimo = $('#txtFleteMinimo').val().trim();
    var flete = $('#txtFlete').val().trim();
    var diasTransito = $('#txtDiasTransito').val().trim();
    var notas = $('#txtNotas').val().trim();
    var puerto = $('#ddlPuerto').val();
    var servicio = $('#ddlServicio').val();
    var frecuencia = $('#ddlFrecuencia').val();

    var nuevoFleteMaritimoLCL = {
        Puer_Id: puerto,
        Flcl_FletePorTON: fletePorTon,
        Flcl_FleteMinimo: fleteMinimo,
        Flcl_Flete: flete,
        Flcl_Servicio_Id: servicio,
        Flcl_Frecuencia_Id: frecuencia,
        Flcl_DiasTransito: diasTransito,
        Flcl_Notas: notas
    };

    $.ajax({
        url: urlRaiz + "FleteMaritimoLCL/InsertarFleteMaritimoLCL",
        data: { nuevoFleteMaritimoLCL: JSON.stringify(nuevoFleteMaritimoLCL) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            console.log(v);
            if (v > 0) {
                salida = true;
                ListarFleteMaritimoLCL();
                alert('Se guardó correctamente.', 'CHECK', function () {
                    LimpiarPoppupFleteMaritimoLCL();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v == -1) {
                alert('Ya existe un Flete Marítimo LCL en el puerto seleccionado.', 'WARNING');
            } else {
                alert('No se pudo guardar el Flete Marítimo LCL, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo guardar el Flete Marítimo LCL.', 'ERROR')
            HideLoader();
        }
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    }
    HideLoader();
}

function ActualizarFleteMaritimoLCL() {
    ShowLoader();
    var usuarioActivo;
    var salida = false;
    var idFlete = $('#idFleteMaritimoLCL').html();
    var fletePorTon = $('#txtFletePorTon').val().trim();
    var fleteMinimo = $('#txtFleteMinimo').val().trim();
    var flete = $('#txtFlete').val().trim();
    var diasTransito = $('#txtDiasTransito').val().trim();
    var notas = $('#txtNotas').val().trim();
    var puerto = $('#ddlPuerto').val();
    var servicio = $('#ddlServicio').val();
    var frecuencia = $('#ddlFrecuencia').val();

    var actualizarFleteMaritimoLCL = {
        Flcl_Id : idFlete,
        Puer_Id: puerto,
        Flcl_FletePorTON: fletePorTon,
        Flcl_FleteMinimo: fleteMinimo,
        Flcl_Flete: flete,
        Flcl_Servicio_Id: servicio,
        Flcl_Frecuencia_Id: frecuencia,
        Flcl_DiasTransito: diasTransito,
        Flcl_Notas: notas
    };

    $.ajax({
        url: urlRaiz + "FleteMaritimoLCL/ActualizarFleteMaritimoLCL",
        data: { actualizarFleteMaritimoLCL: JSON.stringify(actualizarFleteMaritimoLCL) },
        type: "PUT",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v > 0) {
                salida = true;
                ListarFleteMaritimoLCL();
                alert('Se actualizó correctamente', 'CHECK', function () {
                    LimpiarPoppupFleteMaritimoLCL();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v == -1) {
                alert('Ya existe un Flete Marítimo LCL en el puerto seleccionado.', 'WARNING');
            } else {
                alert('No se pudo actualizar el Flete Marítimo LCL, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo actualizar el Flete Marítimo LCL.', 'ERROR')
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

function ListarFleteMaritimoLCL() {
    grilla = new ccG_Objeto("gridFleteMaritimoLCL", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "RowNumber", false, 8, "left", "");
    grilla.AgregarColumna("País", "Pais_Nombre", true, 10, "left", "");
    grilla.AgregarColumna("Puerto", "Puer_Nombre", true, 10, "left", "");
    grilla.AgregarColumna("Flete por TON", "Flcl_FletePorTON", true, 8, "right", "");
    grilla.AgregarColumna("Flete mínimo", "Flcl_FleteMinimo", true, 8, "right", "");
    grilla.AgregarColumna("Flete", "Flcl_Flete", true, 8, "right", "");
    grilla.AgregarColumna("Servicio", "ServicioNombre", true, 10, "left", "");
    grilla.AgregarColumna("Frecuencia", "FrecuenciaNombre", true, 10, "left", "");
    grilla.AgregarColumna("Días de tránsito", "Flcl_DiasTransito", true, 8, "right", "");
    grilla.AgregarColumna("Notas", "Flcl_Notas", true, 10, "left", "");
    var btnEditar = "";
    var btnEliminar = "";
    if (editar) {
        btnEditar = '<a href="javascript:EditarFleteMaritimoLCL(#Flcl_Id);" title="Editar"><span class="fas fa-edit"></span></a>';
    }

    if (eliminar) {
        btnEliminar = '<a href="javascript:EliminarFleteMaritimoLCL(#Flcl_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>';
    }

    if (editar == true || eliminar == true) {
        grilla.AgregarColumna("", "", false, 10, "center", '<div class="accion-box">' + btnEditar + btnEliminar + '</div>');
    }

    grilla.ServicioUrl = urlRaiz + "FleteMaritimoLCL/ListarFleteMaritimoLCLPaginado";
    grilla.Identificadores = "Flcl_Id";
   
    grilla.Inicializar();
    HideLoader();
}

function EditarFleteMaritimoLCL(idFleteMaritimo) {
    LimpiarPoppupFleteMaritimoLCL();
    if (idFleteMaritimo != null && idFleteMaritimo != '') {
        SeleccionarFleteMaritimoLCL(idFleteMaritimo);
        $('#ddlPuerto').prop('disabled', false);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Flete Marítimo LCL');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    }
}

function SeleccionarFleteMaritimoLCL(idFleteMaritimo) {
    ShowLoader();
    $('#idFleteMaritimoLCL').html(idFleteMaritimo);

    var FleteMaritimoLCLSeleccionado = { Flcl_Id: idFleteMaritimo };
    $.ajax({
        url: urlRaiz + "FleteMaritimoLCL/SeleccionarFleteMaritimoLCL",
        data: { FleteMaritimoLCLSeleccionado: JSON.stringify(FleteMaritimoLCLSeleccionado) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (s) {
            $('#txtFletePorTon').val(s.Flcl_FletePorTON);
            $('#txtFleteMinimo').val(s.Flcl_FleteMinimo);
            $('#txtFlete').val(s.Flcl_Flete);
            $('#txtDiasTransito').val(s.Flcl_DiasTransito);
            $('#txtNotas').val(s.Flcl_Notas);
            $('#ddlServicio').val(s.Flcl_Servicio_Id);
            $('#ddlFrecuencia').val(s.Flcl_Frecuencia_Id);

            ListarPais(s.Pais_Id);
            ListarPuerto(s.Pais_Id, s.Puer_Id);

            $('#txtFletePorTon').focus();
        },
        error: function () {
            alert("Error al seleccionar el Flete Marítimo LCL.", 'ERROR');
        },
        complete: function () {
            HideLoader();
        }
    });
}

function EliminarFleteMaritimoLCL(idFleteMaritimo) {
    confirm('¿Está seguro de eliminar el Flete Marítimo LCL?', function (result) {
        if (result) {
            var idFleteMaritimoLCL = { Flcl_Id: idFleteMaritimo };
            $.ajax({
                url: urlRaiz + "FleteMaritimoLCL/EliminarFleteMaritimoLCL",
                data: { idFleteMaritimoLCL: JSON.stringify(idFleteMaritimoLCL) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó correctamente.', 'CHECK');
                        LimpiarPoppupFleteMaritimoLCL();
                        ListarFleteMaritimoLCL();
                    }
                    else {
                        alert('No se pudo eliminar el Flete Marítimo LCL porque tiene dependencias.', 'WARNING');
                    }
                },
                error: function (v) {
                    alert('No se pudo eliminar el Flete Marítimo LCL.', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
}

function ValidarCamposFleteMaritimoLCL() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#ddlPais').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- País"
    }
    if ($('#ddlPuerto').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Puerto"
    }
    if ($('#txtFletePorTon').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete por TON"
    }
    if ($('#txtFleteMinimo').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete mínimo"
    }
    if ($('#txtFlete').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete"
    }
    if ($('#ddlServicio').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Servicio"
    }
    if ($('#ddlFrecuencia').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Frecuencia"
    }
    if ($('#txtDiasTransito').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Días de tránsito"
    }
    if ($('#txtNotas').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Notas"
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

function ListarPuerto(paisId, seleccion) {
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

function CargarTablas(tipo, combo) {
    //var tipo = 2;
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
                $('#' + combo).append(option);
            }
        },
        error: function () {
            alert("Error al seleccionar Sector");
        }
    });
}