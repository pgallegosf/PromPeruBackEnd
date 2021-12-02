function actualizar(sorting, nombreGrilla) {
    var obj = Objetos[nombreGrilla];
    obj.LlenarGrilla(sorting);
}


function ValidarCorreo(texto) {
    if (texto.indexOf('@', 0) == -1 || texto.indexOf('.', 0) == -1) {
        return false;
    }
    else {
        return true;
    }
}
function ValidarDocumento() {
    return ValidarTecleo("áéíóúabcdefghijklmnñopqrstuvwxyz0123456789");
}
function ValidarSoloLetras() {
    return ValidarTecleo(" áéíóúabcdefghijklmnñopqrstuvwxyz");
}
function ValidarSoloNumeros() {
    return ValidarTecleo("0123456789");
}
function ValidarDecimal() {
    return ValidarTecleo("0123456789.");
}
function ValidarHora() {
    return ValidarTecleo("0123456789:");
}
function ValidarSoloLetrasSimples() {
    return ValidarTecleo("abcdefghijklmnopqrstuvwxyz");
}
function ValidarTelefono() {
    return ValidarTecleo("0123456789-#+*");
}
function ValidarTecleo(letras) {
    key = event.keyCode || event.which;
    tecla = String.fromCharCode(key).toLowerCase();

    especiales = [8, 37];   //39='

    tecla_especial = false
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    }
}

function isRucValido(elem) {

    var tam = elem.val().length;
    if (tam <= 10)
        return false;
    else
        return true;


}
function SeleccionarCombo(control, valor) {
    var ddl = document.getElementById(control);
    var opts = ddl.options.length;
    for (var i = 0; i < opts; i++) {
        if (ddl.options[i].value.trim() == valor.trim()) {
            ddl.options[i].selected = true;
            break;
        }
    }
}

function ObtenerParametrosUrl() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function AbrirReporteGeneral() {
    window.open('../Reportes/ReporteGeneral.aspx', '_blank', 'scrollbars=yes,width=1000,height=600,resizable=yes');
}

//FECHAS
var posicion = new Array();
function ValidarFecha(e, valor, este) {
    n = (document.all) ? e.keyCode : e.which;
    //alert(n);
    //8=backspace | 13=enter | 110=punto decimal teclado numerico | 190=punto decimal teclado alfabetico
    if ((n < 47 || n > 57) && (n != 8 && n != 9 && n != 13 && n != 37 && n != 39) || n == 47) {
        if (n != 47) {
            return false;
        } else {
            //si es "/"
            if (!(valor.length == 2 || valor.length == 5)) {
                return false;
            }
        }
    } else {
        if (valor.length == 2 && eval(valor < 32) && valor > 0) {
            este.value += "/";
            posicion[0] = este.value;
            aux = este.value;
            return true;
        } else if ((valor.length == 2 || valor > 31) && n != 8) {
            //alert("Día no válido");
            este.value = "";
            return false;
        } else if (valor.length == 4) {
            pos1 = valor.indexOf("/");
            var aux = valor.substring(pos1 + 1);
            if (aux > 0 && aux > 1) {
                //alert("Introduzca mes con dos (2) dígitos: 01,02,...,11,12");
                este.value = posicion[0];
                return false;
            }
        } else if (valor.length == 5) {
            este.value += "/";
            posicion[1] = este.value;
        } else if (valor.length == 7) {
            aux = valor.substring(6);
            if (aux < 1 || aux > 2) {
                este.value = posicion[1];
                //alert("Año no válido");
                return false;
            }
        }
    }
}

function BlurCajaFecha(este) {
    //var este=window.document.getElementById("text1");
    if (este.value.length > 0) {
        var pos1 = este.value.indexOf("/");
        var dia = este.value.substring(0, pos1);
        var pos2 = este.value.indexOf("/", pos1 + 1);
        var mes = este.value.substring(pos1 + 1, pos2);
        var anio = este.value.substring(pos2 + 1, 10);
        if (anio.length != 4) {
            //alert("Fecha no válida");
            este.focus();
            este.value = "";
            //return false;
        } else if (mes.length != 2) {
            //alert("mes incorrecto");
            este.value = "";
            este.focus();
        } else if (dia.length != 2) {
            //alert("Día incorrecto");
            este.value = "";
            este.focus();
        }
    }
}
function NumericUpDown(sender, e) {
    if ($(sender).val() != "") {
        tecla = (document.all) ? event.keyCode : event.which;

        if (tecla == 38) {
            $(sender).val(parseInt($(sender).val()) + 1);
        }
        if (tecla == 40) {
            $(sender).val(parseInt($(sender).val()) - 1);
        }
    }
}
//------------------------------------------------------------------------------------
function HelperMostrarFoto(nombreForm, idFileUpload, nombreImagen, nombreSesionImagen, rutaEscritura, rutaLectura) {
    if ($("#" + idFileUpload).val() == "") {
        return;
    }
    var formData = new FormData(document.getElementById(nombreForm));
    formData.append("NombreFileUpload",  $("#" + idFileUpload).attr("name"));
    formData.append("NombreSesionImagen", nombreSesionImagen);
    formData.append("RutaEscritura", rutaEscritura);
    formData.append("RutaLectura", rutaLectura);
    $("#" + nombreImagen).after("<p id='pTmpLoading' style='display:inline-block; margin-left:5px'>Cargando...</p>");
    $.ajax({
        url: urlRaiz + "Controllers/Principal.ashx?accion=MostrarFoto",
        type: "POST",
        dataType: "HTML",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            
            var obj = JSON.parse(response);
            if (obj.Exito) {
                $("#" + nombreImagen).attr("src", obj.Mensaje);
                RecibirInfoImagen(obj);
            } else {
                alert("Error: " + obj.Mensaje);
            }
            $("#pTmpLoading").remove();
        },
        error: function (result) {
            $("#pTmpLoading").remove();
            alert('No se pudo Subir la Imagen: ' + result.status + ' ' + result.statusText);
        }
    })
    
}

function HelperDescargarArchivo(ruta_archivo) {
    window.open(ruta_archivo, '_blank', '');
}
//Función que debe ser llamada desde el evento keypress de una caja de texto.
//recibe como parámetro el id del botón que se desee hacer clic cuando se presione enter.
function KeyPressEnter(idBoton) {
    key = event.keyCode || event.which;
    if (key == 13) {
        $("#" + idBoton).click();
        return false;
    }
}