// Apprise 1.5 modificado por CCLL
// 

function alert(string) {
    apprise(string);
}
//tipoIcono: "warning","question", "check","error"
function alert(string, tipoIcono, callback) {
    apprise(string, { 'verify': false, 'iconType': tipoIcono }, callback);
}
function confirm(string, callback) {
    apprise(string, { 'verify': true }, callback);
}
function apprise(string, args, callback) {
    var default_args =
		{
		    'confirm': false, 		// Ok and Cancel buttons
		    'verify': false, 	// Yes and No buttons
		    'input': false, 		// Text input (can be true or string for default text)
		    'animate': false, 	// Groovy animation (can true or number, default is 400)
		    'textOk': 'Aceptar', 	// Ok button default text
		    'textCancel': 'Cancelar', // Cancel button default text
		    'textYes': 'S&iacute;', 	// Yes button default text
		    'textNo': 'No',		// No button default text
		    'iconType': ''
		}

    if (args) {
        for (var index in default_args)
        { if (typeof args[index] == "undefined") args[index] = default_args[index]; }
    } else {
        args = default_args;
    }

    var baseUrl = $('base').attr('href');
    if (args.iconType == "" && args.verify) {
        args.iconType = 'question';
    }

    iconClass = alert_icono(args.iconType);
    if (args.iconType == '') {
        args.iconType = 'info';
    }
    
    var aHeight = $(document).height() * 3;
    var aWidth = $(document).width() * 3;
    $('body').append('<div class="appriseOverlay" id="aOverlay"></div>');
    $('.appriseOverlay').css('height', aHeight).css('width', aWidth).fadeIn(100);
    $('body').append('<div class="appriseOuter"></div>');
    if (iconClass == '') {
        $('.appriseOuter').append('<div class="appriseInner"><table class="appriseMensaje"><tr><td style="width:100%; align:left;">' + string + '</td></tr></table></div>');
        $('.appriseOuter').css("width", "350px");
    } else {
        $('.appriseOuter').append('<div class="appriseInner"><table class="appriseMensaje"><tr><td style="width:10%; text-align:center; background-color:#fff;" class="alert_' + args.iconType.toLowerCase() + '"><span class="' + iconClass + '"></span></td><td style="width:90%; align:left; padding-left:10px;font-family: Arial;">' + string + '</td></tr></table></div>');
        $('.appriseOuter').css("width", "350px");
    }
    $('.appriseOuter').css("left", ($(window).width() - $('.appriseOuter').width()) / 2 + $(window).scrollLeft() + "px");
    //CCLL-13-04-2016--
    $('.appriseOverlay').css("z-index", "410");
    $('.appriseOuter').css("z-index", "411");
    //--------------


    if (args) {
        if (args['animate']) {
            var aniSpeed = args['animate'];
            if (isNaN(aniSpeed)) { aniSpeed = 400; }
            $('.appriseOuter').css('top', '-200px').show().animate({ top: "100px" }, aniSpeed);
        }
        else { $('.appriseOuter').css('top', ($(window).height() / 2 - $(window).height() / 4) + 'px').fadeIn(200); }
    }
    else { $('.appriseOuter').css('top', ($(window).height() / 2 - $(window).height() / 4) + 'px').fadeIn(200); }

    if (args) {
        if (args['input']) {
            if (typeof (args['input']) == 'string') {
                $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" value="' + args['input'] + '" /></div>');
            }
            else {
                $('.appriseInner').append('<div class="aInput"><input type="text" class="aTextbox" t="aTextbox" /></div>');
            }
            $('.aTextbox').focus();
        }
    }

    $('.appriseInner').append('<div class="aButtons"></div>');
    if (args) {
        if (args['confirm'] || args['input']) {
            $('.aButtons').append('<button id="appriseOk" value="ok" onblur="$(\'#appriseCancel\').focus();">' + args['textOk'] + '</button>');
            $('.aButtons').append('<button id="appriseCancel" value="cancel" onblur="$(\'#appriseOk\').focus();">' + args['textCancel'] + '</button>');
            //CCLL-13-04-2016--
            $('#appriseCancel').focus();
            //--------------
        }
        else if (args['verify']) {
            $('.aButtons').append('<button id="appriseOk" value="ok" onblur="$(\'#appriseCancel\').focus();">' + args['textYes'] + '</button>');
            $('.aButtons').append('<button id="appriseCancel" value="cancel" onblur="$(\'#appriseOk\').focus();">' + args['textNo'] + '</button>');
            //CCLL-13-04-2016--
            $('#appriseCancel').focus();
            //--------------
        }
        else {
            $('.aButtons').append('<button id="appriseOk" value="ok">' + args['textOk'] + '</button>');
            //CCLL-13-04-2016--
            $('#appriseOk').focus();
            //--------------         
        }
    }
    else {
        $('.aButtons').append('<button id="appriseOk" value="ok">' + args['textOk'] + '</button>');
        //$('.aButtons').append('<input id="appriseOk" value="ok"/>');// + args['textOk'] + '</button>');  
        //CCLL-13-04-2016--
        $('#appriseOk').focus();
        //--------------       
    }

    $(document).keydown(function (e) {
        if ($('.appriseOverlay').is(':visible')) {
            if (e.keyCode == 13)
            { $('.aButtons > button[value="ok"]').click(); }
            if (e.keyCode == 27)
            { $('.aButtons > button[value="cancel"]').click(); }
        }
    });

    var aText = $('.aTextbox').val();
    if (!aText) { aText = false; }
    $('.aTextbox').keyup(function ()
    { aText = $(this).val(); });

    $('.aButtons > button').click(function () {
        $('.appriseOverlay').remove();
        $('.appriseOuter').remove();
        if (callback) {
            var wButton = $(this).attr("value");
            if (wButton == 'ok') {
                if (args) {
                    if (args['input'])
                    { callback(aText); }
                    else
                    { callback(true); }
                }
                else { callback(true); }
            }
            else if (wButton == 'cancel')
            { callback(false); }
        }
    });
}
//tipoIcono: "Info","Warning","Question", "Check","Error"
function alert_top(msg, tipoIcono) {
    if ($(".alert_top").length > 0) {
        $(".alert_top").remove();
    }
    icono = alert_icono(tipoIcono);
    _html = '<div class="alert_top alert_' + tipoIcono.toLowerCase() + '"><span class="' + icono + '"></span><span style="vertical-align:middle">' + msg + '<span></div>';
    $('body').append(_html);
    $(".alert_top").animate({ top: '1px' }, "slow").delay(2500).animate({ top: '-70px' }, "slow");
}
function alert_icono(tipo) {
    tipo = tipo.toLowerCase();
    icono = 'icon-info';
    switch (tipo) {
        case "info":
            icono = "icon-info";
            break;
        case "warning":
            icono = "icon-warning";
            break;
        case "question":
            icono = "icon-question";
            break;
        case "check":
            icono = "icon-checkmark";
            break;
        case "error":
            icono = "icon-cancel-circle";
            break;
    }
    return icono;
}