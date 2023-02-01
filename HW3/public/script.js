"use strict";

let modal = document.getElementById("myModal");
let btn = document.getElementById("save");
let popup = document.getElementsByClassName("close")[0];


popup.onclick = function() {
  modal.style.display = "none";
};

const diamond = "\u27e1";
const cross = "\u2756";

let currentFontIcon = document.querySelector("#fonts span");

// add event listeners
document.querySelectorAll("#fonts input").forEach(i => {
  // if status of one button changes, this will be called
  i.addEventListener("change", () => {
    // because these are radio buttons, i.checked is true for
    // the one selected
    if (i.checked) {
      console.log("checked");
      // change diamonds
      // put the crossed diamond in front of this choice
      i.previousElementSibling.textContent = cross;
      // put the regular diamond in front of the last choice
      currentFontIcon.textContent = diamond;
      // and remember that this is the current choice
      currentFontIcon = i.previousElementSibling;

      document.querySelector("#message").className = i.value;
    }
  });
});

//CHANGE COLOR

const colors = [
  "#e6e2cf",
  "#dbcaac",
  "#c9cbb3",
  "#bbc9ca",
  "#A6A5B5",
  "#B5A6AB",
  "#ECCFCF",
  "#eceeeb",
  "#BAB9B5"
];

// querySelectorAll returns a list of all the elements with class color-box
const colorBoxes = document.querySelectorAll(".color-box");

colorBoxes.item(0).style.border = "1px solid black";
let currentColor = colorBoxes.item(0);

colorBoxes.forEach((b, i) => {
  b.style.backgroundColor = colors[i];

  b.addEventListener("click", () => {
    // colorBoxes.forEach((d) => {
    //   d.style.border = 'none';
    // })
    currentColor.style.border = "none";
    b.style.border = "1px solid black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
    currentColor = b;
  });

  b.addEventListener("mouseover", () => {
    b.style.border = "1px dashed black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
  });
  b.addEventListener("mouseout", () => {
    if (b != currentColor) {
      b.style.border = "none";
      document.querySelector(".postcard").style.backgroundColor =
        currentColor.style.backgroundColor;
    } else {
      b.style.border = "1px solid black";
    }
  });
});


function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

document.querySelector("#save").addEventListener("click", () => {

  let msg = document.querySelector("#message");
  let img = document.querySelector("#cardImg");
  let string_id = makeid(20);
  let srchref = "https://final-hw3-jnaxuwz.glitch.me/display.html?id=" + string_id;
  document.getElementById("overtext").innerText = srchref;
  document.getElementById("overtext").href = srchref;
  modal.style.display = "block";

  let data = {
    image: img.src,
    color: currentColor.style.backgroundColor,
    font: msg.className,
    message: msg.innerText,
    string_id: string_id
  };

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/saveDisplay");
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.onloadend = function(e) {
  };
  xmlhttp.send(JSON.stringify(data));
});

document.querySelector("#imgUpload").addEventListener("change", () => {
  const selectedFile = document.querySelector("#imgUpload").files[0];
  const formData = new FormData();
  formData.append("newImage", selectedFile, selectedFile.name);

  let button = document.querySelector(".btn");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);
  xhr.onloadend = function(e) {
    let newImage = document.querySelector("#cardImg");
    newImage.src = "http://ecs162.org:3000/images/jnaxu/" + selectedFile.name;
    newImage.style.display = "block";
    document.querySelector(".image").classList.remove("upload");
    button.textContent = "Replace Image";
  };
  button.textContent = "Uploading...";
  xhr.send(formData);
});

