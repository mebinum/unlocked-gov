  //var serverUrl = 'http://bibsoup.net/query?';
  //var searchIndex = 'elasticsearch';

  var serverUrl = 'http://localhost:9200/nswcrime/_search?';
  var searchIndex = 'nswcrime';

jQuery(document).ready(function($) {
  $('.facet-view-simple').facetview({
    search_url: serverUrl,
    search_index: searchIndex,
    saveResultsJsonButton: '#download-dataset-button-json',
    saveResultsCsvButton: '#download-dataset-button-csv',
    facets: [
        {'field':'event_year', 'display': 'Year'},
        {'field':'state', 'display': 'State'},
        {'field':'area', 'display': 'Area'}, 
        {'field':'lga_name', 'display': 'LGA'},
        {'field':'offense_category', 'display': 'Offense Category'}, 
        {'field':'sub_category', 'display': 'Sub Category'}
    ],
    searchwrap_start: '<table class="table table-striped table-bordered" id="facetview_results"><thead><tr><td></td><td>Date</td><td>State</td><td>Area</td><td>LGA</td><td>Offense Category</td><td>Sub Category</td><td>Count</td></tr></thead><tbody>',
    searchwrap_end: '</tbody></table>',
    result_display: [
                [
                    {
                        "pre": "<td>",
                        "field": "event_date",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "state",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "area",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "lga_name",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "offense_category",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "sub_category",
                        "post": "</td>"
                    },
                    {
                        "pre": "<td>",
                        "field": "t_count",
                        "post": "</td>"
                    }
                ]
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
});
  
/* Create HTML5 element for IE */
document.createElement("section");