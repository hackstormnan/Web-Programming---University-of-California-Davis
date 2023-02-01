//learn a lot from w3school

const c1 = "&#11046;";
const c2 = "&#10070;";

let fontnow = document.querySelector("#fonts span");
console.log(fontnow);

document.querySelectorAll("#fonts input").forEach(f => {
  f.addEventListener("change", () => {
    if (f.checked) {
      console.log("checked");

      f.previousElementSibling.innerHTML = c2;
      fontnow.innerHTML = c1;
      fontnow = f.previousElementSibling;

      document.querySelector("#message").className = f.value;
    }
  });
});

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

const choosecolor = document.querySelectorAll(".color");

choosecolor.item(0).style.border = "1px solid black";
let colornow = choosecolor.item(0);

choosecolor.forEach((a, b) => {
  a.style.backgroundColor = colors[b];

  a.addEventListener("click", () => {
    colornow.style.border = "none";
    a.style.border = "1px solid black";
    document.querySelector(".maincard").style.backgroundColor = colors[b];
    colornow = a;
  });

  a.addEventListener("mouseover", () => {
    a.style.border = "1px dashed black";
    document.querySelector(".maincard").style.backgroundColor = colors[b];
  });
  a.addEventListener("mouseout", () => {
    if (a != colornow) {
      a.style.border = "none";
      document.querySelector(".maincard").style.backgroundColor =
        colornow.style.backgroundColor;
    } else {
      a.style.border = "1px solid black";
    }
  });
});

document.querySelector("#save").addEventListener("click", () => {
  let msg = document.querySelector("#message");
  let img = document.querySelector("#cardImg");
  let info = {
    image: img.src,
    color: colornow.style.backgroundColor,
    font: msg.className,
    message: msg.textContent
  };
  // console.log(info);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sharePostcard");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onloadend = function() {
    console.log(xhr.responseText);
    // window.location = "display.html";
    window.location = window.location.href + "display.html";
  };
  xhr.send(JSON.stringify(info));
});

document.querySelector("#imgUpload").addEventListener("change", () => {
  const choosefile = document.querySelector("#imgUpload").files[0];

  const data = new FormData();
  data.append("newImage", choosefile, choosefile.name);

  let button = document.querySelector(".but");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://final-hw2.glitch.me/upload", true);
  xhr.onloadend = function(e) {
    console.log(xhr.responseText);
    let newImage = document.querySelector("#cardImg");
    newImage.src = "https://final-hw2.glitch.me/images/" + choosefile.name;
    newImage.style.display = "block";
    document.querySelector(".image").classList.remove("upload");
    button.textContent = "Replace Image";
  };

  button.textContent = "Uploading...";

  xhr.send(data);
});
