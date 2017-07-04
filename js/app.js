var Laboratorio = function($){
    var _atualizaFotoCapa = function(){
       var foto = $('#foto-capa');
       if (foto){
          var url = foto.val();
          if (url && url.length > 0){
              $('#img-capa').prop('data-src',null);
              $('#img-capa').prop('src',url);
          }
       }
    };

    var _adicionarAlbum = function(album){
        var imagens = $('input.checkbox-imagem:checked');

        

        var qtdReg = $('div.row.featurette').length;

        var divRow = $('<div>');
        
        var div1 = $('<div>');
        var titulo = $('<h2>');
        var descricao = $('<p>');

        var valorTitulo = $('#titulo').val();
        $(titulo).addClass('featurette-heading')
        .append(valorTitulo);

        var valorDescricao = $('#descricao').val();
        $(descricao).append(valorDescricao)
        .addClass('lead');

        var classe1 = 'col-md-7'
        if ( qtdReg > 0 && (qtdReg % 2) != 0){
            classe1 += ' col-md-push-5';
        }

        $(div1).addClass(classe1)
        .append(titulo)
        .append(descricao);
        

        var div2 = $('<div>');
        var anchor = $('<a>');
        var img = $('<img>');

        $(img).attr('src',$('#foto-capa').val());

        $(img).addClass('featurette-image img-responsive center-block');
        $(anchor).append(img);


        var classe2 = 'col-md-5'
        if ( qtdReg > 0 && (qtdReg % 2) != 0){
            classe2 += ' col-md-pull-7';
        }
        $(div2).addClass(classe2).append(anchor);

        $(divRow).addClass('row featurette')
        .append(div1)
        .append(div2);

        var hr = $('<hr>').addClass('featurette-ending');

        $('div#albuns').append(divRow)
        .append(hr);


        var divDir = $('<div>');

    }

    var _init = function(){
        $('#foto-capa').val('http://lorempixel.com/500/500/people/7');

        var elementFilter = {};
        elementFilter.test = function(value){
        var str = value;
        var n = str.search(/lorempixel/);
        return n >= 0;
        }

        baguetteBox.run('.galeria',{
            animation: 'slideIn',
            buttons: true,
            filter: elementFilter
        });

        $('#btn-atualiza-foto-capa').click(function(){Laboratorio.atualizaFotoCapa()});
        $('#btn-pesquisar-foto').click(function(){ShutterstockApi.search();});
        $('#btn-salvar-album').click(
            function(event){
                Laboratorio.adicionarAlbum(event);
        });

    };
    

    return {
        atualizaFotoCapa : _atualizaFotoCapa,
        adicionarAlbum : _adicionarAlbum,
        init : _init
    }
}(jQuery);

// Cookies
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";               

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

$(document).ready(function(){
    Laboratorio.init();
});