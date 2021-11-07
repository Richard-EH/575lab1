$document().ready(function(){
    //Step 1: Create new sequence controls
    function createSequenceControls(map){
        //create range input element (slider)
        $('#panel').append('<input class="range-slider" type="range">');
         //set slider attributes
         $('.range-slider').attr({
            max: 9,
            min: 0,
            value: 0,
            step: 1
        });
        $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
        $('#panel').append('<button class="skip" id="forward">Skip</button>');
        //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    $('.skip').click(function(){
        //sequence
    });

    //Step 5: input listener for slider
    $('.range-slider').on('input', function(){
        //sequence
    });
    }
    
    
        //Import GeoJSON data
        function getData(map){
        //load the data
        $.ajax("data/Va_City_Pop.geojson", {
            dataType: "json",
            success: function(response){
                var attributes = processData(response);
    
                createPropSymbols(response, map);
                createSequenceControls(map);
                processData(data);
    
            }
        });
        };
    function processData(data){
        //empty array to hold attributes
        var attributes = [];

        //properties of the first feature in the dataset
        var properties = data.features[0].properties;

        //push each attribute name into attributes array
        for (var attribute in properties){
            //only take attributes with population values
            if (attribute.indexOf("Pop") > -1){
                attributes.push(attribute);
            };
        };

        //check result
        console.log(attributes);

        return attributes;
    };
    //Example 2.1 line 34...Add circle markers for point features to the map
    function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
    };
    //Example 2.1 line 1...function to convert markers to circle markers
    function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    console.log(attribute);
    } 

    // function createPropSymbols(data, map, attributes){
    //     //create a Leaflet GeoJSON layer and add it to the map
    //     L.geoJson(data, {
    //         pointToLayer: function(feature, latlng){
    //             return pointToLayer(feature, latlng, attributes);
    //         }
    //     }).addTo(map);
    // };
    });