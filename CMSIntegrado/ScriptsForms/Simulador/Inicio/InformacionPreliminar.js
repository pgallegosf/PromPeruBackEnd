$(document).ready(function () {
    $('#txtNombreSimulacion').focus();
    var textoAnterior = '';
    var selectIndex = -1;
    $("#txtProducto").keydown(function (e) {
        tecla = e.keyCode;
        //Flecha abajo
        if (tecla == 40 || tecla == 38) {
            if (tecla == 40) {
                selectIndex++;
                if (selectIndex > document.getElementById("ddlResultado").length - 1) {
                    selectIndex = document.getElementById("ddlResultado").length - 1;
                }
            }
            //Flecha arriba
            if (tecla == 38) {
                selectIndex--;
                if (selectIndex < 0) {
                    selectIndex = 0;
                }
            }
            document.getElementById("ddlResultado").selectedIndex = selectIndex;
            textoAnterior = $("#ddlResultado option:selected").text();
            codProducto = $("#ddlResultado option:selected").val();
            $('#txtProducto').val(textoAnterior);
            $('#txtCodProducto').val(codProducto);
            $('#txtNombreTecnico').val('');
            $('#txtPartida').val('');
        }
        if (tecla == 13 && $('#txtCodProducto').val() != '') {
            $("#ddlResultado").hide();
        }
        //ESCAPE
        if (tecla == 27) {
            $('#txtProducto').val('');
            $('#txtCodProducto').val('');

            $("#ddlResultado").empty();
            $("#ddlResultado").hide();
        }
    });
    $("#txtProducto").blur(function () {
        if ($('#txtCodProducto').val() == '') {
            $('#txtProducto').val('');
        }
        //$("#ddlResultado").empty();
        //$("#ddlResultado").hide();
    });
    $("#txtProducto").keyup(function (e) {
        var texto = $(this).val().trim();
        if (texto == textoAnterior) {
            return;
        }
        textoAnterior = texto;
        if (texto == '') {
            $("#ddlResultado").empty();
            $("#ddlResultado").hide();
            return;
        }

        $.ajax({
            url: urlRaiz + "Admin/Producto/ListarProductosPorNombre",
            type: 'POST',
            async: true,
            data: 'prod_Nombre=' + texto,
            success: function (res) {
                $("#ddlResultado").empty();
                selectIndex = -1;
                $("#txtCodProducto").val('');
                for (i = 0; i < res.length; i++) {
                    $("#ddlResultado").append('<option value="' + res[i].Prod_Id + '" ' + '' + '>' + res[i].Prod_Nombre + '</option>');
                }
                $("#ddlResultado").show();
            },
            beforeSend: function (res) {
                $("#ddlResultado").html("Buscando... ").show()
            },
            error: function (res) {
                $("#ddlResultado").html("Error de conexión").show()
            }
        });
    });
    $("#ddlResultado").click(function () {
        textoAnterior = $("#ddlResultado option:selected").text();
        codProducto = $("#ddlResultado option:selected").val();
        $('#txtProducto').val(textoAnterior);
        $('#txtCodProducto').val(codProducto);
        $('#txtNombreTecnico').val('');
        $('#txtPartida').val('');



        $("#ddlResultado").empty();
        $("#ddlResultado").hide();
    });
    $("#txtCantidadExportar").keypress(function (e) {
        return ValidarSoloNumeros(e);
    });
    $("#txtCostoUnitario").keypress(function (e) {
        return ValidarDecimal(e);
    });
    $("#txtLargoBulto").keypress(function (e) {
        return ValidarDecimal(e);
    });
    $("#txtAnchoBulto").keypress(function (e) {
        return ValidarDecimal(e);
    });
    $("#txtAltoBulto").keypress(function (e) {
        return ValidarDecimal(e);
    });
    $("#txtPesoBulto").keypress(function (e) {
        return ValidarDecimal(e);
    });
    $("#txtCantidadBultos").keypress(function (e) {
        return ValidarDecimal(e);
    });

    $("#txtLargoBulto").keyup(function () {
        CalcularVolumenTotal();
    });
    $("#txtAnchoBulto").keyup(function () {
        CalcularVolumenTotal();
    });
    $("#txtAltoBulto").keyup(function () {
        CalcularVolumenTotal();
    });
    $("#txtPesoBulto").keyup(function () {
        CalcularVolumenTotal();
    });
    $("#txtCantidadBultos").keyup(function () {
        CalcularVolumenTotal();
    });
    $("#ddlTipoEmpresa").change(function () {
        tipoEmpresa = $('#ddlTipoEmpresa').val();
        if (tipoEmpresa == 'C') {
            document.getElementById('divCostoUnitario').style.display = "flex";
        }
        else if (tipoEmpresa == 'P') {
            document.getElementById('divCostoUnitario').style.display = "none";
        }
    });
    $("#ddlPais").change(function () {
        tipoTransporte = $('#ddlTipoTransporte').val();
        if (tipoTransporte == 'A') {
            ListarAeropuerto($('#ddlPais').val());
        }
        else if (tipoTransporte == 'M') {
            ListarPuerto($('#ddlPais').val());
        }
    });


    $("#btnNuevoProducto").click(function () {
        $("#txtNombreProductoPopUp").val('');
        $("#txtNombreTecnicoPopUp").val('');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
    });
    $("#btnCancelarProducto").click(function () {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });
    $("#btnGrabarProducto").click(function () {
        idPartida = $("#ddlPartida").val();
        nombrePartida = $("#ddlPartida option:selected").text();
        nombre = $("#txtNombreProductoPopUp").val().trim();
        nombreTecnico = $("#txtNombreTecnicoPopUp").val().trim();
        if (idPartida == '') {
            alert("Seleccione partida", "WARNING");
            return;
        }
        if (nombre == '') {
            alert("Ingrese nombre comercial", "WARNING");
            return;
        }
        var nuevoProducto = {
            Prod_Nombre: nombre,
            Prod_NombreTecnico: nombreTecnico,
            Origen: 'simulador',
            Lista_Partidas: [{ Part_Id: idPartida }]
        };
        ShowLoader();
        $.ajax({
            url: urlRaiz + "Admin/Producto/InsertarProducto",
            data: { nuevoProducto: JSON.stringify(nuevoProducto) },
            type: "POST",
            contenType: "application/json;charset=utf-8",
            success: function (v) {
                if (v > 0) {
                    $("#txtProducto").val(nombre);
                    $("#txtNombreTecnico").val(nombreTecnico);
                    $("#txtPartida").val(nombrePartida);
                    $("#txtCodProducto").val(v);
                    $("#ddlResultado").hide();
                    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
                } else if (v == -1) {
                    alert('Ya existe un producto con el mismo nombre', 'WARNING');
                } else {
                    alert('No se pudo guardar el producto, por favor' + '<br>' + 'verifique que los datos sean correctos', 'WARNING');
                }
            },
            complete: function () {
                HideLoader();
            },
            error: function (v) {
                alert('No se pudo guardar el producto.', 'ERROR')
                HideLoader();
            }
        });

    });
    $("#btnSiguiente").click(function () {
        if (GuardarDatos(true)) {
            location.href = urlRaiz + 'Simulador/Inicio/Costos/' + $('#txtIdSimulacion').val();
        }
    });
    $("#btnSimulaciones").click(function () {
        Preguardado(function () {
            location.href = urlRaiz + 'Simulador/Inicio/Simulaciones';
        });
    });

    ListarPartida();
    ListarUnidadMedida();
    ListarPais();

    if (_simuId > 0) {
        CargarInformacionPreliminar();
    }
});

function CargarInformacionPreliminar() {
    $("#ddlUnidadMedida").val(_unidadMedida == '0' ? '' : _unidadMedida);
    $("#ddlTipoTransporte").val(_tipoTransporte);
    SeleccionarTipoTransporte($("#ddlTipoTransporte")[0]);
    $("#ddlPais").val(_idPais);

    if (_tipoTransporte == 'A') {
        ListarAeropuerto(_idPais);
        $("#ddlAeropuerto").val(_idAeropuerto);
    } else if (_tipoTransporte == 'M') {
        $("#ddlTipoCarga").val(_tipoCarga);
        SeleccionarCarga($("#ddlTipoCarga")[0]);

        if (_tipoCarga == 'L') {
            $("#ddlTipoContenedor").val(_idContenedor);
        }
        ListarPuerto(_idPais);
        $("#ddlPuerto").val(_idPuerto);
    }
    CalcularVolumenTotal();
    //$("#ddlTipoContenedor").val(_idContenedor);

    //$("#ddlPuerto").val(_idPuerto);

    //$("#ddlAeropuerto").val(_idAeropuerto);
}
function CalcularVolumenTotal() {
    largoBulto = parseFloat($("#txtLargoBulto").val() == '' ? 0 : $("#txtLargoBulto").val());
    anchoBulto = parseFloat($("#txtAnchoBulto").val() == '' ? 0 : $("#txtAnchoBulto").val());
    altoBulto = parseFloat($("#txtAltoBulto").val() == '' ? 0 : $("#txtAltoBulto").val());
    pesoBulto = parseFloat($("#txtPesoBulto").val() == '' ? 0 : $("#txtPesoBulto").val());
    cantidadBulto = parseFloat($("#txtCantidadBultos").val() == '' ? 0 : $("#txtCantidadBultos").val());
    tipoTransporte = $('#ddlTipoTransporte').val();

    volumen = (largoBulto * altoBulto * anchoBulto * cantidadBulto).toFixed(2);
    if ($('#ddlTipoTransporte').val() == 'A') {
        volumen = (largoBulto * altoBulto * anchoBulto * cantidadBulto / 6000).toFixed(2);
    }

    $("#txtVolumenTotal").val(volumen);
    $("#txtPesoBruto").val((pesoBulto * cantidadBulto).toFixed(2));
}
function GuardarDatos(validar) {
    //VALIDACIONES-------------------------------------------------------------------------------------------
    var msj = '';
    var idSimulacion = $('#txtIdSimulacion').val().trim();
    var nombreSimulacion = $('#txtNombreSimulacion').val().trim();
    var codProducto = $('#txtCodProducto').val().trim();
    var cantidadExpo = $('#txtCantidadExportar').val().trim();
    var codUnidadMedida = $('#ddlUnidadMedida').val();
    var costoUnitario = $('#txtCostoUnitario').val();
    var codTipoEmpresa = $('#ddlTipoEmpresa').val();
    var codTipoTransporte = $('#ddlTipoTransporte').val();
    var largoBulto = $('#txtLargoBulto').val();
    var anchoBulto = $('#txtAnchoBulto').val();
    var altoBulto = $('#txtAltoBulto').val();
    var pesoBulto = $('#txtPesoBulto').val();
    var cantidadBultos = $('#txtCantidadBultos').val();
    var codTipoCarga = $('#ddlTipoCarga').val();
    var codTipoContenedor = $('#ddlTipoContenedor').val();
    var codPais = $('#ddlPais').val();
    var codPuerto = $('#ddlPuerto').val();
    var codAeropuerto = $('#ddlAeropuerto').val();


    if (nombreSimulacion == '') {
        msj = '- Nombre de la simulación.';
    }
    codProducto = codProducto == '' ? 0 : parseInt(codProducto);
    if (codProducto == 0) {
        msj += (msj == '' ? '' : '<br />') + '- Seleccionar producto.';
    }
    if (validar) {
        cantidadExpo = cantidadExpo == '' ? 0 : parseInt(cantidadExpo);
        if (cantidadExpo == 0) {
            msj += (msj == '' ? '' : '<br />') + '- Cantidad a exportar.';
        }
        if (codUnidadMedida == '') {
            msj += (msj == '' ? '' : '<br />') + '- Unidad de medida.';
        }
        if (codTipoEmpresa == '') {
            msj += (msj == '' ? '' : '<br />') + '- Tipo de empresa.';
        }
        if (codTipoTransporte == '') {
            msj += (msj == '' ? '' : '<br />') + '- Tipo de transporte.';
            msj = 'Falta completar la siguiente información: <br />' + msj;
            alert(msj, 'warning');
            return false;
        }
        if (codTipoCarga == 'M' && codTipoCarga == '') {
            msj += (msj == '' ? '' : '<br />') + '- Tipo de carga.';
            msj = 'Falta completar la siguiente información: <br />' + msj;
            alert(msj, 'warning');
            return false;
        }
        costoUnitario = costoUnitario == '' ? 0 : parseFloat(costoUnitario);
        if (codTipoEmpresa == 'C' && (costoUnitario == 0)) {
            msj += (msj == '' ? '' : '<br />') + '- Costo Unitario.';
        }
        if (codTipoTransporte == 'A' || (codTipoTransporte == 'M' && codTipoCarga == 'C')) {
            largoBulto = largoBulto == '' ? 0 : parseFloat(largoBulto);
            if (largoBulto == 0) {
                msj += (msj == '' ? '' : '<br />') + '- Largo del bulto.';
            }
            anchoBulto = anchoBulto == '' ? 0 : parseFloat(anchoBulto);
            if (anchoBulto == 0) {
                msj += (msj == '' ? '' : '<br />') + '- Ancho del bulto.';
            }
            altoBulto = altoBulto == '' ? 0 : parseFloat(altoBulto);
            if (altoBulto == 0) {
                msj += (msj == '' ? '' : '<br />') + '- Alto del bulto.';
            }
            pesoBulto = pesoBulto == '' ? 0 : parseFloat(pesoBulto);
            if (pesoBulto == 0) {
                msj += (msj == '' ? '' : '<br />') + '- Peso del bulto.';
            }
            cantidadBultos = cantidadBultos == '' ? 0 : parseFloat(cantidadBultos);
            if (cantidadBultos == 0) {
                msj += (msj == '' ? '' : '<br />') + '- Cantidad de bultos.';
            }
        }
        if (codTipoTransporte == 'M' && codTipoCarga == 'L' && codTipoContenedor == '') {
            msj += (msj == '' ? '' : '<br />') + '- Tipo de contenedor.';
        }
        if (codPais == '') {
            msj += (msj == '' ? '' : '<br />') + '- País.';
            msj = 'Falta completar la siguiente información: <br />' + msj;
            alert(msj, 'warning');
            return false;
        }
        if (codTipoTransporte == 'A' && codAeropuerto == '') {
            msj += (msj == '' ? '' : '<br />') + '- Aeropuerto.';
        }
        if (codTipoTransporte == 'M' && codPuerto == '') {
            msj += (msj == '' ? '' : '<br />') + '- Puerto.';
        }
    }
    if (msj != '') {
        if (validar) {
            msj = 'Falta completar la siguiente información: <br />' + msj;
        }
        else {
            msj = 'Debe completar la siguiente información: <br />' + msj;
        }
        alert(msj, 'warning');
        return false;
    }
    //GRABAMOS LA INFORMACION--------------------------------------------------------------------
    var datos = {};
    datos.Preguardado = !validar;
    datos.Simu_Id = idSimulacion;
    datos.Simu_Nombre = nombreSimulacion;
    datos.Prod_Id = codProducto;
    datos.Simu_CantidadExportar = cantidadExpo;
    datos.Simu_UnidadMedida_Id = codUnidadMedida;
    datos.Simu_TipoEmpresa = codTipoEmpresa;
    datos.Simu_TipoTransporte = codTipoTransporte;
    if (codTipoEmpresa == 'C') {
        datos.Simu_CostoUnitario = costoUnitario;
    }
    if (codTipoTransporte == 'M') {
        datos.Simu_TipoCarga = codTipoCarga;
        datos.Puer_Id = codPuerto;
    } else {
        datos.Aero_Id = codAeropuerto;
    }
    if (codTipoTransporte == 'A' || codTipoCarga == 'C') {
        datos.Simu_LargoBulto = largoBulto;
        datos.Simu_AnchoBulto = anchoBulto;
        datos.Simu_AltoBulto = altoBulto;
        datos.Simu_PesoBulto = pesoBulto;
        datos.Simu_CantidadBultos = cantidadBultos;
    }
    if (codTipoTransporte == 'M' && codTipoCarga == 'L') {
        datos.Cont_Id = codTipoContenedor;
    }

    estado = false;
    $.ajax({
        url: urlRaiz + "Simulador/Simulacion/InsertarInformacionPreliminar",
        async: false,
        type: "POST", contenType: "application/json;charset=utf-8",
        data: datos,
        success: function (res) {
            if (res > 0) {
                idSimulacion = res;
                $("#txtIdSimulacion").val(idSimulacion);
                estado = true;
            } else {
                alert('Se ha producido un error, inténtelo nuevamente.', 'ERROR')
            }
        },
        error: function () {
            alert('Se ha producido un error, inténtelo nuevamente.', 'ERROR')
        }
    });

    return estado;
}
function SeleccionarTipoTransporte(obj) {

    if (obj.value == '') {
        $("[id*=Bulto]").each(function () {
            $(this).val('');
        });
        $("#txtVolumenTotal").val('');
        $("#txtPesoBruto").val('');
        document.getElementById('divCargaConsolidada').style.display = "none";
        document.getElementById('divContenedorLleno').style.display = 'none';
        document.getElementById('divCarga').style.display = 'none';
        document.getElementById('divVolumen').style.display = 'none';

        document.getElementById('divPais').style.display = 'none';
        document.getElementById('divPuerto').style.display = 'none';
        document.getElementById('divAeropuerto').style.display = 'none';
    }
    if (obj.value == 'A') {
        document.getElementById('divCargaConsolidada').style.display = 'block';
        document.getElementById('divContenedorLleno').style.display = 'none';
        document.getElementById('divCarga').style.display = 'none';
        document.getElementById('divVolumen').style.display = 'block';

        document.getElementById('divPais').style.display = 'block';
        document.getElementById('divPuerto').style.display = 'none';
        document.getElementById('divAeropuerto').style.display = 'block';

        $(".cont-box-label").each(function () {
            valor = $(this).text();
            valor = valor.replace('(m)', '(cm)');
            valor = valor.replace('(m3)', '(peso volumétrico)');
            $(this).text(valor);
        });
    }
    if (obj.value == 'M') {
        document.getElementById('divCarga').style.display = 'block';
        document.getElementById('divCargaConsolidada').style.display = 'none';
        document.getElementById('divContenedorLleno').style.display = 'none';
        document.getElementById('divVolumen').style.display = 'none';

        document.getElementById('divPais').style.display = 'block';
        document.getElementById('divPuerto').style.display = 'block';
        document.getElementById('divAeropuerto').style.display = 'none';

        $("#ddlTipoCarga").val("");
        $(".cont-box-label").each(function () {
            valor = $(this).text();
            valor = valor.replace('(cm)', '(m)');
            valor = valor.replace('(cm3)', '(m3)');
            $(this).text(valor);
        });
    }
}
function SeleccionarCarga(obj) {

    if (obj.value == '') {
        document.getElementById('divCargaConsolidada').style.display = "none";
        document.getElementById('divContenedorLleno').style.display = 'none';
        document.getElementById('divVolumen').style.display = 'none';

    }
    if (obj.value == 'C') {
        document.getElementById('divCargaConsolidada').style.display = 'block';
        document.getElementById('divContenedorLleno').style.display = 'none';
        document.getElementById('divVolumen').style.display = 'block';

    }
    if (obj.value == 'L') {

        document.getElementById('divCargaConsolidada').style.display = 'none';
        document.getElementById('divContenedorLleno').style.display = 'block';
        document.getElementById('divVolumen').style.display = 'none';
    }
}
function ListarUnidadMedida() {
    $.ajax({
        url: urlRaiz + "Admin/Tabla/ListarTablaPaginado",
        async: false,
        data: { filter: '', sorting: '', pageNumber: 1, pageSize: 0, tipoId: TablaTipo.UnidadMedida },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (res) {
            var listaDatos = res;
            for (i = 0; i < listaDatos.length; i++) {
                var option = $(document.createElement('option'));
                option.text(listaDatos[i].Tabl_Nombre);
                option.val(listaDatos[i].Tabl_Id);
                $("#ddlUnidadMedida").append(option);
            }
        },
        error: function () {
        }
    });

}
function ListarPais() {
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
        },
        error: function () { }
    });
}
function ListarAeropuerto(paisId) {
    $("#ddlAeropuerto").empty();
    if (paisId != '') {
        $.ajax({
            url: urlRaiz + "Admin/Aeropuerto/ListarAeropuertoPaginado",
            type: "POST", contenType: "application/json;charset=utf-8",
            async: false,
            data: { filter: 'Pais_Id=' + paisId, sorting: '', pageNumber: 1, pageSize: 0 },
            success: function (res) {
                var listaDatos = res;
                $("#ddlAeropuerto").append(new Option('--Seleccione--', ''));
                for (i = 0; i < listaDatos.length; i++) {
                    $("#ddlAeropuerto").append(new Option(listaDatos[i].Aero_Nombre, listaDatos[i].Aero_Id));
                }
            },
            error: function () { }
        });
    }
}
function ListarPuerto(paisId) {
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
            },
            error: function () { }
        });
    }
}
function ListarPartida() {
    $("#ddlPartida").empty();
    $.ajax({
        url: urlRaiz + "Admin/Partida/ListarPartidaPaginado",
        type: "POST", contenType: "application/json;charset=utf-8",
        data: { filter: '', sorting: '', pageNumber: 1, pageSize: 0 },
        success: function (res) {
            var listaDatos = res;
            $("#ddlPartida").append(new Option('--Seleccione--', ''));
            for (i = 0; i < listaDatos.length; i++) {;
                $("#ddlPartida").append(new Option(listaDatos[i].Part_Nombre, listaDatos[i].Part_Id));
            }
        },
        error: function () { }
    });
}
var modificado = false;
$(document).ready(function () {
    $("input, select").change(function () {
        modificado = true;
    });
    $("#btnPaso2").click(function () {
        Preguardado(function () { location.href = urlRaiz + 'Simulador/Inicio/Costos/' + $('#txtIdSimulacion').val(); });
    });
    $("#btnPaso3").click(function () {
        Preguardado(function () { location.href = urlRaiz + 'Simulador/Inicio/Incoterms/' + $('#txtIdSimulacion').val(); });
    });
    $("#btnPaso4").click(function () {
        Preguardado(function () { location.href = urlRaiz + 'Simulador/Inicio/EstructuraCostos/' + $('#txtIdSimulacion').val(); });
    });
});
function Preguardado(callback) {
    if (modificado == false) {
        callback();
        return;
    }
    var idSimulacion = $('#txtIdSimulacion').val().trim();
    var nombreSimulacion = $('#txtNombreSimulacion').val().trim();
    var codProducto = $('#txtCodProducto').val().trim();

    if (idSimulacion == '0' && nombreSimulacion == '' && codProducto == '0') {
        callback();
    } else {
        mensaje = 'Está saliendo del formulario y puede haber cambios sin guardar.<br /> ¿Desea guardar esos cambios?';
        confirm(mensaje, function (result) {
            if (result) {
                if (GuardarDatos(false)) {
                    callback();
                }
            } else {
                callback();
            }
        });
    }
}