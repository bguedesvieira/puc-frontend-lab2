var ShutterstockApi = function($){
    var clientId = '11f959a4264134dc2776';
    var clientSecret = '0f2c4b5327ae69999e6f8382072745bc753cd357';
    var API_URL = 'https://api.shutterstock.com/v2';

    var _encodeAuthorization = function() {

        if (!clientId || !clientSecret) {
          alert('Client id and/or client secret are missing in the API key section, with out these you wont be able to contact the API.');
          return;
        }
        return 'Basic ' + window.btoa(clientId + ':' + clientSecret);
    };

    // Display media details in a modal
    var renderDetails = function (data) {
        var detailTemplate = $('.detail-template');
        detailTemplate.find('.modal-body').html('<div></div><p><strong>Keywords: </strong><small></small></p>')

        if (data.media_type === 'image') {
          var thumbWrapper = $('<div>');
          var thumbnail = $('<img>');

          $(thumbnail)
            .click(_fetchDetails)
            .attr('id', data.id)
            .attr('src', data.assets.preview.url)
            .attr('title', data.description);

          $(thumbWrapper)
            .addClass('thumbnail-crop')
            .css('height', data.assets.preview.height)
            .css('width', data.assets.preview.width)
            .append(thumbnail);

          detailTemplate.find('.modal-body').find('div')
            .append(thumbWrapper)
        } else if (data.media_type === 'video') {
          detailTemplate.find('.modal-body').find('div')
            .append('<video></video>');

          detailTemplate.find('video')
            .attr('src', data.assets.preview_mp4.url)
            .attr('controls', true);
        }

        detailTemplate.find('h3').html(data.description);
        detailTemplate.find('small').html(data.keywords.join(', '));
      };


    // Render a loading spinner while we wait for image/video details
    var renderLoadingDetails = function (id) {
        var detailTemplate = $('.detail-template');

        detailTemplate.find('.modal-body').html('<i class="fa fa-5x fa-spinner fa-spin"></i>')
        detailTemplate.find('h3').html('Loading ' + id + '...');
        detailTemplate.modal('show');
      }

    var _renderImageComponentNew = function (image, minHeightCSS) {
        if (!image || !image.assets || !image.assets.large_thumb || !image.assets.large_thumb.url) return;


        var wrapper = $('<div>');
        var inputChk = $('<input>');
        var thumbWrapper = $('<a>');
        var thumbnail = $('<img>');

        $(thumbnail).attr('src',image.assets.large_thumb.url)
        .attr('id', image.id)
        .attr('title', image.description);

        $(thumbWrapper).attr('href',image.assets.preview.url)
        .append(thumbnail);

        $(inputChk).attr('type','checkbox')
        .attr('value',image.assets.preview.url)
        .attr('id','chk-'+image.id)
        .addClass('checkbox-imagem');

        $(wrapper).addClass('image-float-wrapper image vertical-image')
        .append(inputChk)
        .append(thumbWrapper);

        $('#album-pessoas').append(wrapper);

    };
        
    // Create image wrapper component
    var _renderImageComponent = function (image, minHeightCSS) {
        if (!image || !image.assets || !image.assets.large_thumb || !image.assets.large_thumb.url) return;

        var wrapper = $('<div>');
        var thumbWrapper = $('<div>');
        var thumbnail = $('<img>');
        var description = $('<p>');

        $(thumbnail)
          .click(_fetchDetails)
          .attr('id', image.id)
          .attr('src', image.assets.large_thumb.url)
          .attr('title', image.description);

        $(thumbWrapper)
          .addClass('thumbnail-crop')
          .css('height', image.assets.large_thumb.height)
          .css('width', image.assets.large_thumb.width)
          .append(thumbnail);

        $(wrapper)
          .addClass('image-float-wrapper image ' + minHeightCSS)
          .append(thumbWrapper);

        return wrapper;
    };

    var _search = function(){
        $('#album-pessoas').empty();
         var $container = $('#album-pessoas');
        var query = $('#pesquisar-foto').val();
        if (!query || query.trim().length == 0){
            return;
        }

        var opts = 'query=' +query +'&safe=true&image_type=photo&page=1&per_page=25'

        var mediaType = 'image';

        var authorization = _encodeAuthorization();
        if (!authorization) return;

        var jqxhr = $.ajax({
          url: API_URL + '/' + mediaType + 's/search',
          data: opts,
          headers: {
            Authorization: authorization
          }
        })
        .done(function(data) {
          if (data.total_count === 0) {
            $container.append('<p>Nenhum resultado encontrado!</p>');
            return;
          }

          var minHeightCSS = /horizontal/.test(opts) ? 'horizontal-image' : 'vertical-image';
          $.each(data.data, function(i, item) {
            var component = _renderImageComponentNew(item, minHeightCSS);
            $container.append(component);
          });

          var elementFilter = {};
            elementFilter.test = function(value){
            var str = value;
            var n = str.search(/shutterstock/);
            return n >= 0;
            }

            baguetteBox.run('.galeria',{
                animation: 'slideIn',
                buttons: true,
                filter: elementFilter
            });
          
          // Reduce the options area to show the results
          if (window.innerWidth < 600) $('.collapse.in').collapse();
        }).fail(function(xhr, status, err) {
          alert('Failed to retrieve ' + mediaType + ' search results:\n' + JSON.stringify(xhr.responseJSON, null, 2));
        });
    };

    // Fetch media details
    var _fetchDetails = function(event) {
        event.preventDefault();

        var id = event.target.id;
        var mediaType = event.target.tagName === 'IMG' ? 'image' : 'video';
        var authorization = _encodeAuthorization();

        if (!id || !authorization) return;

        renderLoadingDetails(id);

        var jqxhr = $.ajax({
            url: API_URL + '/' + mediaType + 's/' + id,
            headers: {
              Authorization: authorization
            }
          })
          .done(function(data) {
            console.log('JSON response', data);

            if (!data || !data.assets || !data.assets) return;

            renderDetails(data);
          })
          .fail(function(xhr, status, err) {
            alert('Failed to retrieve ' + mediaType + ' details:\n' + JSON.stringify(xhr.responseJSON, null, 2));
          });

        return jqxhr;
      };

    return {
        renderImageComponent : _renderImageComponent,
        search : _search
    };

}(jQuery);