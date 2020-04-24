var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);

d3.json(queryUrl, function (data) {
    // createFeatures(data.features);
    console.log(data.features);
    var geojson;

    function markerSize(magnitude) {
        return parseInt(magnitude) * 5;
    };

    // Create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        // radius: markerSize(mag),
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
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo =
            // "<h1>Median Income</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function (limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Adding legend to the map
    legend.addTo(myMap);
    // createMap(geojson);
});



function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    // function onEachFeature(feature, layer) {
    //     // console.log(feature.geometry.coordinates);
    //     layer.bindPopup("<h3>" + feature.properties.place +
    //         "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    // }



    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    // function markerSize() {
    //     console.log(feature.properties.mag);
    //     var mag = feature.properties.mag;
    //     return parseInt(mag) * 5;
    // };

    // function getColor(d) {
    //     parseInt(d);
    //     return d > 6 ? '#800026' :
    //            d > 5 ? '#BD0026' :
    //            d > 4 ? '#E31A1C' :
    //            d > 3 ? '#FC4E2A' :
    //            d > 2 ? '#FD8D3C' :
    //            d > 1 ? '#FEB24C' :
    //            d > 0.5 ? '#FED976' :
    //                      '#FFEDA0';
    // };

    // var geojsonMarkerOptions = {
    //     radius: 8,
    //     // radius: markerSize,
    //     fillColor: "#ff7800",
    //     // fillColor: getColor(feature.properties.mag),
    //     color: "#000",
    //     weight: 1,
    //     opacity: 1,
    //     fillOpacity: 0.8
    // };

    // var earthquakes = L.geoJSON(earthquakeData, {
    //     onEachFeature: onEachFeature
    //     // pointToLayer: function (feature, latlng) {
    //     //     return L.circleMarker(latlng, geojsonMarkerOptions);
    //     // }
    // });

    // Sending our earthquakes layer to the createMap function
    // createMap(earthquakes);
}

function createMap(earthquakes) {

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

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}