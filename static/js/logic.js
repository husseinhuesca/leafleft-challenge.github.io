// Store our API and perform a GET request
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
d3.json(url, function(data) {mappingEarthquakes(data.features);});
//Function mapping Earthquakes
function mappingEarthquakes(infoEarthquakes) {
  var spotEarthquakes = [];
  for (var cont = 0; cont < infoEarthquakes.length; cont++) {
    var magnitude = infoEarthquakes[cont].properties.mag
    var latitude = infoEarthquakes[cont].geometry.coordinates[1]
    var longitude = infoEarthquakes[cont].geometry.coordinates[0]
    var latitudelongitude = [latitude,longitude]
    var depth = infoEarthquakes[cont].geometry.coordinates[2]
    var color = "";
    if (depth < 10){color = "#00e600"}
    else if (depth < 30) {color = "#bfff00"}
    else if (depth < 50) {color = "#ffff00"}
    else if (depth < 70) {color = "#ffbf00"}
    else if (depth < 90) {color = "#FF4500"}
    else {color = "#FF0000"}
    spotEarthquakes.push(L.circle(latitudelongitude, {stroke: false,fillOpacity: 0.7,fillColor: color,radius: magnitude*20000}))}
  var earthquakes = L.layerGroup(spotEarthquakes)
  createMap(earthquakes);}
// Function to create layers mapping
function createMap(earthquakes) {
  // Three differents maps (Grayscale, Satellite and Outdoors)
  var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,id: "light-v10",accessToken: API_KEY});
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,maxZoom: 18,zoomOffset: -1,id: "mapbox/satellite-v9",accessToken: API_KEY});
  var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,id: "outdoors-v11",accessToken: API_KEY});
  // Define setup maps
  var baseMaps = {"Grayscale": grayscale,"Satellite": satellite,"Outdoors" : outdoors};
  var overlayMaps = {"Earthquakes": earthquakes};
  var myMap = L.map("map", {center: [25.60, -98.23],zoom: 5,layers: [grayscale, earthquakes]});
  //Layer control
  L.control.layers(baseMaps, overlayMaps, {collapsed: false,position: 'bottomright'}).addTo(myMap);
  //Legends
  function legendColor(depth){
    if (depth < 10){return "#00e600"}
    else if (depth < 30) {return "#bfff00"}
    else if (depth < 50) {return "#ffff00"}
    else if (depth < 70) {return "#ffbf00"}
    else if (depth < 90) {return "#FF4500"}
    else {return "#FF0000"}}
  var legend = L.control({position: "bottomleft",fillColor: "#F8F8FF"});
  // Insert data in legend control
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    var depth = [9, 29, 49, 69, 89, 500];
    var labels = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
    div.innerHTML = '<div>Depths (km)</div>';
    for (var i = 0; i < depth.length; i++){div.innerHTML += '<i style="background:' + legendColor(depth[i]) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;'+ labels[i] + '<br>';}
    return div;};
  // Add the legend to the map
  legend.addTo(myMap);}