// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.client.setApiKey('AIzaSyCAKghrx-iQarm9RfDWOH8ssToUzuiSyTo');
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
  });
}

// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  $('#search-header').text(q);
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet, id',
    maxResults: 20,
    order: 'viewCount'
  });

  // name video, author and date
  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    console.log(str);

    $('#search-cointainer-list').empty();
    var searchItems = response.result.items;
    var counter = 0;
    $.each(searchItems, function(index, item) {
      counter++;
      var title = item.snippet.title;
      var author = item.snippet.channelTitle;
      var date = item.snippet.publishedAt;
      var id = item.id.videoId;
      $('#search-cointainer-list').append('<li class="search-item">'
                                          + '<a class="search-item-title" href="#accordion-' + counter + '">'
                                          + title + '</a><br />'
                                          + author + '<br />'
                                          + date + '<br />'
                                          + '<div id="accordion-' + counter + '" class="search-item-content">' + playVideo(id) + '</div></li>'
                                          );
    })
  });
}
