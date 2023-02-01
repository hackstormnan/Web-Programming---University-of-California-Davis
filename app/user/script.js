document.getElementById("lafLogo").addEventListener("click", function(){
  window.location.href = "home.html";
});

document.getElementById("nextBtn").addEventListener("click", function(){
  let firstSearch = document.getElementById("firstSearch");
  let secondSearch = document.getElementById("secondSearch");
  firstSearch.className = "hidden";
  secondSearch.className = "show";
  return false;
});

document.getElementById("searchBar").addEventListener("click", function(){
  let input = document.getElementById("input");
  let search = document.getElementById("search");
  input.className = "hidden";
  search.className = "show";
});

document.getElementById("attachment").addEventListener("change", function(){
  // get the file with the file dialog box
  const selectedFile = document.getElementById("attachment").files[0];
  // store it in a FormData object
  const formData = new FormData();
  formData.append('newImage',selectedFile, selectedFile.name);
  
  // build an HTTP request data structure
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);
  xhr.onloadend = function(e) {
    console.log("POST: upload");
    console.log(xhr.responseText);
    sendGetRequest(selectedFile);
  }
  
  // actually send the request
  xhr.send(formData);
});


// sends an AJAX request asking the server 
function sendGetRequest(selectedFile) {
  let xhr = new XMLHttpRequest;
  // it's a GET request, it goes to URL /seneUploadToAPI
  xhr.open("GET","/sendUploadToAPI");
  console.log("sendUploadToAPI");
  // Add an event listener for when the HTTP response is loaded
  // xhr.addEventListener("load", function() {
  //     if (xhr.status == 200) {  // success
  //       console.log("MESSSSSSAGE"+xhr.responseText);
  //       // showMsg("goodMessage",xhr.responseText);
  //     } else { // failure
  //       // showMsg("badMessage",xhr.responseText);
  //     }
  // });
  xhr.onloadend = function(e){
    // let newImage = document.querySelector("#cardImg");
    // newImage.src = "http://ecs162.org:3000/images/zroyu/"+selectedFile.name;
    // newImage.style.display = 'block';
    // document.querySelector('.image').classList.remove('upload');
    // document.querySelector('.btn').textContent = 'Replace Image';
  }
  
  // Actually send request to server
  xhr.send(null);
}



//Building auto-complete starts

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

let Buildings = ['Academic Surge', 'Activities & Recreation Center (ARC)', 'Advanced Materials Research Laboratory', 'Aggie Surplus (Bargain Barn) & Custodial', 'Advanced Transportation Infrastructure Research Center', 'Agriculture Field Station', 'Agriculture Service Office', 'Animal Husbandry Beef Barn', 'Animal Husbandry Feed Scales', 'Animal Husbandry Sheep', 'Animal Resource Service V (AH Goat)', 'Animal Resources Service Headquarters', 'Animal Science Horse Barn', 'Animal Sciences Teaching Facility 1', 'Animal Sciences Teaching Facility 2', 'Ann E. Pitzer Center', 'Annual Fund Trailer', 'Aquaculture Facility Hatchery', 'Aquatic Biology & Environmental Science Bldg', 'Aquatic Weed Laboratory', 'Arboretum Headquarters (Valley Oak Cottage)', 'Arboretum Teaching Nursery', 'Art Annex', 'Art Building', 'Art Studio-Graduate Building', 'Asmundson Hall', 'Bainer Hall', 'Bike Barn', 'Bowley Plant Science Teaching Facility', 'Briggs Hall', 'California Hall', 'California Raptor Museum', 'Center for Companion Animal Health', 'Center for Comparative Medicine', 'Center for Equine Health', 'Center for Health & Environment Office & Laboratory', 'Center for Neuroscience', 'Center for Vectorborne Diseases, Laboratory', 'Center for Vectorborne Diseases, Main Office', 'Center for Vectorborne Diseases, Staff Offices', "Chancellor's Residence", 'Chemistry', 'Chemistry Annex', 'Civil & Industrial Services', '116 A Street', 'Conference Center & Welcome Center', 'Contained Research Facility', 'Cottonwood Cottage (Temporary Classroom 30)', 'Cowell Building', 'Cruess Hall', 'Dairy', 'Davis 501 Oak Ave', 'Design & Construction Management (DCM)', 'Dutton Hall', 'Earth and Physical Sciences Building', 'Earth & Planetary Sciences Shockwave Lab', 'East House', 'Educational Opportunity Program (EOP)', 'Eichhorn Family House', 'Elderberry Cottage', 'Enology Laboratory Building', 'Environmental Horticulture', 'Environmental Services Facility Headquarters', 'Equestrian Center Covered Arena', 'Everson Hall', 'Facilities Mechanical Operations', 'Facilities Services', 'Facilities Structural Trailer', 'Fire & Police Building', 'Fleet Services Central Garage Campus', 'FOA: 1050 Extension Center Drive', 'FPS Facility (Main Lab & Office)', 'Freeborn Hall', 'Gallagher Hall', 'Gateway Parking Structure', 'Genome & Biomedical Sciences Facility', 'Geotechnical Centrifuge', 'Germplasm Laboratory', 'Ghausi Hall', 'Giedt Hall', 'Gourley Clinical Teaching Center', 'Grounds', 'Music Annex', 'Guilbert House', 'Hangar', 'Hangar Office', 'Haring Hall', 'Harry H. Laidlaw Jr. Honey Bee Research Facility', 'Hart Hall', 'Heitman Staff Learning Center', 'Hickey Gym', 'Hoagland Annex', 'Hoagland Hall', 'Hopkins Building', 'Hopkins Svcs Complex Auxiliary', 'Hopkins Svcs Complex Receiving', 'Human and Community Development Administration', 'Human Resources Administration Building', 'Hunt Hall', 'Hutchison Child Development Center', 'Hutchison Hall', 'Hyatt Place', 'International Center', 'International House', 'Jackson Sustainable Winery', 'John A. Jungerman Hall (formerly Crocker Nuclear Lab)', 'Kemper Hall', 'Kerr Hall', 'King Hall', 'Kleiber Hall', 'Latitude Dining Commons', 'Life Sciences', 'Maddy Lab', 'Manetti Shrem Museum', 'Mann Laboratory', 'Mathematical Sciences Building', 'Meat Laboratory, Cole Facility Building C', 'Medical Sciences 1 B (Carlson Health Sciences Library)', 'Medical Sciences 1 C', 'Medical Sciences 1 D', 'Memorial Union', 'Meyer Hall', 'Mondavi Center for the Performing Arts', 'Mondavi Center for the Performing Arts - Administration', 'Mrak Hall', 'Music Building', 'Nelson Hall (University Club)', 'Neurosciences Building', 'Noel-Nordfelt Animal Science Goat Dairy and Creamery', 'North Hall', 'Olson Hall', 'Orchard House', 'Outdoor Adventures', 'Parsons Seed Certification Center', 'Pavilion at the ARC', 'Peter A. Rock Hall', 'Peter J. Shields Library', 'Pavilion Parking Structure', 'Physical Sciences & Engineering Library', 'Physics Building', 'Plant & Environmental Sciences', 'Plant Reproductive Biology Facility', 'Pomology Field House C', 'Poultry Headquarters', 'Pritchard VMTH', 'Putah Creek Lodge', 'Quad Parking Structure', 'Regan Central Commons', 'Reprographics', 'Robbins Hall', 'Robbins Hall Annex', 'Robert Mondavi Institute Brewery, Winery, and Food Pilot Facility', 'Robert Mondavi Institute - North', 'Robert Mondavi Institute - Sensory', 'Robert Mondavi Institute - South', 'Roessler Hall', 'Schaal Aquatic Center', 'Schalm Hall', 'School of Education Building', 'Sciences Lab Building', 'Sciences Lecture Hall', 'Scrub Oak Hall (Auditorium)', 'Scrubs Cafe', 'Segundo Dining Commons', 'Segundo Services Center', 'Silo', 'Silo South', 'Social Sciences & Humanities', 'Social Sciences Lecture Hall (1100)', 'South Hall', 'Sprocket Annex', 'Sprocket Building', 'Sproul Hall', 'Storer Hall', 'Student Community Center', 'Student Health & Wellness Center', 'Student Housing', 'Surge II', 'Surge IV (TB 200,TB 201,TB 202,TB 203)', 'Swine Teaching and Research Facility', 'TB 009', 'TB 16', 'TB 116', 'TB 117', 'TB 118', 'TB 119', 'TB 120', 'TB 123', 'TB 124', 'TB 140', 'TB 188', 'TB 189', 'TB 206', 'TB 207', 'Temporary Classroom 1', 'Temporary Classrooms 2 & 3', 'Tercero Services Center', 'The Barn', 'The Grove (Surge III)', 'Thermal Energy Storage', 'Thurman Laboratory', 'Toomey Weight Room', 'Transportation and Parking Services', 'Trinchero Family Estates Building', 'Tupper Hall', 'UC Davis Health Stadium East', 'UC Davis Health Stadium North', 'UC Davis Health Stadium North', 'UC Davis Health Stadium West', 'Unitrans Maintenance Facility', 'University Extension Building', 'University House & Annex', 'University Services Building', 'Urban Forestry', 'Utilities Headquarters', 'Valley Hall', 'Veihmeyer Hall', 'Vet Med 3A', 'Vet Med 3A - MPT', 'Vet Med 3B', 'Vet Med Equine Athletic Performance Lab', 'Vet Med Laboratory Facility Large Animal Holding', 'Veterinary Medicine 2', 'Veterinary Medicine Student Services and Administrative Center', 'Veterinary Genetics Lab', 'Viticulture Relocation C', 'Voorhies Hall', 'Walker Hall', 'Walnut Cottage', 'Walter A. Buehler Alumni Center', 'Water Science & Engineering Hydraulic L2', 'Watershed Science Facility', 'Wellman Hall', 'West House', 'Western Center for Agricultural Equipment', 'Western Human Nutrition Research Center (WHNRC)', 'Wickson Hall', 'Willow Cottage', 'Wright Hall', 'Wyatt Deck', 'Wyatt Pavilion', 'Young Hall', 'Young Hall Annex']

// autocomplete(document.getElementById("myInput"),Buildings);
autocomplete(document.getElementById("location"),Buildings);
autocomplete(document.getElementById("location1"),Buildings);
//Building auto-complete ends