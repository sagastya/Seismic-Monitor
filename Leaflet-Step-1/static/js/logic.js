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
    // createFeatures(data.features);
    console.log(data);
    var geojson;

    function markerSize(magnitude) {
        return parseInt(magnitude) * 5;
    };

    // Create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };

    // Create a new choropleth layer
    geojson = L.choropleth(data, {

        // Define what property in the features to use
        valueProperty: "mag",

        // Set color scale
        scale: ["#adff2f", "#ff8c00"],

        // Number of breaks in step range
        steps: 6,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#a9a9a9",
            weight: 1,
            fillOpacity: 0.5
        },

        // Binding a pop-up to each layer
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + "Magnitude: " + feature.properties.mag +
                "</p><p>" + new Date(feature.properties.time) + "</p>");
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var colors = geojson.options.colors;
        var labels = [];
        var categories = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+']

        // Add min & max
        var legendInfo = "<h1>Scale</h1>" +
            "<div class=\"labels\">" +
            "</div>";

        div.innerHTML = legendInfo;

        for (var i = 0; i < categories.length; i++) {
            labels.push("<li style=\"background-color: " + colors[i] + "\"><span>" + categories[i] + "</span></li>");
        }
        console.log(labels);

        div.innerHTML += "<ul id=\"legend\">" + labels.join("") + "</ul>";
        return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);
    // createMap(geojson, legend);
});

function createMap(earthquakes, legend) {

    // Define lightmap and satellitemap layers
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Grayscale": lightmap,
        "Satellite": satellitemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Creating initial map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });
    legend.addTo(myMap);
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}