
var cantidadProcesos = 0;
var ajaxShowLoader = true;
//tipoConcepto almacena los ids de la tabla TipoConcepto (Tcon_Id)
var TipoConcepto = {
    MaterialDirecto: 1,
    ManoObraDirecta: 2,
    MaterialIndirecto: 3,
    ManoObraIndirecta: 4,
    CostoIndirecto: 5,
    GastoAdministrativo: 6,
    Envase: 7,
    Empaque: 8,
    Embalaje: 9,
    Comercializacion: 10,
    Distribucion: 11,
    GastoExportacion: 12,
    GastoFinanciero: 13,
    GastoDescarga: 14,
    Impuesto: 15
};
//tablaTipo almacena los ids de la tabla TablaTipo (Tipo_Id)
var TablaTipo = {
    Sector: 1,
    ServicioFleteMaritimoLCL: 2,
    FrecuenciaFleteMaritimoLCL: 3,
    UnidadMedida: 4
};
$(document).ready(function () {
	//$('.menu-list').hide();
    $(document).ajaxStart(function () {
        if (ajaxShowLoader) {
            ShowLoader();
        }

    });

    // evento ajax stop
    $(document).ajaxStop(function () {
        HideLoader();
    });


});

function ShowLoader() {
    var baseUrl = $('base').attr('href');
    $('body').append('<div class="overlayPrincipal" id="divOverlayPrincipal"><div id="divLoading" style="width: 40px; height: 40px; position: fixed;"><img src="' + baseUrl + 'Content/img/gifs/loading.gif" alt="" /></div></div>');
    anchoDivLoading = $("#divLoading").width();
    altoDivLoading = $("#divLoading").height();
    $('#divLoading').css("left", ($(window).width() - anchoDivLoading) / 2 + $(window).scrollLeft() + "px");
    $('#divLoading').css("top", ($(window).height() - altoDivLoading) / 2 + $(window).scrollTop() + "px");
    $('#divLoading').show();
    $('#divOverlayPrincipal').width(screen.width * 3 + "px");
    $('#divOverlayPrincipal').height(screen.height * 3 + "px");
    $('#divOverlayPrincipal').css({ 'z-index': 300 });
    $('#divOverlayPrincipal').show();
}
function HideLoader() {
    $('#divOverlayPrincipal').remove();
}

function ValidarTecleo(e, letras) {
    key = e.keyCode || e.which;
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
function ValidarDocumento(e) {
    return ValidarTecleo(e, "áéíóúabcdefghijklmnñopqrstuvwxyz0123456789");
}
function ValidarSoloLetras(e) {
    return ValidarTecleo(e, "áéíóúabcdefghijklmnñopqrstuvwxyz ");
}
function ValidarSoloNumeros(e) {
    return ValidarTecleo(e, "0123456789");
}
function ValidarSoloLetrasNumeros(e) {
    return ValidarTecleo(e, "abcdefghijklmnñopqrstuvwxyz0123456789");
}
function ValidarHora() {
    return ValidarTecleo("0123456789:");
}
function ValidarDecimal(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();

    if (e.srcElement) elem = e.srcElement;
    else if (e.target) elem = e.target;

    if (elem.value.indexOf('.') > -1 && tecla == '.') {
        return false;
    } else {
        return ValidarTecleo(e, "0123456789.'");
    }
}
function ValidarSoloLetrasSimples(e) {
    return ValidarTecleo(e, "abcdefghijklmnopqrstuvwxyz");
}
function ValidarTelefono(e) {
    return ValidarTecleo(e, "0123456789-#+*()");
}
function ValidarLetrasCaracterEspecial(e) {
    return ValidarTecleo(e, "áéíóúabcdefghijklmnñopqrstuvwxyz0123456789-#+/.,* ");
}
function ValidarTipoSangre(e) {
    return ValidarTecleo(e, "áéíóúabcdefghijklmnñopqrstuvwxyz-+ ");
}

function ValidarSoloBit(e) {
    return ValidarTecleo(e, "01");
}
function ValidarDocumentos(e) {
    return ValidarTecleo(e, "0123456789-");
}

var posicionFec = new Array();
function ValidarFecha(e, control) {
    valor = control.value;

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
            control.value += "/";
            posicionFec[0] = control.value;
            aux = control.value;
            return ValidarTecleo(e, "1234567890/");
        } else if ((valor.length == 2 || valor > 31) && n != 8) {
            //alert("Día no válido");
            control.value = "";
            return false;
        } else if (valor.length == 4) {
            pos1 = valor.indexOf("/");
            var aux = valor.substring(pos1 + 1);
            if (aux > 0 && aux > 1) {
                //alert("Introduzca mes con dos (2) dígitos: 01,02,...,11,12");
                control.value = posicionFec[0];
                return false;
            }
        } else if (valor.length == 5) {
            control.value += "/";
            posicionFec[1] = control.value;
        } else if (valor.length == 7) {
            aux = valor.substring(6);
            if (aux < 1 || aux > 2) {
                control.value = posicionFec[1];
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

function formatJSONDate(jsonDate) {
    /***si viene una fecha JSON de formato /Date(1224043200000)/*****/
    //var newDate = dateFormat(jsonDate, "mm/dd/yyyy");

    var newDate = new Date(parseInt(jsonDate.substr(6)));
    var month = newDate.getMonth() + 1;
    if (month < 10) { month = '0' + month; }
    var day = newDate.getDate();
    if (day < 10) { day = '0' + day; }
    var year = newDate.getFullYear();
    var date = day + "/" + month + "/" + year;

    return date;

}
function ConvertirTextoFecha(FechaTexto) {
    var dia = FechaTexto.substring(0, 2);
    var mes = FechaTexto.substring(3, 5);
    var anio = FechaTexto.substring(6, 10);
    var texto = mes + '/' + dia + '/' + anio;
    texto = Date.parse(texto);
    var fecha = new Date(texto);
    return fecha;
}
//POPUP--------------------------------------------------------------------------------------
var zindexTmp = 0;
function ShowPopUp(idPopUp) {
    ShowPopUp(idPopUp, 1);
}
function ShowPopUp(idPopUp, zindex) {
    if (zindex == 'undefined' || zindex == undefined) {


        zindex = 1;
    }
    zindexTmp = zindex;
    var p = $('#' + idPopUp);

    PosicionarPopUp(idPopUp);
    $(p).css({
        'z-index': 201 + zindex
    });
    $('#' + idPopUp).show();

    if ($("#divOverlayPopUp").length == 0) {
        $('body').append('<div class="overlayPopup" id="divOverlayPopUp"></div>');
    }

    $('#divOverlayPopUp').width(screen.width * 4 + "px");
    $('#divOverlayPopUp').height(screen.height * 4 + "px");
    $('#divOverlayPopUp').css({ 'z-index': (200 + zindex) });
    $('#divOverlayPopUp').show();

}
function HidePopUp(idPopUp) {
    $('#' + idPopUp).hide();
    if (zindexTmp == 1) {
        $('#divOverlayPopUp').hide();
    } else {
        zindexTmp--;
        $('#divOverlayPopUp').css({ 'z-index': 200 + zindexTmp });
    }

}

function PosicionarPopUp(idPopUp) {
    var p = $('#' + idPopUp);
    var left = ($(window).width() / 2 - $(p).width() / 2);

    var altoPopup = $(p).height();
    var altoVentana = window.innerHeight;

    var top = 0;


    if (altoPopup >= altoVentana) {
        top = 10 + $(window).scrollTop();
    } else {
        top = altoVentana / 2 + $(document).scrollTop() - altoPopup / 2 - ((altoVentana / 2) - (altoPopup / 2)) / 2;
    }

    if (top < 0) { top = 10 + $(window).scrollTop(); }
    $(p).css({
        "top": top.toString() + "px"
    });


}


/*Exportar Reporte a PDF*/
function ExportarReportePDF(url, parametros) {
    var param = '';
    for (x in parametros) {
        param += (param == '' ? '' : '&') + x + '=' + parametros[x];
    }

    var o = document.createElement("iframe");
    //o.style.display = "none";
    o.style.position = "absolute";
    o.setAttribute("src", url + '?' + param);
    o.setAttribute("id", "iframedoc")
    document.body.appendChild(o);
    o.style.display = "none";

}

/*DROPDOWN********************************/
$(document).ready(function () {
    $('.dropdown-toggle').click(function () {
        var submenu = $(this.parentNode).find('.dropdown-menu')[0];
        $(submenu).toggle();
        return false;
    });
    $('.menu-toggle').click(function () {
        var submenu = $(this.parentNode).find('.menu-list')[0];
        $(submenu).toggle();
        return false;
    });
    $("body").click(function () {
        var submenu = $(this.parentNode).find('.dropdown-menu')[0];
        $(submenu).hide();
    });
});
/*FIN DROPDOWN****************************/

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function CargarVista(vista) {
    if (vista == '' || vista == '/') {
        return false;
    }
    //if (vista.indexOf("?") > -1) {
    //    vista += "&r=" + Math.random().toString();
    //} else {
    //    vista += "?r=" + Math.random().toString();
    //}
    //$('#divContenido').load(vista);
    location.href = vista;
}

/*MENSJAES*/
var Mensaje = new Object();
$(document).ready(function () {
    Mensaje.InsertOK = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'Datos registrados correctamente.' : 'Datos de ' + entidad + ' registrados correctamente.');
    }
    Mensaje.UpdateOK = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'Datos actualizados correctamente.' : 'Datos de ' + entidad + ' actualizados correctamente.');
    }
    Mensaje.DeleteOK = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'Datos eliminados correctamente.' : 'Datos de ' + entidad + ' eliminados correctamente.');
    }
    Mensaje.Question = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? '¿Está seguro de eliminar el registro?' : '¿Está seguro de eliminar los datos de ' + entidad + '?');
    }
    Mensaje.InsertError = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'No fue posible registrar los datos.' : 'No fue posible registrar los datos de ' + entidad + '.');
    }
    Mensaje.UpdateError = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'No fue posible actualizar los datos.' : 'No fue posible actualizar los datos de ' + entidad + '.');
    }
    Mensaje.DeleteError = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'No fue posible eliminar los datos.' : 'No fue posible elimar los datos de ' + entidad + ' .');
    }
    Mensaje.DeleteErrorFK = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'No fue posible eliminar los datos por tener dependencias.' : 'No fue posible elimar los datos de ' + entidad + ' por tener dependencias.');
    }
    Mensaje.QueryError = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'No fue posible consultar los datos.' : 'No fue posible consultar los datos de ' + entidad + ' .');
    }
    Mensaje.RegistroExistente = function (entidad) {
        return ((entidad == '' || entidad == undefined) ? 'Ya existen los datos del registro.' : 'Ya existen los datos de ' + entidad + ' .');
    }
});

/*MANEJO DE ARCHIVOS*/
/*file = RepositorioParcial más nombre de imagen*/
function HelperSrcImagen(file) {
    var baseUrl = $('base').attr('href');
    return baseUrl + 'Helper/MostrarImagen/?file=' + file;
}
/*tipoarchivo: imagen, audion, video, word, excel, powerpoint, texto*/
function HelperSubirArchivo(inputFile, tipoArchivo, repositorio, callback) {

    if (inputFile.value == "") {
        return;
    }
    var baseUrl = $('base').attr('href');
    var formData = new FormData(inputFile.parentNode);

    formData.append("TipoArchivo", tipoArchivo);
    formData.append("Repositorio", repositorio);
    formData.append("file1", inputFile);

    $(inputFile).parent().prev().after("<span id='pTmpLoading_" + inputFile.id + "' style=' margin-left:5px; display:inline-block'>Cargando...</span>");

    ajaxShowLoader = false;
    $.ajax({
        url: baseUrl + "Helper/SubirArchivo",
        type: "post",
        dataType: "html",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            var obj = JSON.parse(response);
            if (obj.Exito) {
                //$("#" + idImagen).attr("src", baseUrl + 'Helper/MostrarImagen/?file=' + repositorio + '\\' + obj.Nombre + '.' + obj.Extension);
                callback(obj);
            } else {
                alert("Error: " + obj.Mensaje);
            }
        },
        error: function (result) {
            $("#pTmpLoading").remove();
            alert('No se pudo cargar archivo: ' + result.status + ' ' + result.statusText);
        },
        complete: function () {
            ajaxShowLoader = true;
            $("#pTmpLoading_" + inputFile.id).remove();
        }
    })

}


function HelperCrearCombo(idCombo, args, primerElemento, atributoAdicional) {

    var urlServicio = $('base').attr('href') + args.UrlServicio;
    args.Parametros = args.Parametros == undefined ? '' : args.Parametros;
    args.Css = args.Css == undefined ? '' : "class='" + args.Css + "'";
    atributoAdicional = atributoAdicional == undefined ? '' : atributoAdicional;
    primerElemento = primerElemento == undefined ? '' : primerElemento;

    var html = "<select id='" + idCombo + "' " + args.Css + ">";
    if (primerElemento != '') { html += "<option value='' selected>" + primerElemento + "</option>"; }

    $.ajax({
        type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
        url: urlServicio,
        data: args.Parametros,
        async: false,
        success: function (respuesta) {
            var listaDatos = respuesta;
            if ($('#' + idCombo).length) {
                $('#' + idCombo).empty();
            }
            for (var i = 0; i < listaDatos.length; i++) {
                _datoValue = listaDatos[i][args.BoundValueName];
                _datoText = listaDatos[i][args.BoundTextName];
                if (args.BoundName1 != null) { _dato1 = listaDatos[i][args.BoundName1]; }
                if (args.BoundName2 != null) { _dato2 = listaDatos[i][args.BoundName2]; }

                var item = "";
                atrAdicional = atributoAdicional.split("@BoundText").join(_datoText); //REPLACEALL
                atrAdicional = atributoAdicional.split("@BoundValue").join(_datoValue); //REPLACEALL

                if (args.BoundName1 != null) { atrAdicional += " " + args.BoundName1 + "='" + _dato1 + "'"; }
                if (args.BoundName2 != null) { atrAdicional += " " + args.BoundName2 + "='" + _dato2 + "'"; }

                item = "<option value='" + _datoValue + "' " + atrAdicional + " >" + _datoText + "</option>";

                html += item;

                if ($('#' + idCombo).length) {
                    if (i == 0 && primerElemento != '') {
                        $('#' + idCombo).append("<option value='' selected >" + primerElemento + "</option>");

                    }
                    $('#' + idCombo).append(item);
                }
            }

        },
        error: function (result) {
            console.log(JSON.stringify(result));
            alert(Mensaje.QueryError(idCombo), 'error');
        }
    });

    html += "</select>";

    return html;

}