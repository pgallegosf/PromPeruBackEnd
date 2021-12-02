//cargarPerfil();

$(document).ready(function () {
    //ValidarAccesoGeneral();
    $('#txtAgente').focus();
    var $btnNuevaLineaNaviera = $('#btnNuevo');
    var $btnGuardarLineaNaviera = $('#btnGuardar');
    var $btnListarLineaNaviera = $('#btnListarLineaNaviera');
    var $btnCancelar = $('#btnCancelar');
    var $idLineaNaviera = $('#idLineaNaviera');
    var $txtAgente = $('#txtAgente');
    var $txtLineaNaviera = $('#txtLineaNaviera');
    var $txtDeposito = $('#txtDeposito');

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

    $('#txtAgente').keypress(function (event) {
        var Ffin = document.getElementById('txtAgente');
        Ffin.maxLength = 25;
        return ValidarSoloLetras(event);
    });

    $('#txtAgente').on('paste', function (e) {
        return false;
    });

    

    $btnNuevaLineaNaviera.click(function () {
        LimpiarPoppupLineaNaviera();
        //ShowPopUp('divPopup'); 

        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });

        $('#txtAgente').focus();
    })

    $btnGuardarLineaNaviera.click(function () {
        

        var num = 0;
        

        if (ValidarCamposLineaNaviera() == false) {
            return;
        } 
        else if ($('#idLineaNaviera').html() == '') {
            InsertarLineaNaviera();
        } else {
            ActualizarLineaNaviera();
        }
    })

    $('#txtAgente').keyup(function () {
        $('#lineaNaviera').html(1);
    });

});

function LimpiarPoppupLineaNaviera() {
    $('#txtAgente').val('');
    $('#txtLineaNaviera').val('');    
    $('#txtDeposito').val('');    
    $('#idLineaNaviera').html('');
    $('#txtAgente').focus();
    $('#chkActivo').prop('checked', 'checked');
    $('#btnGuardar').html('<label>Registrar</label>');
    $('#lblRegistro').html('Crear Línea Naviera');
}

function InsertarLineaNaviera() {
    ShowLoader();
    var lineaNavieraActivo;
    var Anulacion;
    var salida = false;
    var agente = $('#txtAgente').val().trim();
    var lineaNaviera = $('#txtLineaNaviera').val().trim();
    var deposito = $('#txtdeposito').val().trim();

    if ($('#chkActivo').prop('checked')) {
        lineaNavieraActivo = true;
    }
    else {
        lineaNavieraActivo = false;
    }

    var nuevoPuerto = {
        LNav_agente: agente,
        LNav_lineaNaviera: lineaNaviera,
        LNav_deposito: deposito,
        Puer_Activo: lineaNavieraActivo
    };

    alert('Se guardó el agente "' + agente + '" correctamente', 'CHECK', function () {
        LimpiarPoppupLineaNaviera();
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        HidePopUp('divPopup');
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
    HideLoader();
}

function ActualizarLineaNaviera() {
    ShowLoader();
    var lineaNavieraActivo;
    var salida = false;
    var agente = $('#txtAgente').val().trim();
    var lineaNaviera = $('#txtLineaNaviera').val().trim();
    var deposito = $('#txtdeposito').val().trim();

    if ($('#chkActivo').prop('checked')) {
        lineaNavieraActivo = true;
    }
    else {
        lineaNavieraActivo = false;
    }

    var puerto = $('#idPuerto').html();

    var ActualizarLineaNaviera = {
        LNav__Id: puerto,
        LNav_lineaNaviera: lineaNaviera,
        LNav_deposito: deposito,
        Puer_Activo: lineaNavieraActivo
    };

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
}

function EditarLineaNaviera(puerId) {
    if (puerId != null && puerId != '') {
        //SeleccionarPuerto(puerId);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Línea Naviera');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        //ShowPopUp('divPopup');
    }
}

function EliminarLineaNaviera(puerNombre, puerId) {
    confirm('¿Está seguro de eliminar el agente "' + puerNombre + '"?', function (result) {
        if (result) {
            var idPuerto = { Puer_Id: puerId };
            
        } else {
            return false;
        }
    });
    $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    //HidePopUp('divPopup');
}

function SeleccionarPuerto(puerId) {
    ShowLoader();
    $('#idPuerto').html(puerId);

    var puertoSeleccionado = { PuerId_Id: puerId };
   
}


function ListarPuertos() {
}

function ValidarCamposLineaNaviera() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtAgente').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Agente"
    }

    if ($('#txtLineaNaviera').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Línea Naviera"
    }
    if ($('#txtDeposito').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Deposito"
    }

    if (mensaje != "") {
        mensaje = "Por favor ingrese los datos en: <br />" + mensaje;
        alert(mensaje, "WARNING");
    } else {
        EsValidado = true;
    }
    return EsValidado;
}

function cargarPaís() {
    var tipo = 1;
}

function modificacion() {
    $('#puerto').html(1);
}
