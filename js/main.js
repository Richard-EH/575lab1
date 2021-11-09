// // //Created by R. Helsley

$(document).ready(function(){
    var cities;
    var map = L.map('map',{
        //center: [38.0,-78.65],
        zoom: 2,
        minZoom: 7,
        zoomControl: false,
        map.dragging.disable()
    }).setView([38.0,-78.65],7);
    L.control.pan().addTo(map);

    L.control.navbar().addTo(map);
    L.Control.geocoder().addTo(map);
    


    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
     }).addTo(map);


     $.getJSON("data/Va_City_Pop.geojson")
    .done(function(data){
        var info = processData(data);
        createPropSymbols(info.timestamps, data);
        createLegend(info.min,info.max);
        createSliderUI(info.timestamps);
        createSequenceControls(map);
        
        
    })
    .fail(function(){alert("There has been a problem loading the data.")});

    var searchLayer = L.layerGroup().addTo(map);
    map.addControl( new L.Control.Search({layer: searchLayer}));

    function processData(data) {
        var timestamps =[];
        var min = Infinity;
        var max = -Infinity;

        for(var feature in data.features){
            var properties = data.features[feature].properties;
            for(var attribute in properties){
                if (attribute != 'Name' &&
                    attribute != 'lat' &&
                    attribute != 'lon')  {
                        if ($.inArray(attribute,timestamps) === -1){
                            timestamps.push(attribute);
                        }
                        if (properties[attribute] < min) {
                            min = properties[attribute];
                        }
                        if (properties[attribute] > max) {
                            max = properties[attribute];
                        }
                    }
            }
        }
        return{
            timestamps : timestamps,
            min:min,
            max:max
        }
    };
    //Prop Symbol Function
    function createPropSymbols(timestamps, data){
        cities = L.geoJson(data,{
            pointToLayer: function(feature, latlng){
                return L.circleMarker(latlng, {
                    fillColor: "gray",
                    color: 'blue',
                    weight: 1,
                    fillOpacity: 0.4
                }).on({
                    mouseover: function(e){
                        this.openPopup();
                        this.setStyle({color: 'green'});
                    },
                    mouseout: function(e) {
                        this.closePopup();
                        this.setStyle({color: 'blue'});
                    },

                });
            
            }
        }).addTo(map);
        updatePropSymbols(timestamps[0]);

    };

    function updatePropSymbols(timestamp) {
        cities.eachLayer(function(layer){
            var props = layer.feature.properties;
            var radius = calcPropRadius(props[timestamp]);
            var popupContent = "<b>" + String(props[timestamp]) + 
                " people</b><br>" + "<i>" + props.Name +
                "</i> in </i>" + timestamp + "</i>";
            layer.setRadius(radius);
            layer.bindPopup(popupContent, {offset: new L.Point(0,-radius)});
            return layer;
        });
    };
    function calcPropRadius(attributeValue) {
        var scaleFactor = 0.02;
        var area = attributeValue * scaleFactor;
        return Math.sqrt(area/Math.PI)*1;
    };

    //Create Legend
    function createLegend(min, max){
        if (min < 10) {
            min = 10;
        }
        function roundNumber(inNumber) {
            return (Math.round(inNumber/10)*10);
        }
        var legend = L.control({position: 'topright'});

        legend.onAdd = function(map) {
        var legendContainer = L.DomUtil.create("div", "legend");
        var symbolsContainer = L.DomUtil.create("div", "symbolsContainer");
        var classes = [roundNumber(min), roundNumber((max-min)/2), roundNumber(max)];
        var legendCircle;
        var lastRadius = 0;
        var currentRadius;
        var margin;
        
        L.DomEvent.addListener(legendContainer, 'mousedown', function(e){
            L.DomEvent.stopPropagation(e);
        });

        $(legendContainer).append("<h2 id='legendTitle'>Population</h2>");
        
        for (var i = 0; i <= classes.length-1; i++) {
            legendCircle = L.DomUtil.create("div", "legendCircle");
            currentRadius = calcPropRadius(classes[i]);
            margin = -currentRadius - lastRadius - 2;
            $(legendCircle).attr("style", "width: " + currentRadius*1 +
                "px; height: " + currentRadius*2 +
                "px: margin-left: " + margin + "px");
            $(legendCircle).append("<span class='legendValue'>" + classes[i] + "</span>");

            $(symbolsContainer).append(legendCircle);
            
            lastRadius = currentRadius;
        }
        $(legendContainer).append(symbolsContainer);
            return legendContainer;
        };
        legend.addTo(map);
    
    };//End createLegend

    function createSliderUI(timestamps) {
        var sliderControl = L.control({ position: 'bottomright'});
        sliderControl.onAdd = function(map) {
            var slider = L.DomUtil.create("input", "range-slider");
        L.DomEvent.addListener(slider, 'mousedown', function(e){
            L.DomEvent.stopPropagation(e);
        });
        $(slider)
            .attr({'type':'range',
                    'max': timestamps[timestamps.length-1],
                    'min': timestamps[0],
                    'step': 1,
                    'value': String(timestamps[0])})
            .on('input change', function(){
            updatePropSymbols($(this).val().toString());
                $(".temporal-legend").text(this.value);
            });
            return slider;
        }
        sliderControl.addTo(map)
        createTemporalLegend(timestamps[0]);
    };

    //temporal legend
    function createTemporalLegend(startTimestamp){
        var temporalLegend = L.control ({position: 'bottomright'});
    temporalLegend.onAdd = function(map) {
        var output = L.DomUtil.create("output", "temporal-legend");
        $(output).text(startTimestamp)
        return output;
    }
    temporalLegend.addTo(map);
    };

    //Citations: Copyright (c) 2012, Kartena AB
    //Citations: Copyright (c) 2012 sa3m (https://github.com/sa3m)
    //Copyright (c) 2013 Per Liedman
    //Copyright (c) 2014 David C.

});    
