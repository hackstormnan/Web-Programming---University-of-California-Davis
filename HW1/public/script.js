//reference:https://www.w3schools.com/howto/howto_js_countdown.asp
var countDownDate = new Date("May 10, 2020 17:00:00").getTime();

var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var seconds = Math.floor(distance / 1000);
  document.getElementById("count").innerHTML = seconds.toLocaleString();
}, 1000);

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var points = document.getElementsByClassName("point");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < points.length; i++) {
    points[i].className = points[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  points[slideIndex - 1].className += " active";
}
