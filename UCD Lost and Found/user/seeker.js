// Google Map Api start
// GLOBAL VARs
var coords, map, map2, myMarker, myMarker2;
var google;

// DYNAMIC LOAD MAPS API
// https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API
var script = document.createElement("script");

// UNCOMMENT THIS
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCDVK45xZOTksaRZ3eC4lyQjOy5xGsHOzs&callback=initMap";
script.defer = true;
script.async = true;

function initMap() {
  var myLatlng = new google.maps.LatLng(38.5367859,-121.7553711);
  // SET MAP PROPERTIES
  var mapProp = {
    center: myLatlng,
    // center: new google.maps.LatLng(38.5367859, -121.7553711), // USE USER GPS LOCATION
    zoom: 15 // LARGER IS ZOOM IN
  };

  // INIT MAP
  map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
  map2 = new google.maps.Map(document.getElementById("googleMap2"), mapProp);

  myMarker = new google.maps.Marker({
    position: myLatlng,   
  });

  myMarker2 = new google.maps.Marker({
    position: myLatlng,
  });

  myMarker.setDraggable(true);
  myMarker.setPosition(map.center);
  myMarker.setMap(map);

  myMarker2.setDraggable(true);
  myMarker2.setPosition(map2.center);
  myMarker2.setMap(map2);

  myMarker.addListener("dragend", function() {
    map.setCenter(myMarker.getPosition());
    let url =
      "/getAddress?lat=" +
      myMarker.getPosition().lat() +
      "&lng=" +
      myMarker.getPosition().lng();
    // console.log(marker.getPosition().lat());
    // console.log(marker.getPosition().lng());
    // console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        document.getElementById("location").value =
          data.results[0].formatted_address;
      });
  });
  
  myMarker2.addListener("dragend", function() {
    map.setCenter(myMarker.getPosition());
    let url =
      "/getAddress?lat=" +
      myMarker.getPosition().lat() +
      "&lng=" +
      myMarker.getPosition().lng();
    // console.log(marker.getPosition().lat());
    // console.log(marker.getPosition().lng());
    // console.log(url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        document.getElementById("location1").value =
          data.results[0].formatted_address;
      });
  });
  
  
}

const search_bar1 = document.getElementById("location");
search_bar1.addEventListener("change", search1);

function search1() {
  let url =
    "/searchAddress?input=" +
    document.getElementById("location").value +
    ",Davis";
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      document.getElementById("location").value =
        data.candidates[0].formatted_address;
      myMarker.setPosition(data.candidates[0].geometry.location);
      map.setCenter(myMarker.getPosition(data.candidates[0].geometry.location));
    });
}

const search_bar2 = document.getElementById("location1");
search_bar2.addEventListener("change", search2);

function search2() {
  let url =
    "/searchAddress?input=" +
    document.getElementById("location1").value +
    ",Davis";
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      document.getElementById("location1").value =
        data.candidates[0].formatted_address;
      myMarker2.setPosition(data.candidates[0].geometry.location);
      map2.setCenter(myMarker2.getPosition(data.candidates[0].geometry.location));
    });
}

// Append the 'script' element to 'head'
document.head.appendChild(script);

//


function searchAll() {
  let date1 = document.getElementById("date1").value;
  let date2 = document.getElementById("date2").value;
  let time1 = document.getElementById("time1").value;
  let time2 = document.getElementById("time2").value;
  let category1 = document.getElementById("category1").value;
  let location1 = document.getElementById("location1").value;
  let url = "/user/result.html?date1="+ date1 +"&date2=" + date2 +"&time1=" + time1 +"&time2=" + time2 +"&category1=" + category1 +"&location1=" + location1 + "&type=all";
  window.location.href = encodeURI(url);
}

