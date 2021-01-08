/* start the map */
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
    });
}

/* after dom is loaded */
$(document).ready(function() {
    
    console.log(education);
    
});