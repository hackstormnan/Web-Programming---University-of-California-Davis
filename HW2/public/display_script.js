"use strict";

getList();

function displayList(list) {
  document.querySelector("#cardImg").src = list.image;
  document.querySelector(".maincard").style.background = list.color;
  document.querySelector("#message").className = list.font;
  document.querySelector("#message").textContent = list.message;
}

function getList() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "list");
  xhr.addEventListener("load", function() {
    if (xhr.status == 200) {
      let responseStr = xhr.responseText;
      let list = JSON.parse(responseStr);
      console.log(list);
      displayList(list);
    } else {
      console.log("fail");
      console.log(xhr.responseText);
    }
  });
  xhr.send();
}
