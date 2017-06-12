var Laboratorio1 = function($){
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

    return {
        atualizaFotoCapa : _atualizaFotoCapa
    }
}(jQuery);

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