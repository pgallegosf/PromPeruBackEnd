//cargarPerfil();

$(document).ready(function () {
    //ValidarAccesoGeneral();
    $('#txtNombre').focus();
    var $btnNuevoPuerto = $('#btnNuevo');
    var $btnGuardarPuerto = $('#btnGuardar');
    var $btnListarPuerto = $('#btnListarPuerto');
    var $btnCancelar = $('#btnCancelar');
    var $idPuerto = $('#idPuerto');
    var $txtNombre = $('#txtNombre');

    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
            //ShowPopUp('divPopup');
        }
    });
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
      
    $btnCancelar.click(function () {
        //HidePopUp('divPopup');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
    });

    $('#txtNombre').keypress(function (event) {
        var Ffin = document.getElementById('txtNombre');
        Ffin.maxLength = 25;
        return ValidarSoloLetras(event);
    });

    $('#txtNombre').on('paste', function (e) {
        return false;
    });

    

    $btnNuevoPuerto.click(function () {
        LimpiarPoppupPuerto();
        //ShowPopUp('divPopup'); 

        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });

        $('#txtNombre').focus();
    })

    $btnGuardarPuerto.click(function () {
        

        var num = 0;
        

        if (ValidarCamposPuerto() == false) {
            return;
        } 
        else if ($('#idPuerto').html() == '') {
            InsertarPuerto();
        } else {
            ActualizarPuerto();
        }
    })

    $('#txtNombre').keyup(function () {
        $('#puerto').html(1);
    });

});

function LimpiarPoppupPuerto() {
    $('#txtNombre').val('');
    $('#ddlPuerto').val(0);    
    $('#idPuerto').html('');
    $('#txtNombre').focus();
    $('#chkActivo').prop('checked', 'checked');
    $('#btnGuardar').html('<label>Registrar</label>');
    $('#lblRegistro').html('Crear Logo');
}

function InsertarPuerto() {
    ShowLoader();
    var puertoActivo;
    var Anulacion;
    var salida = false;
    var nombre = $('#txtNombre').val().trim();
    var pais = $('#ddlPais').val();

    if ($('#chkActivo').prop('checked')) {
        puertoActivo = true;
    }
    else {
        puertoActivo = false;
    }

    var nuevoPuerto = {
        Puer_Nombre: nombre,
        Pais_Id: pais,
        Puer_Activo: puertoActivo
    };

    alert('Se guardó el puerto "' + nombre + '" correctamente', 'CHECK', function () {
        LimpiarPoppupPuerto();
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        HidePopUp('divPopup');
    });

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
    HideLoader();
}

function ActualizarPuerto() {
    ShowLoader();
    var puertoActivo;
    var salida = false;
    var nombre = $('#txtNombre').val();
    var pais = $('#ddlPais').val();

    if ($('#chkActivo').prop('checked')) {
        puertoActivo = true;
    }
    else {
        puertoActivo = false;
    }

    var puerto = $('#idPuerto').html();

    var ActualizarPuerto = {
        Puer_Id: puerto,
        Puer_Nombres: nombre,
        Pais_Id: pais
    };

    if (salida) {
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "0", opacity: "0" });
        //HidePopUp('divPopup');
    }
}

function EditarPuerto(puerId) {
    if (puerId != null && puerId != '') {
        //SeleccionarPuerto(puerId);
        $('#btnGuardar').html('<label>Actualizar</label>');
        $('#lblRegistro').html('Actualizar Logo');
        $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
		$('#txtNombre').focus();
        //ShowPopUp('divPopup');
    }
}


function EliminarPuerto(puerNombre, puerId) {
    confirm('¿Está seguro de eliminar el logo "' + puerNombre + '"?', function (result) {
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
    //ShowLoader();
    $('#idPuerto').html(puerId);

    var puertoSeleccionado = { PuerId_Id: puerId };
   
}


function ListarPuertos() {
}

function ValidarCamposPuerto() {
    var EsValidado = false;
    var mensaje = "";

    if ($('#txtNombre').val() == "") {
        mensaje += (mensaje == "" ? "" : "<br />") + "- Puerto"
    }

    if ($('#ddlPais').val() == 0 || $('#ddlPais').val() == '' || $('#ddlPais').val() == null) {
        mensaje += (mensaje == "" ? "" : "<br />") + "- País"
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
