  //var serverUrl = 'http://bibsoup.net/query?';
  //var searchIndex = 'elasticsearch';

  var serverUrl = 'http://cs597rmx:iro25kphl0eyg2iw@fig-1962948.us-east-1.bonsai.io/nswcrime/_search?';
  var searchIndex = 'nswcrime';

jQuery(document).ready(function($) {
  $('.facet-view-simple').facetview({
    search_url: serverUrl,
    search_index: searchIndex,
    saveResultsJsonButton: '#download-dataset-button-json',
    saveResultsCsvButton: '#download-dataset-button-csv',
    facets: [
        {'field':'event_date', 'display': 'Date'},
        {'field':'event_year', 'display': 'Year'},
        {'field':'state', 'display': 'State'},
        {'field':'area', 'display': 'Area'}, 
        {'field':'lga_name', 'display': 'LGA'},
        {'field':'offense_category', 'display': 'Offense Category'}, 
        {'field':'subcategory', 'display': 'Sub Category'}
    ],
    extra_facets: 
      {
        "stats_count": {
          "statistical" : {
            "field" : "t_count"
          }
        }, 
        "histo1" : {
            "date_histogram" : {
                "field" : "event_date",
                "value_field" : "t_count",
                "interval" : "month"
            }
        }, 
        "location_total" : {
            "terms_stats" : {
                "key_field" : "lga_location",
                "value_field" : "t_count"
            }
        }
      }
    ,
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
                        "field": "subcategory",
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
    },
    on_results_returned: function(sdata) {
      Donut('graph-area').data(sdata.facets.area.terms).draw();
      // Transform from enties {} to terms {term: , count: }
      var histogram_data = [];
      for (var i = 0; i < sdata.facets.histo1.entries.length; i++) {
        var entry = sdata.facets.histo1.entries[i];
        histogram_data.push({term: entry.time, count: entry.total});
      }
      Timeline('graph-timeline').data(histogram_data).draw();

      var location_totals = [];
      for (var i = 0; i < sdata.facets.location_total.terms.length; i++) {
        var entry = sdata.facets.location_total.terms[i];
        location_totals.push({location: geohash.decode(entry.term), count: entry.total});
      }
      Mapper('map').data(location_totals).drawMap();
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


var map = undefined;
var markersArray = [];
var mc = undefined;
google.maps.Map.prototype.clearOverlays = function() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
}

var Mapper = function (dom_id) {
    if ('undefined' == typeof dom_id) {                 // Set the default DOM element ID to bind
        dom_id = 'map';
    }

    var data = function(json) {                         // Set the data for the chart
        this.data = json;
        return this;
    };

    var isLongLat = function function_name (string) {
         return string.match(/-?\d+\.\d+/g);
    };

    var drawMap = function () {
        var theData = this.data;
        if(theData.length === 0) return;
        var locations = [];
        theData.map(function (source) {
            //var theSource = source["_source"];
            Object.keys(source).map(function(key) {
                if(!source.hasOwnProperty(key)) return;
                var val = source[key];
                if(key.match(/location/)){
                    //var point = isLongLat(val);
                    locations.push([val.latitude, val.longitude, source.count]);
                    //locations.push([parseFloat(point[0]),parseFloat(point[1])]);
                }
            });
        });

        if(locations.length === 0) return;
        // create a map in the "map" div, set the view to a given place and zoom
        var aloc = locations[0];
        var mapOptions = {
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var bounds = new google.maps.LatLngBounds();
        if (map == undefined) {
          var mapEl = document.getElementById(dom_id);
          map = new google.maps.Map(mapEl, mapOptions);
          mapEl.setAttribute("style","min-height:330px;max-height:330px")
        } else {
          map.clearOverlays();
          markersArray = [];
        }

        locations.map(function (point) {
            // add a marker in the given location, attach some popup content to it and open the popup
            var latlong = new google.maps.LatLng(point[0],point[1]);
            bounds.extend(latlong);

            var numberMarker = new google.maps.Marker(
                {
                    position:latlong,
                    map:map,
                    //icon:'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+point[2]+'|FF776B|000000',
                    //icon:'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.4|0|FFFF42|12|b|' + point[2],
                    icon:'https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bb|'+point[2]+'|FFBB00|000000',
                    shadow:'https://chart.googleapis.com/chart?chst=d_map_pin_shadow'
                }
            );
            markersArray.push(numberMarker);
        });
        map.fitBounds(bounds);
        //var mcOptions = {gridSize: 30, maxZoom: 19};
        if (mc != undefined) {
          //mc.clearMarkers();
        }
        //mc = new MarkerClusterer(map, markersArray, mcOptions);
    };

    return {
        data: data,
        drawMap: drawMap
    };
};

/* Protovis stuff */
var Timeline = function(dom_id) {
    if ('undefined' == typeof dom_id) {                 // Set the default DOM element ID to bind
        dom_id = 'chart';
    }

    var data = function(json) {                         // Set the data for the chart
        this.data = json;
        return this;
    };

    var draw = function() {

        var entries = this.data;                        // Set-up the data
            entries.push({                              // Add the last "blank" entry for proper
              count : entries[entries.length-1].count   // timeline ending
            });
        // console.log('Drawing, ', entries);

        var w = 600,                                    // Set-up dimensions and scales for the chart
            h = 200,
            max = pv.max(entries, function(d) {return d.count;}),
            x = pv.Scale.linear(0, entries.length-1).range(0, w),
            y = pv.Scale.linear(0, max).range(0, h);

        var vis = new pv.Panel()                        // Create the basis panel
            .width(w)
            .height(h)
            .bottom(20)
            .left(40)
            .right(40)
            .top(40);

         vis.add(pv.Label)                              // Add the chart legend at top left
            .top(-20)
            .text(function() {
                 var first = new Date(entries[0].term);
                 var last  = new Date(entries[entries.length-2].term);
                 return "Crimes committed between " +
                     [ first.getDate(),
                       first.getMonth() + 1,
                       first.getFullYear()
                     ].join("/") +

                     " and " +

                     [ last.getDate(),
                       last.getMonth() + 1,
                       last.getFullYear()
                     ].join("/");
             })
            .textStyle("#B1B1B1");

         var labelEvery = Math.floor(entries.length / 10);
         vis.add(pv.Rule)                               // Add the X-ticks
            .data(entries)
            .visible(function(d) {return d.term;})
            .left(function() { return x(this.index); })
            .bottom(-15)
            .height(15)
            .strokeStyle("#33A3E1")
            .width(0)

            .anchor("right").add(pv.Label)              // Add the tick label (DD/MM)
            .text(function(d) {
              if (entries.indexOf(d) % labelEvery != 0) {
                return "";
              }

                 var date = new Date(d.term); 
                 return [
                     date.getDate(),
                     date.getMonth() + 1,
                     date.getFullYear()
                 ].join('/');
             })
            .textStyle("#2C90C8")
            .textMargin("5")

         vis.add(pv.Rule)                               // Add the Y-ticks
            .data(y.ticks(5))                         // Compute tick levels based on the "max" value
            .bottom(y)
            .strokeStyle("#eee")
            .anchor("left").add(pv.Label)
                .text(y.tickFormat)
                .textStyle("#c0c0c0")

        vis.add(pv.Panel)                               // Add container panel for the chart
           .add(pv.Area)                                // Add the area segments for each entry
           .def("active", -1)                           // Auxiliary variable to hold mouse state
           .data(entries)                               // Pass the data to Protovis
           .bottom(0)
           .left(function(d) {return x(this.index);})   // Compute x-axis based on scale
           .height(function(d) {return y(d.count);})    // Compute y-axis based on scale
           .interpolate('cardinal')                     // Make the chart curve smooth
           .segmented(true)                             // Divide into "segments" (for interactivity)
           .fillStyle("#79D0F3")

           .event("mouseover", function() {             // On "mouse over", set segment as active
               this.active(this.index);
               return this.root.render();
           })

           .event("mouseout",  function() {             // On "mouse out", clear the active state
               this.active(-1);
               return this.root.render();
           })

           .event("mousedown", function(d) {            // On "mouse down", perform action,
               var date = new Date(d.term); 
               var time = [
                     date.getDate(),
                     date.getMonth() + 1,
                     date.getFullYear()
                 ].join('/')  // eg filtering the results...
               return (alert("Timestamp: '"+time+"'"));
           })

           .anchor("top").add(pv.Line)                  // Add thick stroke to the chart
           .lineWidth(3)
           .strokeStyle('#33A3E1')

           .anchor("top").add(pv.Dot)                   // Add the circle "label" displaying
                                                        // the count for this day

           .visible( function() {                       // The label is only visible when
               return this.parent.children[0]           // its segment is active
                          .active() == this.index;
            })
           .left(function(d) { return x(this.index); })
           .bottom(function(d) { return y(d.count); })
           .fillStyle("#33A3E1")
           .lineWidth(0)
           .radius(14)

           .anchor("center").add(pv.Label)             // Add text to the label
           .text(function(d) {return d.count;})
           .textStyle("#E7EFF4")

           .root.canvas(dom_id)                        // Bind the chart to DOM element
           .render();                                  // And render it.
    };

    return {                                            // Create the public API
        data   : data,
        draw   : draw
    };

};

var Donut = function(dom_id) {

    if ('undefined' == typeof dom_id)  {                // Set the default DOM element ID to bind
        dom_id = 'chart';
    }

    var data = function(json) {                         // Set the data for the chart
        this.data = json;
        return this;
    };

    var draw = function() {

        var entries = this.data.sort( function(a, b) {  // Sort the data by term names, so the
            return a.term < b.term ? -1 : 1;            // color scheme for wedges is preserved
        }),                                             // with any order

        values  = pv.map(entries, function(e) {         // Create an array holding just the counts
            return e.count;
        });
        // console.log('Drawing', entries, values);

        var w = 200,                                    // Dimensions and color scheme for the chart
            h = 200,
            colors = pv.Colors.category10().range();

        var vis = new pv.Panel()                        // Create the basis panel
            .width(w)
            .height(h)
            .margin(0, 0, 0, 0);

        vis.add(pv.Wedge)                               // Create the "wedges" of the chart
            .def("active", -1)                          // Auxiliary variable to hold mouse over state
            .data( pv.normalize(values) )               // Pass the normalized data to Protovis
            .left(w/3)                                  // Set-up chart position and dimension
            .top(w/3)
            .outerRadius(w/3)
            .innerRadius(15)                            // Create a "donut hole" in the center
            .angle( function(d) {                       // Compute the "width" of the wedge
                return d * 2 * Math.PI;
             })
            .strokeStyle("#fff")                        // Add white stroke

            .event("mouseover", function() {            // On "mouse over", set the "wedge" as active
                this.active(this.index);
                this.cursor('pointer');
                return this.root.render();
             })

            .event("mouseout",  function() {            // On "mouse out", clear the active state
                this.active(-1);
                return this.root.render();
            })

            .event("mousedown", function(d) {           // On "mouse down", perform action,
                var term = entries[this.index].term;    // such as filtering the results...
                return (alert("Filter the results by '"+term+"'"));
            })


            .anchor("right").add(pv.Dot)                // Add the left part of he "inline" label,
                                                        // displayed inside the donut "hole"

            .visible( function() {                      // The label is visible when its wedge is active
                return this.parent.children[0]
                       .active() == this.index;
            })
            .fillStyle("#222")
            .lineWidth(0)
            .radius(14)

            .anchor("center").add(pv.Bar)               // Add the middle part of the label
            .fillStyle("#222")
            .width(function(d) {                        // Compute width:
                return (d*100).toFixed(1)               // add pixels for percents
                              .toString().length*4 +
                       10 +                             // add pixels for glyphs (%, etc)
                       entries[this.index]              // add pixels for letters (very rough)
                           .term.length*9;
            })
            .height(28)
            .top((w/3)-14)

            .anchor("right").add(pv.Dot)                // Add the right part of the label
            .fillStyle("#222")
            .lineWidth(0)
            .radius(14)


            .parent.children[2].anchor("left")          // Add the text to label
                   .add(pv.Label)
            .left((w/3)-7)
            .text(function(d) {                         // Combine the text for label
                return (d*100).toFixed(1) + "%" +
                       ' ' + entries[this.index].term +
                       ' (' + values[this.index] + ')';
            })
            .textStyle("#fff")

            .root.canvas(dom_id)                        // Bind the chart to DOM element
            .render();                                  // And render it.
    };

    return {                                            // Create the public API
        data   : data,
        draw   : draw
    };

};
/* Create HTML5 element for IE */
document.createElement("section");