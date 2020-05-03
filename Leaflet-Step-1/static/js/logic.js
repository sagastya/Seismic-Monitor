var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Creating initial map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl, function (data) {
    // console.log(data.features);

    // Create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        color: "000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };

    function getColor(d) {
        return d > 5 ? '#FF8C00' :
               d > 4 ? '#CFA309' :
               d > 3 ? '#DEBA13' :
               d > 2 ? '#CED11C' :
               d > 1 ? '#BDE826' :
                       '#ADFF2F';

    };

    function getRadius(d) {
        return d > 5 ? 20 :
               d > 4 ? 18 :
               d > 3 ? 15:
               d > 2 ? 12 :
               d > 1 ? 8 :
                       5;
    };

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
            weight: 2,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7,
            radius: getRadius(feature.properties.mag)
        };
    };

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + "Magnitude: " + feature.properties.mag +
        "</p><p>" + new Date(feature.properties.time) + "</p>");
    };


    L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        style: style,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(myMap);


    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var colors = ['#ADFF2F', '#BDE826', '#CED11C', '#DEBA13', '#CFA309', '#FF8C00']
        var categories = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']

        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> '
                + categories[i] + '<br />';
        }
        return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
});
