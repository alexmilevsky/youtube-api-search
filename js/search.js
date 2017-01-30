// current searched videos;
var items;

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

// get views of video
function getViews(counter, videoId)
{
  $.getJSON('https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' + videoId + '&key=AIzaSyCAKghrx-iQarm9RfDWOH8ssToUzuiSyTo', function(data) {
      items[counter].views = data.items[ 0 ].statistics.viewCount;
  });
}

// sort by view
function compareViews(video1, video2) {
  return video2.views - video1.views;
}

// Search for a specified string.
function search() {
  var q = $('#query').val();
  $('#search-header').text("Результаты по запросу: " + q);
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet, id',
    maxResults: 20,
    order: 'date'
  });

  // name video, author and date
  request.execute(function(response) {
    var str = JSON.stringify(response.result);
    console.log(str);

    // clear container
    $('#search-cointainer-list').empty();
    var searchItems = response.result.items;

    // create array for structure of video
    items = [];
    // counter of video
    var counter = 0;
    $.each(searchItems, function(index, item) {
      var id = item.id.videoId;
      // added structure in array
      items[counter] = {title: item.snippet.title, author: item.snippet.channelTitle, date: item.snippet.publishedAt, id: id};
      // get views for video
      getViews(counter, id);
      counter++;
    })

    // little pause
    setTimeout(function() {
      // sorting by views and output video
      items.sort(compareViews);
      output();
    }, 1000);
  });
}

function output()
{
  // output in html
  for (var i = 0; i < items.length; i++) {
    $('#search-cointainer-list').append('<li class="search-item">'
                                        + '<a class="search-item-title" href="#accordion-' + (i + 1) + '">'
                                        + items[i].title + '</a><br />'
                                        + items[i].author + '<br />'
                                        + items[i].date + '<br />'
                                        + '<div id="accordion-' + (i + 1) + '" class="search-item-content">' + playVideo(items[i].id) + '</div></li>'
                                        );
  }
}
