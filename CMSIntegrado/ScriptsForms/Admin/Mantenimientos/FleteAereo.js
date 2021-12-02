$(document).ready(function () {
    $('#txtFleteMenos45').focus();
    ListarPais(0);
    ListarFleteAereos();
    CargarTablas(2, 'ddlServicio');
    CargarTablas(3, 'ddlFrecuencia');
    var $btnNuevoFleteAereo = $('#btnNuevo');
    var $btnGuardarFleteAereo = $('#btnGuardar');
    var $btnListarFleteAereo = $('#btnListarFleteAereo');
    var $btnCancelar = $('#btnCancelar');
    var $idFleteAereo = $('#idFleteAereo');
    var $ddlPais = $('#ddlPais');
    var $ddlRuta = $('#ddlRuta');
    var $ddlAeropuerto = $('#ddlAeropuerto');

    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        }
    });

    $btnCancelar.click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $btnNuevoFleteAereo.click(function () {
        LimpiarPoppupFleteAereo();
        ListarPais(0);
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        $('#txtFleteMenos45').focus();
    });

    $btnGuardarFleteAereo.click(function () {
        if (ValidarCamposFleteAereo() == false) {
            return;
        }
        if ($('#idFleteAereo').html() == '') {
            InsertarFleteAereo();
        } else {
            ActualizarFleteAereo();
        }
    });

    $('#ddlPais').change(function () {
        $('#ddlAeropuerto').prop('disabled', $('#ddlPais').val() == 0 ? true : false);
        limpiarCombo('ddlAeropuerto');
        ListarAeropuerto($('#ddlPais').val(), 0);
    });

    //$('#ddlRuta').change(function () {
    //    $('#ddlAeropuerto').prop('disabled',  $('#ddlRuta').val() == 0 ? true : false);
    //    limpiarCombo('ddlAeropuerto');
    //    ListarAeropuerto($('#ddlRuta').val(),0);
    //});

    $('#txtFleteMenos45').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtFleteMas45').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtFleteMas100').keypress(function () {
        return ValidarSoloNumeros(event);
    });

    $('#txtFleteMinimo').keypress(function () {
        return ValidarSoloNumeros(event);
    });
});

function LimpiarPoppupFleteAereo() {
    $('#txtFleteMenos45').val('');
    $('#txtFleteMas45').val('');
    $('#txtFleteMas100').val('');
    $('#txtFleteMinimo').val('');
    $('#idFleteAereo').html('');
    limpiarCombo('ddlPais');
    limpiarCombo('ddlRuta');
    limpiarCombo('ddlAeropuerto');
    $('#ddlRuta').prop('disabled', true);
    $('#ddlAeropuerto').prop('disabled', true);
    $('#ddlServicio').val(0);
    $('#ddlFrecuencia').val(0);
    $('#btnGuardar').html('<label>Registrar</label>');
    $('#lblRegistro').html('Crear Flete Aéreo');
}

function InsertarFleteAereo() {
    ShowLoader();
    var salida = false;
    var menos45 = $('#txtFleteMenos45').val().trim();
    var mas45 = $('#txtFleteMas45').val().trim();
    var mas100 = $('#txtFleteMas100').val().trim();
    var minimo = $('#txtFleteMinimo').val().trim();
    var aeropuerto = $('#ddlAeropuerto').val();
    var servicio = $('#ddlServicio').val();
    var frecuencia = $('#ddlFrecuencia').val();

    var nuevoFleteAereo = {
        Aero_Id: aeropuerto,
        Faer_FleteMenos45: menos45,
        Faer_FleteMas45: mas45,
        Faer_FleteMas100: mas100,
        Faer_FleteMinimo: minimo,
        Faer_Servicio_Id: servicio,
        Faer_Frecuencia_Id: frecuencia
    };

    $.ajax({
        url: urlRaiz + "FleteAereo/InsertarFleteAereo",
        data: { nuevoFleteAereo: JSON.stringify(nuevoFleteAereo) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            console.log(v);
            if (v > 0) {
                salida = true;
                ListarFleteAereos();
                alert('Se guardó correctamente.', 'CHECK', function () {
                    LimpiarPoppupFleteAereo();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v < 0) {
                alert('Ya existe un Flete Aéreo en el país seleccionado.', 'WARNING');
            } else {
                alert('No se pudo guardar el Flete Aéreo, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
        },
        complete: function () {
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo guardar el FleteAereo.', 'ERROR')
            HideLoader();
        }
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    }
    HideLoader();
}

function ActualizarFleteAereo() {
    ShowLoader();
    var usuarioActivo;
    var salida = false;
    var fleteAereo = $('#idFleteAereo').html();
    var menos45 = $('#txtFleteMenos45').val().trim();
    var mas45 = $('#txtFleteMas45').val().trim();
    var mas100 = $('#txtFleteMas100').val().trim();
    var minimo = $('#txtFleteMinimo').val().trim();
    var aeropuerto = $('#ddlAeropuerto').val();
    var servicio = $('#ddlServicio').val();
    var frecuencia = $('#ddlFrecuencia').val();

    var actualizarFleteAereo = {
        Faer_Id: fleteAereo,
        Aero_Id: aeropuerto,
        Faer_FleteMenos45: menos45,
        Faer_FleteMas45: mas45,
        Faer_FleteMas100: mas100,
        Faer_FleteMinimo: minimo,
        Faer_Servicio_Id: servicio,
        Faer_Frecuencia_Id: frecuencia
    };

    $.ajax({
        url: urlRaiz + "FleteAereo/ActualizarFleteAereo",
        data: { actualizarFleteAereo: JSON.stringify(actualizarFleteAereo) },
        type: "PUT",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            if (v > 0) {
                salida = true;
                ListarFleteAereos();
                alert('Se actualizó correctamente', 'CHECK', function () {
                    LimpiarPoppupFleteAereo();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                });
            } else if (v < 0) {
                alert('Ya existe un Flete Aéreo en el país seleccionado.', 'WARNING');
            } else {
                alert('No se pudo actualizar el Flete Aéreo, por favor' + '<br>' + 'verifique que los datos sean correctos.', 'WARNING');
            }
            HideLoader();
        },
        error: function (v) {
            alert('No se pudo actualizar el Flete Aéreo.', 'ERROR')
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

function ListarFleteAereos() {
    grilla = new ccG_Objeto("gridFleteAereo", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "RowNumber", false, 5, "left", "");
    grilla.AgregarColumna("País", "Pais_Nombre", true, 10, "left", "");
    //grilla.AgregarColumna("Ruta", "Ruta_Nombre", true, 14, "left", "");
    grilla.AgregarColumna("Aeropuerto", "Aero_Nombre", true, 15, "left", "");
    grilla.AgregarColumna("Flete menos de 45 Kgs", "Faer_FleteMenos45", true, 9, "right", "");
    grilla.AgregarColumna("Flete mas de 45 Kgs", "Faer_FleteMas45", true, 9, "right", "");
    grilla.AgregarColumna("Flete de mas de 100 Kgs", "Faer_FleteMas100", true, 9, "right", "");
    grilla.AgregarColumna("Flete mínimo", "Faer_FleteMinimo", true, 5, "right", "");
    grilla.AgregarColumna("Servicio", "ServicioNombre", true, 13, "left", "");
    grilla.AgregarColumna("Frecuencia", "FrecuenciaNombre", true, 15, "left", "");
    var btnEditar = "";
    var btnEliminar = "";
    if (editar) {
        btnEditar = '<a href="javascript:EditarFleteAereo(#Faer_Id);" title="Editar"><span class="fas fa-edit"></span></a>';
    }

    if (eliminar) {
        btnEliminar = '<a href="javascript:EliminarFleteAereo(#Faer_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>';
    }

    if (editar == true || eliminar == true) {
        grilla.AgregarColumna("", "", false, 10, "center", '<div class="accion-box">' + btnEditar + btnEliminar + '</div>');
    }

    grilla.ServicioUrl = urlRaiz + "FleteAereo/ListarFleteAereoPaginado";
    grilla.Identificadores = "Faer_Id";
    
    
    grilla.Inicializar();
    HideLoader();
}

function EditarFleteAereo(FleteAereoId) {
    LimpiarPoppupFleteAereo();
    if (FleteAereoId != null && FleteAereoId != '') {
        SeleccionarFleteAereo(FleteAereoId);
        $('#ddlRuta').prop('disabled', false);
        $('#ddlAeropuerto').prop('disabled', false);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Flete Aéreo');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    }
}

function SeleccionarFleteAereo(FleteAereoId) {
    ShowLoader();
    $('#idFleteAereo').html(FleteAereoId);

    var FleteAereoSeleccionado = { Faer_Id: FleteAereoId };
    $.ajax({
        url: urlRaiz + "FleteAereo/SeleccionarFleteAereo",
        data: { FleteAereoSeleccionado: JSON.stringify(FleteAereoSeleccionado) },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (s) {
            $('#txtFleteMenos45').val(s.Faer_FleteMenos45);
            $('#txtFleteMas45').val(s.Faer_FleteMas45);
            $('#txtFleteMas100').val(s.Faer_FleteMas100);
            $('#txtFleteMinimo').val(s.Faer_FleteMinimo);
            $('#ddlServicio').val(s.Faer_Servicio_Id);
            $('#ddlFrecuencia').val(s.Faer_Frecuencia_Id);

            ListarPais(s.Pais_Id);
            ListarAeropuerto(s.Pais_Id, s.Aero_Id);


            $('#txtFleteMenos45').focus();
        },
        error: function () {
            alert("Error al seleccionar el Flete Aéreo.", 'ERROR');
        },
        complete: function () {
            HideLoader();
        }
    });
}

function EliminarFleteAereo(FleteAereoId) {
    confirm('¿Está seguro de eliminar el Flete Aéreo?', function (result) {
        if (result) {
            var idFleteAereo = { Faer_Id: FleteAereoId };
            $.ajax({
                url: urlRaiz + "FleteAereo/EliminarFleteAereo",
                data: { idFleteAereo: JSON.stringify(idFleteAereo) },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == "true") {
                        alert('Se eliminó correctamente.', 'CHECK');
                        LimpiarPoppupFleteAereo();
                        ListarFleteAereos();
                    }
                    else {
                        alert('No se pudo eliminar el Flete Aéreo porque tiene dependencias.', 'WARNING');
                    }
                },
                error: function (v) {
                    alert('No se pudo eliminar el Flete Aéreo.', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
}

function ValidarCamposFleteAereo() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#ddlAeropuerto').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Aeropuerto"
    }
    if ($('#txtFleteMenos45').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete menos de 45 Kgs"
    }
    if ($('#txtFleteMas45').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete más de 45 Kgs"
    }
    if ($('#txtFleteMas100').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete de mas de 100 Kgs"
    }
    if ($('#txtFleteMinimo').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Flete mínimo"
    }
    if ($('#ddlServicio').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Servicio"
    }
    if ($('#ddlFrecuencia').val() == 0) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Frecuencia"
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

function ListarAeropuerto(paisId, seleccion) {
    $("#ddlAeropuerto").empty();
    if (paisId != '') {
        $.ajax({
            url: urlRaiz + "Admin/Aeropuerto/ListarAeropuertoPaginado",
            type: "POST", contenType: "application/json;charset=utf-8",
            async: false,
            data: { filter: 'Pais_Id=' + paisId, sorting: '', pageNumber: 1, pageSize: 0 },
            success: function (res) {
                var listaDatos = res;
                $("#ddlAeropuerto").append(new Option('--Seleccione--', 0));
                for (i = 0; i < listaDatos.length; i++) {
                    $("#ddlAeropuerto").append(new Option(listaDatos[i].Aero_Nombre, listaDatos[i].Aero_Id));
                }
                if (seleccion > 0) {
                    $("#ddlAeropuerto").val(seleccion);
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

function CargarTablas(tipo,combo) {
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