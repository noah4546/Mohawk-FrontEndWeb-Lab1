/* start the map */
let map, directionsService, directionsRenderer, geocoder;
let currentInfoWindow, currentMarker;
let markers = [];
let infowindows = [];
let customMarkers = [];
let customInfoWindows = [];
let pos;
function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.31, lng: -79.87 },
        zoom: 10.15,
    });
    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
            
        navigator.geolocation.getCurrentPosition(
            (position) => {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                currentInfoWindow = new google.maps.InfoWindow({
                    content: `Current Loacation: ${pos.lat}, ${pos.lng}`
                });
                currentMarker = new google.maps.Marker({
                    position: pos,
                    map,
                    title: "Current Location",
                });
                currentMarker.addListener("click", () => {
                    closeOpenInfoWindows();
                    currentInfoWindow.open(map, currentMarker);
                });
            },
            () => {
                $(".error").html("Error: User has opt-out of Geolocation");
            }
        )

    } else {
        // Browser doesn't support Geolocation
        $(".error").html("Error: Browser doesn't support Geolocation");
    }

    for (let i = 0; i < education.length; i++) {

        infowindows[i] = new google.maps.InfoWindow({
            content: `
            <p><a href="${education[i].WEBSITE}">${education[i].NAME}</a></p>
            <p>${education[i].ADDRESS}</p>
            <p>${education[i].CATEGORY}</p>
            <p>${education[i].COMMUNITY}</p>
            <p><a href="#" onclick="return directions('${education[i].LATITUDE},${education[i].LONGITUDE}');">directions</a></p>
            `
        })
        markers[i] = new google.maps.Marker({
            position: { 
                lat: education[i].LATITUDE,
                lng: education[i].LONGITUDE
            },
            map,
            title: `${education[i].NAME}`
        })
        markers[i].addListener("click", () => {
            closeOpenInfoWindows();
            infowindows[i].open(map, markers[i]);
        })
    }
}

function directions(destination) {

    let origin = `${pos.lat},${pos.lng}`;

    directionsService.route(
        {
            origin: {
                query: origin
            },
            destination: {
                query: destination
            },
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                $(".error").html(`Error: Directions request failed due to ${staus}`);
            }
        }
    )

}

function changePins(category) {
    for (let i = 0; i < education.length; i++) {
        if (category == "all") {
            markers[i].setMap(map);
        } else {
            if (category == education[i].CATEGORY) {
                markers[i].setMap(map);
            } else {
                markers[i].setMap(null);
            }
        }
    }
}

function closeOpenInfoWindows() {
    if (currentInfoWindow) {
        currentInfoWindow.close();
    }
    if (infowindows.length) {
        infowindows.forEach(element => {
            if (element) {
                element.close();
            }
        });
    }
    if (customInfoWindows.length) {
        customInfoWindows.forEach(element => {
            if (element) {
                element.close();
            }
        });
    }
}

$( document ).ready(function() {
    
    $(".category input:radio[name='category']").change(function() {
        changePins(`${$(this).val()}`);
    });

    document.forms.address_form.addEventListener("submit", function(event) {
        event.preventDefault();
        let address_name = document.forms.address_form.name.value;
        let address = document.forms.address_form.address.value;

        geocoder.geocode({'address': address}, function(results, status) {
            if (status === "OK") {

                customInfoWindows.push(new google.maps.InfoWindow({
                    content: `
                    <p>${address_name}</p>
                    <p>${address}</p>
                    <p><a href="#" onclick="return directions('${address}');">directions</a></p>
                    `
                }));
                customMarkers.push(new google.maps.Marker({
                    position: results[0].geometry.location,
                    map,
                    title: `${address_name}`
                }));
                customMarkers[customMarkers.length - 1].addListener("click", () => {
                    closeOpenInfoWindows();
                    customInfoWindows[customInfoWindows.length - 1].open(map, customMarkers[customMarkers.length - 1]);
                });
            } else {
                $(".error").html(`Error: Geocode was not successful for the following reason: ${staus}`);
            }
        });
  
    });

});