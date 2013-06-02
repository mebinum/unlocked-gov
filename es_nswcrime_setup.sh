#!/bin/bash
set -e -x

# cs597rmx:iro25kphl0eyg2iw@fig-1962948.us-east-1.bonsai.io
ES_HOST=localhost
ES_PORT=9200
ES_SERVER=$ES_HOST:$ES_PORT
#ES_SERVER=cs597rmx:iro25kphl0eyg2iw@fig-1962948.us-east-1.bonsai.io


# Deleting index
curl -XDELETE "http://$ES_SERVER/nswcrime/"

# Creating index
curl -XPUT "http://$ES_SERVER/nswcrime/"

# Setting up mapping types
curl -XPUT "http://$ES_SERVER/nswcrime/nswcrime/_mapping" -d '{
   "nswcrime": {
        "properties": {
            "_source" : { "enabled" : true },
            "state": {"type": "string", "store": "yes"},
            "area": {"type": "string", "store": "yes", "index" : "not_analyzed"},
            "area_s": {"type": "string"},
            "lga_name": {"type": "string", "store": "yes", "index" : "not_analyzed"},
            "lga_name_s": {"type": "string"},
            "lga_location": {"type": "geo_point", "store": "yes", "lat_lon": "true"},
            "offense_category": {"type": "string", "store": "yes", "index" : "not_analyzed"},
            "offense_category_s": {"type": "string"},
            "subcategory": {"type": "string", "store": "yes", "index" : "not_analyzed"},
            "subcategory_s": {"type": "string"},
            "event_date": {"type": "date", "store": "yes"},
            "event_year": {"type": "integer", "store": "yes"},
            "t_count": {"type": "integer", "store": "yes"}
        }
    }
}'

curl -XPUT "http://$ES_SERVER/nswcrime/nswcrime/1" -d '{
    "state": "NSW",
    "area": "Inner Sydney",
    "area_s": "Inner Sydney",
    "lga_name": "Botany Bay",
    "lga_name_s": "Botany Bay",
    "lga_location": "-34.01285,151.1257822",
    "offense_category": "Homocide",
    "offense_category_s": "Homocide",
    "subcategory": "Murder (a)",
    "subcategory_s": "Murder (a)",
    "event_date": "1995-01-01T00:00:00",
    "event_year": 1995,
    "t_count": 5
}'

curl -XPUT "http://$ES_SERVER/nswcrime/nswcrime/2" -d '{
    "state": "NSW",
    "area": "Inner Sydney",
    "area_s": "Inner Sydney",
    "lga_name": "Botany Bay",
    "lga_name_s": "Botany Bay",
    "lga_location": "-34.01285,151.1257822",
    "offense_category": "Homocide",
    "offense_category_s": "Homocide",
    "subcategory": "Murder (a)",
    "subcategory_s": "Murder (a)",
    "event_date": "1995-02-01T00:00:00",
    "event_year": 1995,
    "t_count": 6
}'

curl -XPUT "http://$ES_SERVER/nswcrime/nswcrime/3" -d '{
    "state": "NSW",
    "area": "Inner Sydney",
    "area_s": "Inner Sydney",
    "lga_name": "Botany Bay",
    "lga_name_s": "Botany Bay",
    "lga_location": "-34.01285,151.1257822",
    "offense_category": "Homocide",
    "offense_category_s": "Homocide",
    "subcategory": "Murder (a)",
    "subcategory_s": "Murder (a)",
    "event_date": "1995-03-01T00:00:00",
    "event_year": 1995,
    "t_count": 8
}'

curl -XPUT "http://$ES_SERVER/nswcrime/nswcrime/4" -d '{
    "state": "NSW",
    "area": "Outer Sydney",
    "area_s": "Outer Sydney",
    "lga_name": "Croydon",
    "lga_name_s": "Croydon",
    "lga_location": "-34.01285,151.1257822",
    "offense_category": "Homocide",
    "offense_category_s": "Homocide",
    "subcategory": "Murder (a)",
    "subcategory_s": "Murder (a)",
    "event_date": "1995-02-01T00:00:00",
    "event_year": 1996,
    "t_count": 6
}'

curl -XGET "http://$ES_SERVER/nswcrime/nswcrime/1"
