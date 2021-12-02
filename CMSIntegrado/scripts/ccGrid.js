/*******************************************/
//CREADOR: CARLOS CABOS
//VERSION: 2.0
/*******************************************/
var ccGrid = new Array();
/**
 * Inicializa una objeto tabla
 * @param {String} Id de la tabla
 * @param {bool} Indica si la tabla tentrá paginación o no
 * @param {bool} Indica si la tabla tentrá cajas de búsqueda
 * @param {bool} Indica si la tabla tentrá ordenamiento
 * @param {bool} Indica si la tabla tentrá exportación a Excel 
 */
function ccG_Objeto(idTabla, tienePaginacion, tieneBusquedaMultiple, tieneOrdenamiento, tieneExportacion) {
    /*VARIABLES***************/
    this.UnidadMedida = "px";
    this.NumeroColumnas = 0;
    this.Columnas = new Array();
    this.ServicioUrl = "";
    this.ServicioParametros = "";
    this.ServicioExportExcel = "";
    this.Identificadores = "";
    this.PageSize = 10;
    this.PageNumber = 1;
    this.MetodoSelectedRow = "";
    /***********************/
    this.ModoLocal = false;
    this.Datos = null;
    /**********************/
    this.TieneBusquedaMultiple = tieneBusquedaMultiple == undefined ? false : tieneBusquedaMultiple;
    this.TienePaginacion = tienePaginacion == undefined ? false : tienePaginacion;
    this.TieneOrdenamiento = tieneOrdenamiento == undefined ? false : tieneOrdenamiento;
    this.TieneExportacion = tieneExportacion == undefined ? false : tieneExportacion;;
    this.MinWidth = "";
    this.MaxWidth = "";
    this.Filter = "";

    this.NumeroAgrupadores = 0;
    this.Agrupadores = new Array();

    this.NombreDivPaginacion = idTabla + "_divPaginacion";
    this.LabelTotalRegistrosCliendID = idTabla + "_LabelTotalRegistros";
    this.LabelTotalPaginasCliendID = idTabla + "_LabelTotalPaginas";
    this.TexboxPaginaActualCliendID = idTabla + "_TextboxPaginaActual";

    this.IdTabla = idTabla;
    this.FilaSeleccionada = null;
    this.__DatosIniciales = new Array();
    /*******************************************/
    $("#" + this.IdTabla + " tbody ").remove();

    /*METODOS***********************************/
    this.AgregarColumna = function (titulo, campo, busqueda, ancho, alineacion, html) {
        var col = new Array();

        col.TieneCajaBusqueda = ccG_isArray(busqueda) == true ? busqueda[0] : busqueda;
        col.OperadorBusqueda = ccG_isArray(busqueda) == true ? busqueda[1] : "%LIKE%";
        col.Campo = campo;
        col.Titulo = titulo;
        col.Ancho = ancho;
        col.Alineacion = alineacion;
        col.Html = html;

        this.Columnas[this.NumeroColumnas] = col;
        this.NumeroColumnas++;
    };
    this.ObtenerColumnas = function () {
        return this.Columnas;
    };

    this.Inicializar = function () {
        if (this.ModoLocal) {
            for (var i = 0; i < this.Datos.length; i++) {
                this.Datos[i].ccG_Id = i + 1;
                this.Datos[i].ccG_Estado = 'Original';
            }
            this.__DatosIniciales = JSON.parse(JSON.stringify(this.Datos));
        }
        /*VARIABLES************/
        this.SortColumna = '';
        this.SortOrientacion = 'ASC';
        ccGrid[this.IdTabla] = this;
        /****************/
        $('#' + this.IdTabla).empty();

        /*DAMOS EL ANCHO A LA GRILLA********************************/
        var anchoGrid = 0;
        for (i = 0; i < this.Columnas.length; i++) {
            ancho = this.Columnas[i].Ancho;
            anchoGrid += parseInt(ancho);
        }
        /*ANCHO MINIMO***********************************************/
        //if (this.MinWidth == "") this.MinWidth = anchoGrid.toString() + this.UnidadMedida;
        //if (this.MaxWidth == "") this.MaxWidth = anchoGrid.toString() + this.UnidadMedida;

        //$('#' + this.IdTabla).css("width", (this.UnidadMedida == "px" ? anchoGrid.toString() + this.UnidadMedida : this.MaxWidth));
        $('#' + this.IdTabla).css("width", anchoGrid.toString() + this.UnidadMedida);
        if (this.MinWidth !=""){
            $('#' + this.IdTabla).css("min-width", this.MinWidth);
        }
        if (this.MaxWidth != "") {
            $('#' + this.IdTabla).css("max-width", this.MaxWidth);
        }
        /************************************************************/
        var html = "";
        /*AGREGAMOS CAJAS DE BUSQUEDA*******************************************************/
        if (this.TieneBusquedaMultiple) {
            html += "<tr class='filter'>";
            var cajaBusqueda = "<input type='text' OnKeyPress=\" ccGrid['" + this.IdTabla + "'].FiltrarGrid(event); \" id='" + this.IdTabla + "_txtB_@campo'/>";

            for (i = 0; i < this.Columnas.length; i++) {

                if (this.Columnas[i].TieneCajaBusqueda) {
                    html += "<th data-title='" + this.Columnas[i].Titulo + "' style='width:" + this.Columnas[i].Ancho + this.UnidadMedida + "'>" + cajaBusqueda.replace('@campo', this.Columnas[i].Campo) + "</th>";
                } else {
                    html += "<th data-title='" + this.Columnas[i].Titulo + "'  style='width:" + this.Columnas[i].Ancho + this.UnidadMedida + "'></th>"
                }
            }

            html += "</tr>";
            //$('#' + this.IdTabla).append(html);
        }
        /*AGREGAMOS COLSPAN DE CABECERAS*******************************************************/
        if (this.Agrupadores.length > 0) {
            html += "<tr>";

            for (i = 0; i < this.Columnas.length; i++) {
                esgrupo = false;
                for (x = 0; x < this.Agrupadores.length; x++) {
                    if (this.Agrupadores[x].Inicio <= i + 1 && this.Agrupadores[x].Fin >= i + 1) {
                        esgrupo = true;
                        if (this.Agrupadores[x].Inicio == i + 1) {
                            html += "<th colspan=" + (this.Agrupadores[x].Fin - this.Agrupadores[x].Inicio + 1).toString() + ">" + this.Agrupadores[x].Titulo + "</th>";
                        }
                    }
                }
                if (esgrupo == false) {
                    if (this.TieneOrdenamiento) {
                        html += "<th  style='width:" + this.Columnas[i].Ancho + this.UnidadMedida + "' rowspan=2><a id='a_" + this.Columnas[i].Campo + "' OnClick=\"ccGrid['" + this.IdTabla + "'].OrdenarGrid('" + this.Columnas[i].Campo + "')\">" + this.Columnas[i].Titulo + "</a></th>";
                    } else {
                        html += "<th  style='width:" + this.Columnas[i].Ancho + this.UnidadMedida + "' rowspan=2>" + this.Columnas[i].Titulo + "</th>";
                    }
                }
            }
            html += "</tr>";
        }
        /******************************************************************************/
        /*AGREGAMOS CABECERAS*******************************************************/
        html += "<tr>";
        for (i = 0; i < this.Columnas.length; i++) {
            esgrupo = false;
            if (this.Agrupadores.length > 0) {
                for (x = 0; x < this.Agrupadores.length; x++) {
                    if (this.Agrupadores[x].Inicio <= i + 1 && this.Agrupadores[x].Fin >= i + 1) {
                        esgrupo = true;
                    }
                }
            } else {
                esgrupo = true;
            }
            if (esgrupo) {
                if (this.TieneOrdenamiento) {
                    html += "<th  style='width:" + this.Columnas[i].Ancho + this.UnidadMedida + ";'><a id='a_" + this.Columnas[i].Campo + "' OnClick=\"ccGrid['" + this.IdTabla + "'].OrdenarGrid('" + this.Columnas[i].Campo + "')\" >" + this.Columnas[i].Titulo + "</a></th>";
                } else {
                    html += "<th  style='width:" + this.Columnas[i].Ancho + this.UnidadMedida + ";'>" + this.Columnas[i].Titulo + "</th>";
                }
            }

        }
        html += "</tr>";

        $('#' + this.IdTabla).append("<thead>" + html + "</thead>");
        /******************************************************************************/
        pager = "<div id='" + this.NombreDivPaginacion + "' >@Paginacion@Exportar</div>";

        if (this.TienePaginacion) {
            pager = pager.replace("@Paginacion",
                '<nav class="cont-nav">' +
                '<a href="" onclick=\'return ccGrid["' + this.IdTabla + '"].PaginarGrid("first");\'><span class="fas fa-angle-double-left"></span></a>' +
                '<a href="" onclick=\'return ccGrid["' + this.IdTabla + '"].PaginarGrid("previous");\'><span class="fas fa-angle-left"></span></a>' +
                '<a href="" onclick=\'return ccGrid["' + this.IdTabla + '"].PaginarGrid("next");\'><span class="fas fa-angle-right"></span></a>' +
                '<a href="" onclick=\'return ccGrid["' + this.IdTabla + '"].PaginarGrid("last");\'><span class="fas fa-angle-double-right"></span></a>' +
                '<input id="' + this.TexboxPaginaActualCliendID + '" type="text" value="1" class="cont-nav-n" onkeypress="if (ccG_ValidaSoloNumeros(event))return ccGrid[\'' + this.IdTabla + '\'].PaginarGrid(\'current\', event); else return false;">' +
                '<p>de <label id="' + this.LabelTotalPaginasCliendID + '"></label> páginas, N° de registros: <label id="' + this.LabelTotalRegistrosCliendID + '"></label>				</p>' +
                '</nav>'
                )
            //pager = pager.replace("@Paginacion", "<button class='first' onclick='return ccGrid[\"" + this.IdTabla + "\"].PaginarGrid(\"first\");' ><span class='icon-first'/></button> " +
            //    "<button class='previous' onclick='return ccGrid[\"" + this.IdTabla + "\"].PaginarGrid(\"previous\");'><span class='icon-previous2'/></button> " +
            //    "<button class='next' onclick='return ccGrid[\"" + this.IdTabla + "\"].PaginarGrid(\"next\");' ><span class='icon-next2'/></button> " +
            //    "<button class='last' onclick='return ccGrid[\"" + this.IdTabla + "\"].PaginarGrid(\"last\");' ><span class='icon-last'/></button> " +
            //    "<input type='text' id='" + this.TexboxPaginaActualCliendID + "' value='1' onkeypress='if (ccG_ValidaSoloNumeros(event))return ccGrid[\"" + this.IdTabla + "\"].PaginarGrid(\"current\", event); else return false;' style='width:30px' onpaste='return false;' /> " +
            //    "<label>&nbsp;de&nbsp;</label> " +
            //    "<label id='" + this.LabelTotalPaginasCliendID + "'></label>" +
            //    "<label id='" + this.IdTabla + "_lblpaginas'></label>" +
            //    "<label> | Total Registros: </label>" +
            //    "<label id='" + this.LabelTotalRegistrosCliendID + "'></label>");
        } else {
            pager = pager.replace("@Paginacion", "");
        }
        if (this.TieneExportacion) {
            pager = pager.replace("@Exportar", "<div class='btnExcel'   onclick='ccG_ExportarExcel(\"" + this.IdTabla + "\");'><img />Exportar<div>");
        } else {
            pager = pager.replace("@Exportar", "");
        }
        if (this.TieneExportacion || this.TienePaginacion) {
            $('#' + this.NombreDivPaginacion).remove();
            //$('#' + this.IdTabla).after(pager);
            $('#' + this.IdTabla).append("<tfoot><tr><td colspan=" + this.Columnas.length + ">" + pager + "</td></tr></tfoot>");
            //$('#' + this.NombreDivPaginacion).css("width", (this.UnidadMedida == "px" ? (anchoGrid - 6).toString() + this.UnidadMedida : this.MaxWidth));
            //$('#' + this.NombreDivPaginacion).css("min-width", this.MinWidth);
        }

        this.CargarDatos();

    };
    this.CargarDatos = function () {
        var DatosTmp = this.Datos;
        var PageNumber = 1;
        var pageSize = 0;
        var sorting = '';
        /*VALIDAMOS EL SORTING***********************************/
        if (this.TieneOrdenamiento && this.SortColumna != '') {
            sorting = this.SortColumna + ' ' + this.SortOrientacion;

            if (this.ModoLocal) {
                _ccG_SortColumna = this.SortColumna;

                if (this.SortOrientacion == 'ASC') {
                    DatosTmp.sort(ccG_CompareASC);
                } else {
                    DatosTmp.sort(ccG_CompareDESC);
                }
            }
        }
        /*VALIDAMOS EL FILTRO***********************************/
        var filter = '';
        var IdTabla = this.IdTabla;
        Columnas = this.Columnas;
        modoLocal = this.ModoLocal;
        if (this.TieneBusquedaMultiple) {
            $("#" + this.IdTabla + " thead>tr:first :input").each(function () {
                if (this.type == 'text') {
                    if (this.value != "") {

                        operador = "%LIKE%";
                        filterTmp = "";

                        idCampo = this.id.replace(IdTabla + '_txtB_', '');
                        for (x = 0; x < Columnas.length; x++) {
                            if (Columnas[x].Campo == idCampo) {
                                operador = Columnas[x].OperadorBusqueda;
                                break;
                            }
                        }
                        v = this.value.replace('\\', '\\\\');
                        if (modoLocal == false) {
                            switch (operador) {
                                case "%LIKE%": filterTmp = idCampo + " like \\'%" + v + "%\\'"; break;
                                case "LIKE%": filterTmp = idCampo + " like \\'" + v + "%\\'"; break;
                                case "%LIKE": filterTmp = idCampo + " like \\'%" + v + "\\'"; break;
                                case "=": filterTmp = idCampo + " = \\'" + v + "\\'"; break;
                                case "!=": filterTmp = idCampo + " != \\'" + v + "\\'"; break;
                                case ">": filterTmp = idCampo + " > \\'" + v + "\\'"; break;
                                case "<": filterTmp = idCampo + " < \\'" + v + "\\'"; break;
                                case ">=": filterTmp = idCampo + " >= \\'" + v + "\\'"; break;
                                case "<=": filterTmp = idCampo + " <= \\'" + v + "\\'"; break;
                                default: filterTmp = idCampo + " like \\'%" + v + "%\\'"; break;
                            }
                            if (filter == "") { filter = filterTmp; } else { filter += " AND " + filterTmp; }
                        } else {
                            //MODO CLIENTE
                            v = v.toLowerCase();
                            switch (operador) {
                                case "%LIKE%": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo].toString()).toLowerCase().indexOf(v) > -1; }); break;
                                case "LIKE%": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo].toString()).toLowerCase().indexOf(v) == 0; }); break;
                                case "%LIKE": DatosTmp = DatosTmp.filter(function (entry) { return ((entry[idCampo] == undefined ? '' : entry[idCampo]).length - (entry[idCampo] == undefined ? '' : entry[idCampo].toString()).toLowerCase().indexOf(v)) == v.length; }); break;
                                case "=": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo].toString()).toLowerCase() == v.toLowerCase(); }); break;
                                case "!=": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo].toString()).toLowerCase() != v.toLowerCase(); }); break;
                                case ">": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo]) > v; }); break;
                                case "<": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo]) < v; }); break;
                                case ">=": DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo]) >= v; }); break;
                                case "<=": DatosTmp = DatosTmp.filter(function (entry) { return entry[idCampo] <= v; }); break;
                                default: DatosTmp = DatosTmp.filter(function (entry) { return (entry[idCampo] == undefined ? '' : entry[idCampo].toString()).toLowerCase().indexOf(v) > -1; }); break;
                            }
                        }

                    }
                }
            });

        }




        /*CARGAMOS LA DATA***********************************/

        if (this.ModoLocal) {
            DatosTmp = DatosTmp.filter(function (entry) { return entry.ccG_Estado != 'Eliminado'; });
            /*VALIDAMOS EL PAGINACION***********************************/
            if (this.TienePaginacion) {
                PageNumber = this.PageNumber;
                pageSize = this.PageSize;
                RecordCount = 0;
                pageCount = 0;
                if (this.ModoLocal) {
                    if (DatosTmp.length > 0) {
                        RecordCount = DatosTmp.length;
                        pageCount = Math.ceil(RecordCount / pageSize);
                        if (PageNumber > pageCount) { PageNumber = pageCount; }
                        rowStart = (PageNumber * pageSize) - (pageSize - 1);
                        rowEnd = (PageNumber * pageSize);
                        if (rowEnd > RecordCount) { rowEnd = RecordCount }
                        _datos = new Array();
                        for (var i = rowStart - 1; i < rowEnd; i++) {
                            DatosTmp[i].RecordCount = RecordCount;
                            DatosTmp[i].PageCount = pageCount;
                            DatosTmp[i].PageNumber = PageNumber;

                            _datos.push(DatosTmp[i]);
                        }
                        DatosTmp = _datos;
                    }
                }
            }
            /*PINTAMOS LOS DATOS*******************/
            this.__PintarDatos(DatosTmp);
        } else {

            /*VALIDAMOS PARAMETOS PARA EL METODO*/
            var parametros = "";

            this.Filter = filter;
            if (this.TieneBusquedaMultiple) {
                parametros += "Filter:'" + filter + "'";
            }
            if (this.TieneOrdenamiento) {
                if (parametros != "") parametros += ", ";
                parametros += "Sorting:'" + sorting + "'";
            }
            if (this.TienePaginacion) {
                if (parametros != "") parametros += ", ";
                parametros += "PageNumber:" + this.PageNumber + ",PageSize:" + this.PageSize;
            }

            if (parametros != "" && this.ServicioParametros != "") parametros += ", ";
            parametros = "{" + parametros + this.ServicioParametros + "}";

            obj = this;
            $.ajax({
                type: "POST", contentType: "application/json; charset=utf-8", dataType: "json",
                url: this.ServicioUrl,
                data: parametros,
                success: function (response) {
                    for (var i = 0; i < response.length; i++) {
                        response[i].ccG_Id = i + 1;
                        response[i].ccG_Estado = 'Original';
                    }
                    obj.__PintarDatos(response);
                },
                error: function (result) {
                    alert('Error al consultar datos.');
                },
                complete: function (result) {
                }
            });

        }
    };


    this.__PintarDatos = function (listado) {
        /**********************************************************************************/
        /*PINTAMOS LOS DATOS EN LA TABLA***************************************************/

        var rc = 0; //RecordCount
        var pc = 1; //PageCount
        var pn = 1; //PageNumber
        if (listado.length > 0 && this.TienePaginacion) {
            rc = listado[0].RecordCount;
            pc = listado[0].PageCount;
            pn = listado[0].PageNumber;
        }
        /*LIMPIAMOS REGISTROS***********************************/
        this.__LimpiarGrid();

        /*VALIDAMOS SORTING***********************************/

        var html = "";
        var ids = this.Identificadores.split(',');
        MetodoSelected = "";
        if (this.MetodoSelectedRow != "") {
            MetodoSelected = this.MetodoSelectedRow;
        }

        for (var i = 0; i < listado.length; i++) {
            html += "<tr>";
            /*CREAMOS EL DATAKEY***********************************************/
            llave = listado[i].ccG_Id;
            if (this.Identificadores != "") {
                llave = llave + '##' + this.Identificadores.split(",").join("##");
                for (var x = 0; x < ids.length; x++) {
                    llave = llave.replace(ids[x], listado[i][ids[x]]);
                }
            }
            llave = "<input id='" + this.IdTabla + "_ccG_Id_" + i + "' type='hidden' value='" + llave + "' style='visibility:hidden'/>";

            /*******************************************************************/
            var dobleclick = "";
            dobleclick = "OnClick=\"ccGrid['" + this.IdTabla + "'].__SeleccionarFila(this);" + MetodoSelected + " \"";
            for (var c = 0; c < this.Columnas.length; c++) {
                tipo = this.Columnas[c].Tipo;

                html += "<td data-title='" + this.Columnas[c].Titulo + "' style='width:" + this.Columnas[c].Ancho + this.UnidadMedida + "' align='" + this.Columnas[c].Alineacion + "'" + dobleclick + " >";

                valor = listado[i][this.Columnas[c].Campo];
                if (valor == null || valor == undefined) {
                    valor = '';
                }
                if (this.Columnas[c].Html == '') {
                    if (valor.toString().indexOf('/Date') > -1) {
                        html += ccG_formatJSONDate(valor);
                    } else {
                        html += valor == 'null' ? '' : valor;
                    }
                } else {

                    _tmp = this.Columnas[c].Html;

                    //REEMPLAZAMOS LOS VALORES DE LOS CAMPOS QUE SE HAGAN REFERENCIA EN EL TEMPLATE
                    for (var atrib in listado[i]) {
                        v = listado[i][atrib];
                        if (v != null) {
                            if (v.toString().indexOf('/Date') > -1) {
                                v = ccG_formatJSONDate(v);
                            }
                        }
                        v = v == null ? '' : v;
                        _tmp = _tmp.split("#" + atrib).join(v); //EQUIVALENTE A REPLACEALL
                    }
                    //------------------------------------                     
                    _tmp = _tmp.split("@Value").join(valor); //REPLACEALL
                    _tmp = _tmp.split("@Id").join(this.Columnas[c].Campo); //REPLACEALL
                    _if = _tmp.split('#JS');
                    for (var y = 1; y <= _if.length; y++) {
                        if (y % 2 == 0) {
                            _eval = _if[y - 1];
                            _evalResul = '';
                            try {
                                _evalResul = eval(_eval);
                            } catch (ex) { }
                            _tmp = _tmp.replace('#JS' + _eval + '#JS', _evalResul);
                        }
                    }

                    html += _tmp;
                }
                if (c == 0) {
                    html += llave;
                }
                html += "</td>";

            }
            html += "</tr>";
        }
        $('#' + this.IdTabla).append("<tbody>" + html + "</tbody>");

        if (this.TienePaginacion) {
            if (pc <= 1) {
                if (rc == 0) {
                    $("#" + this.NombreDivPaginacion).empty();
                    $("#" + this.NombreDivPaginacion).append("<p style='padding:10px; text-align:center'>No se encontraron registros.</p>");
                } else {
                    $("#" + this.NombreDivPaginacion).hide();
                }
            } else {
                $("#" + this.NombreDivPaginacion).show();
                this.PageNumberActiva = pn;
                document.getElementById(this.LabelTotalRegistrosCliendID).innerHTML = rc;
                document.getElementById(this.LabelTotalPaginasCliendID).innerHTML = pc;
                $('#' + this.TexboxPaginaActualCliendID).val(pn);
                //if (pc > 1) {
                //    document.getElementById(this.IdTabla + '_lblpaginas').innerHTML = '&nbsp;páginas&nbsp;';
                //} else {
                //    document.getElementById(this.IdTabla + '_lblpaginas').innerHTML = '&nbsp;página&nbsp;';
                //}
            }
        }


    }

    this.__LimpiarGrid = function () {
        $("#" + this.IdTabla + " TBODY TR").each(function () {
            if (this.getElementsByTagName("td").length > 0) {
                //if (this.childNodes(0).tagName == 'TD') {
                $(this).remove();
                //}
            }
        });
    };
    /*FUNCIONES PARA MODO CLIENTE*/
    this.AgregarFila = function (item) {
        if (this.ModoLocal) {
            this.__ActualizarDatos();            
        }
        /*Obtenemos el mayor valor de ccG_Id + 1***********/
        ccG_Id_new = 1;
        if (this.Datos.length > 0) {
            datosTmp = this.Datos.slice(0);
            _ccG_SortColumna = 'ccG_Id';
            datosTmp.sort(ccG_CompareDESC);
            ccG_Id_new = datosTmp[0].ccG_Id + 1;
        }
        /*******************************************/
        if (item == undefined) {
            this.Datos.push({ ccG_Id: ccG_Id_new, ccG_Estado: 'Nuevo' });
        } else {
            item.ccG_Id = ccG_Id_new;
            item.ccG_Estado = 'Nuevo';
            this.Datos.push(item);
        }
        if (this.TienePaginacion) {
            this.PaginarGrid('last');
        } else {
            this.CargarDatos();
        }
    }
    this.EliminarFila = function (ccg_Id, confirmacion, mensaje) {
        if (confirmacion) {
            obj = this;
            mensaje = (mensaje == undefined || mensaje == '') ? '¿Desea eliminar registro?' : mensaje;
            confirm(mensaje, function (result) {
                if (result) {
                    for (var d = 0; d < obj.Datos.length; d++) {
                        if (obj.Datos[d].ccG_Id == ccg_Id) {
                            //obj.Datos.splice(d, 1);
                            obj.Datos[d].ccG_Estado = 'Eliminado';
                            break;
                        }
                    }
                    obj.__ActualizarDatos();
                    obj.CargarDatos();
                }
            });
        } else {
            for (var d = 0; d < this.Datos.length; d++) {
                if (this.Datos[d].ccG_Id == ccg_Id) {
                    //this.Datos.splice(d, 1);
                    this.Datos[d].ccG_Estado = 'Eliminado';
                    break;
                }
            }
            this.__ActualizarDatos();
            this.CargarDatos();
        }

    }
    //Actualiza la variable Datos con la información de la tabla
    this.__ActualizarDatos = function () {
        pi = 1;
        ps = this.Datos.length;

        if (this.ModoLocal) {
            pi = this.PageNumber;
            ps = this.PageSize;
        }
        columnas = this.Columnas;


        obj = this;
        index = 0;
        $("#" + idTabla + " tbody>tr").each(function () {
            ids = obj.ObtenerIdsPorIndex(index);
            for (var i = 0; i < columnas.length; i++) {
                campo = columnas[i].Campo;
                if (campo.trim() != '') {                    
                    var elemento = $(this).find("input[id*='" + campo + "']")[0];
                    if (elemento == undefined) {
                        elemento = $(this).find("select[id*='" + campo + "']")[0];
                    }
                    if (elemento == undefined) {
                        elemento = $(this).find("textarea[id*='" + campo + "']")[0];
                    }
                    
                    if (elemento != undefined) {
                        //buscamos                         
                        for (var d = 0; d < obj.Datos.length; d++) {
                            if (obj.Datos[d].ccG_Id == ids.ccG_Id) {
                                if (elemento.type == 'text') {
                                    obj.Datos[d][campo] = elemento.value;
                                }
                                if (elemento.type == 'checkbox') {
                                    obj.Datos[d][campo] = elemento.checked ? true : false;
                                }
                                if (elemento.type == 'select' || 'select-one') {                                    
                                    obj.Datos[d][campo] = elemento.value;
                                }
                                break;
                            }
                        }
                    }
                }
            }
            index++;
        });
    };

    /*******************************/
    this.LimpiarCajasBusqueda = function () {
        $("#" + this.IdTabla + " tbody>tr:first :input").each(function () {
            if (this.type == 'text') {
                this.value = "";
            }
        });
    }
    this.CantidadFilas = function () {
        var n = ($("#" + this.IdTabla))[0].rows.length;
        n--;//Quitamos la cabcera        
        if (this.TieneBusquedaMultiple) { n--; }; //Quitamos la fila de búsqueda múltiple
        if (this.Agrupadores.length > 0) { n--; }; //Quitamos la fila de los agrupadores
        if (this.TienePaginacion > 0) { n--; }; //Quitamos la fila de la paginacion
        return n < 0 ? 0 : n;
    }
    this.ObtenerFilaPorIndex = function (index) {
        var gv = document.getElementById(this.IdTabla);
        index++;//Cabecera
        if (this.TieneBusquedaMultiple) { index++; }
        if (this.Agrupadores.length > 0) { index++; }

        if (gv != null) {
            if (gv.rows.length > index) {
                return gv.rows[index];
            } else {
                return null;
            }
        }
    }
    this.ObtenerIdsPorIndex = function (index) {
        var fila = new Array();
        identificadores = 'ccG_Id' + (this.Identificadores == '' ? '' : ',') + this.Identificadores;

        var ids = identificadores.split(',');
        hf = $('#' + this.IdTabla + '_ccG_Id_' + index)[0];

        if (hf.type == 'hidden') {
            var valores = hf.value.split('##');
            for (var i = 0; i < valores.length; i++) {
                fila[ids[i]] = valores[i];
            }
        }

        return fila;
    }
    //this.ObtenerIdsPorControl = function (control) {
    //    row = $(control).parent().parent();

    //    var fila = new Array();
    //    var ids = this.Identificadores.split(',');
    //    row.find("input").each(function () {
    //        if (this.type == 'hidden') {
    //            var valores = this.value.split(',');
    //            for (var i = 0; i < valores.length; i++) {
    //                fila[ids[i]] = valores[i];
    //            }
    //        }
    //    });
    //    return fila;
    //}
    /*Exportar a Excel*/
    this.ExportarExcel = function () {
        var campos = new Array();
        x = 0;
        for (i = 0; i < this.Columnas.length; i++) {
            if (this.Columnas[i].Tipo == "Item") {

                campos[x] = { Titulo: this.Columnas[i].Titulo, Campo: this.Columnas[i].Campo }
                x++;
            }

        }

        var o = document.createElement("iframe");
        o.style.display = "none";

        pCadena = '';
        if (this.Parametros.length > 0) {
            parms = this.Parametros.split(',');
            for (p = 0; p < parms.length; p++) {
                pCadena += '&' + parms[p].split(':')[0].split("'").join("").trim() + '=' + parms[p].split(':')[1].split("'").join("").trim();
            }
        }

        o.setAttribute("src", this.UrlExportExcel + '?columns=' + JSON.stringify(campos) + "&filter=" + encodeURI(this.Filter.split("\\").join("")) + pCadena);
        document.body.appendChild(o);
    }
    this.FiltrarGrid = function (e) {
        if (e.keyCode == 13) {
            if (this.ModoLocal) {
                this.__ActualizarDatos();
            }
            $('#' + this.TexboxPaginaActualCliendID + '').val('1');
            this.CargarDatos();
            return false;
        }
        //    if (!(
        //    e.keyCode == 9 //TAB
        //    || e.keyCode == 17 //CONTROL
        //    || e.keyCode == 16 //SHIFT
        //    || e.keyCode == 33 //Re. PAG
        //    || e.keyCode == 34 //Av. PAG
        //    || e.keyCode == 35 //FIN
        //    || e.keyCode == 36 //INICIO
        //    )) {
        //        flag++;
        //        setTimeout('ControlarTecleo(' + flag + ',\'' + IdTabla + '\')', 300);

        //    }
    }
    this.OrdenarGrid = function (campo) {
        if (this.SortColumna == '') {
            this.SortColumna = campo;
        } else {
            if (this.SortColumna == campo) {
                if (this.SortOrientacion == 'ASC') {
                    this.SortOrientacion = 'DESC'
                } else {
                    this.SortOrientacion = 'ASC';
                }
            } else {
                this.SortOrientacion = 'ASC';
                this.SortColumna = campo;
            }
        }
        if (this.ModoLocal) {
            this.__ActualizarDatos();
        }

        this.CargarDatos();
        return false;
    }
    //    if (!(
    //    e.keyCode == 9 //TAB
    //    || e.keyCode == 17 //CONTROL
    //    || e.keyCode == 16 //SHIFT
    //    || e.keyCode == 33 //Re. PAG
    //    || e.keyCode == 34 //Av. PAG
    //    || e.keyCode == 35 //FIN
    //    || e.keyCode == 36 //INICIO
    //    )) {
    //        flag++;
    //        setTimeout('ControlarTecleo(' + flag + ',\'' + IdTabla + '\')', 300);

    //    }

    this.PaginarGrid = function (tipo, event) {
        //obj = ccGrid[idTabla];

        /********************/
        if (this.ModoLocal) {
            this.__ActualizarDatos();
            DatosTmp = this.Datos;
            DatosTmp = DatosTmp.filter(function (entry) { return entry.ccG_Estado != 'Eliminado'; });
            RecordCount = DatosTmp.length;
            pageCount = Math.ceil(RecordCount / this.PageSize);
            document.getElementById(this.LabelTotalPaginasCliendID).innerHTML = pageCount;
        }
        /********************/

        var PageNumber = $('#' + this.TexboxPaginaActualCliendID).val();

        if (PageNumber == '') PageNumber = 1;
        PageNumber = parseInt(PageNumber);
        var pageCount = parseInt(document.getElementById(this.LabelTotalPaginasCliendID).innerHTML);
        if (tipo == 'first') {
            PageNumber = 1;
        }
        if (tipo == 'previous') {
            if (PageNumber > 1) {
                PageNumber--;
            }
        }
        if (tipo == 'next') {
            if (PageNumber < pageCount) {
                PageNumber++;
            }
        }
        if (tipo == 'last') {
            PageNumber = pageCount;
        }
        if (tipo == 'current') {
            if (event.keyCode != 13) {
                return true;
            } else {
                if (PageNumber > pageCount) {
                    PageNumber = pageCount;
                }
                if (PageNumber < 1) {
                    PageNumber = 1;
                }
            }

        }
        if (this.PageNumberActiva != PageNumber || this.ModoLocal) {
            this.IndexLastSelectedRow = -1;
            this.PageNumber = PageNumber;

            $('#' + this.TexboxPaginaActualCliendID).val(PageNumber);
            this.CargarDatos();
        }

        return false;
    }
    this.BotonEliminarLocal = function (confirmacion, mensaje) {
        return "<button onclick='ccGrid[\"gridUsuarios\"].EliminarFila(#ccG_Id," + (confirmacion == undefined ? 'false' : confirmacion.toString()) + ",\"" + (mensaje == undefined ? '' : mensaje) + "\");' title='Eliminar'><span class='icon-cancel-circle'></button>";
    }
    this.ObtenerDatos = function () {
        //Actualizamos Datos        
        this.__ActualizarDatos();
        //ValidamosModificaciones        
        for (var i = 0; i < this.__DatosIniciales.length; i++) {
            for (var j = 0; j < this.Datos.length; j++) {
                //buscamos el elemento equivalente
                if (this.__DatosIniciales[i].ccG_Id == this.Datos[j].ccG_Id) {
                    var cambio = false;
                    //verificamos si hubo cambios
                    for (var c = 0; c < this.Columnas.length; c++) {
                        campo = this.Columnas[c].Campo;
                        if (this.__DatosIniciales[i][campo] != this.Datos[j][campo] && this.Datos[j].ccG_Estado != 'Eliminado') {
                            cambio = true;
                        }
                    }
                    if (cambio) {
                        this.Datos[j].ccG_Estado = 'Editado';
                    }
                    break;
                }
            }
        }
        //-------------------------------
        return this.Datos;
    }
    this.__SeleccionarFila = function (btn) {

        row = $(btn).parents("tr:first");
        $(row).addClass('selected').siblings().removeClass("selected");
        this.FilaSeleccionada = row;
    }
}



function ccG_formatJSONDate(jsonDate) {
    /***si viene una fecha JSON de formato /Date(1224043200000)/*****/
    //var newDate = dateFormat(jsonDate, "mm/dd/yyyy");

    var newDate = new Date(parseInt(jsonDate.replace('/Date(', '')));
    newDate = new Date(newDate.valueOf() + newDate.getTimezoneOffset() * 60 * 1000);

    //alert(newDate.toDateString());
    var month = newDate.getMonth() + 1;
    if (month < 10) { month = '0' + month; }
    var day = newDate.getDate();
    if (day < 10) { day = '0' + day; }
    var year = newDate.getFullYear();
    var date = day + "/" + month + "/" + year;

    return date;


}
function ccG_ValidaSoloNumeros(event) {
    key = event.keyCode || event.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "0123456789";
    especiales = [8, 37, 39, 46, 13];

    tecla_especial = false
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    } else {
        return true;
    }
}
function ccG_isArray(value) {
    return Object.prototype.toString.call(value) === "[object Array]";
}
//ESTAS FUNCIONES SIRVEN PARA EL SORTING
var _ccG_SortColumna = '';
function ccG_CompareASC(a, b) {
    if (a[_ccG_SortColumna] != undefined && b[_ccG_SortColumna] != undefined) {
        _a = $.isNumeric(a[_ccG_SortColumna]) ? a[_ccG_SortColumna] : a[_ccG_SortColumna].toString().toLowerCase();
        _b = $.isNumeric(b[_ccG_SortColumna]) ? b[_ccG_SortColumna] : b[_ccG_SortColumna].toString().toLowerCase();

        if (_a < _b)
            return -1;
        if (_a > _b)
            return 1;
    }
    return 0;
}
function ccG_CompareDESC(a, b) {
    if (a[_ccG_SortColumna] != undefined && b[_ccG_SortColumna] != undefined) {
        _a = $.isNumeric(a[_ccG_SortColumna]) ? a[_ccG_SortColumna] : a[_ccG_SortColumna].toString().toLowerCase();
        _b = $.isNumeric(b[_ccG_SortColumna]) ? b[_ccG_SortColumna] : b[_ccG_SortColumna].toString().toLowerCase();

        if (_a > _b)
            return -1;
        if (_a < _b)
            return 1;
    }
    return 0;
}
