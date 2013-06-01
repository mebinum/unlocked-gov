//This is the main code file
$(document).ready(function(){
   // cache the window object

   //setup the facet view
   $('.facet-view-simple').facetview({
    search_url: 'http://bibsoup.net/query?',
    search_index: 'elasticsearch',
    facets: [
        {'field':'year.exact', 'display': 'year'}, 
        {'field':'publisher.exact', 'display': 'publisher'}
    ],
    paging: {
      from: 0,
      size: 10
    }
  });

   // set up form
  $('.demo-form').submit(function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var _data = {};
    $.each($form.serializeArray(), function(idx, item) {
      _data[item.name] = item.value;
    });
    $('.facet-view-here').facetview(_data);
  });
   
}); // close out script
/* Create HTML5 element for IE */
document.createElement("section");