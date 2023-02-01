let xhr = new XMLHttpRequest();
xhr.open("GET", "display" + window.location.search);
xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhr.onloadend = function(e) {
  
  let json = JSON.parse(xhr.responseText)[0];
  
  let img = document.getElementById("cardImg");
  
  img.style.display = "block";
  
  img.src = "http://ecs162.org:3000/images/jnaxu/" + json.filename;
  
  let message = document.getElementById("message");
  
  message.innerText = json.message;
  
  message.className = json.font;
  
  document.querySelector(".postcard").style.backgroundColor = json.color;
};
xhr.send();
