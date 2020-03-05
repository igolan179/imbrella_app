var switcher = document.querySelector(".checkbox");
var slider = document.querySelector(".slider");
var today = document.querySelector(".today");
var tomorrow = document.querySelector(".tomorrow");
var zone = document.querySelector("#zone");
var umbrella = document.querySelector(".umbrella");
var umbrella_animation = document.querySelector(".toggle");
var sun = document.querySelector(".sonar-emitter");
var selectbox = document.querySelector(".selectbox");
var clouds = document.querySelectorAll(".cloud");

slider.addEventListener('click', function (e) {
    if (switcher.checked) {
        switcher.checked = false;
        today.classList.toggle("highlight");
        tomorrow.classList.toggle("highlight");
    }
    else {
        switcher.checked = true;
        today.classList.toggle("highlight");
        tomorrow.classList.toggle("highlight");
    }
});
today.addEventListener('click', function (e) {
    if (switcher.checked) {
        switcher.checked = false;
        today.classList.toggle("highlight");
        tomorrow.classList.toggle("highlight");
        let temp = zone.value.split(",")
        city.forEach((val) => {
            if (temp[0] == val.name) {
                getWeather(`http://api.openweathermap.org/data/2.5/forecast?lat=${val.coord.lat}&lon=${val.coord.lon}&appid=e6691cb66c8bfc0795ee874d3407fba1`)
            }
        });
    }
});
tomorrow.addEventListener('click', function (e) {
    if (!switcher.checked) {
        switcher.checked = true;
        today.classList.toggle("highlight");
        tomorrow.classList.toggle("highlight");
        let temp = zone.value.split(",")
        city.forEach((val) => {
            if (temp[0] == val.name) {
                getWeather(`http://api.openweathermap.org/data/2.5/forecast?lat=${val.coord.lat}&lon=${val.coord.lon}&appid=e6691cb66c8bfc0795ee874d3407fba1`)
            }
        });
    }
});
const userGeoLoacation = new Promise(function (resolve, reject) {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let currentPosition = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            }
            resolve(currentPosition);
        }, function () {
            // User rejected the location sharing request 

        });
    } else {
        // Browser doesn't support Geolocation

    }
});
userGeoLoacation.then(function (currentPosition) {
    getWeather(`http://api.openweathermap.org/data/2.5/forecast?lat=${currentPosition.lat}&lon=${currentPosition.lon}&appid=e6691cb66c8bfc0795ee874d3407fba1`)
});



function getWeather(url) {
    const server = new Promise((resolve, reject) => {
        downloadUrl(url, function (data) {
            let obj = JSON.parse(data.response);
            resolve(obj);
        });
    });
    server.then((data) => {
        writeZone(data.city.name, data.city.country);
        if (switcher.checked == true) {
            weatherActions(data.list[8].weather[0].main);
        }
        else weatherActions(data.list[0].weather[0].main);

    });
}

function doNothing() { }

function downloadUrl(url, callback) {
    var request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };
    request.open('GET', url, true);
    request.send(null);
}

function writeZone(city, country) {
    zone.value = `${city}, ${country}`;
}
function weatherActions(data) {
    if (data == "Rain") {
        umbrella.classList.remove("standby");
        umbrella_animation.setAttribute("checked", true);
        document.querySelector(".title").innerHTML = "You Need an Umbrella!";
        sun.style.display = "none";
        makeItRain("rain");
        document.body.classList.add("darksky");
        clouds.forEach((val) => {
            val.classList.add("grey");
        });
    }
    else {
        umbrella.classList.remove("standby");
        umbrella_animation.removeAttribute("checked");
        document.querySelector(".title").innerHTML = "You Don't Need an Umbrella!";
        sun.style.display = "block";
        makeItRain("stop");
        document.body.classList.remove("darksky");
        clouds.forEach((val) => {
            val.classList.remove("grey");
        });
    }
}
function autocomplete(input, cities) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    input.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        let counter = 0;
        for (i = 0; i < cities.length && counter < 6; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += cities[i].name.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + cities[i].name + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    input.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();

                });
                a.appendChild(b);
                counter++;
            }
        }
        counter = 0;
    });
    /*execute a function presses a key on the keyboard:*/
    input.addEventListener("keydown", function (e) {
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
            let temp = zone.value.split(",")
            if (temp[0] == "rain") {
                console.log("testing rain")
                weatherActions("Rain")
            }
            if (temp[0] == "norain") {
                console.log("testing no rain");
                weatherActions("Clouds")
            }
            city.forEach((val) => {
                if (temp[0] == val.name) {
                    getWeather(`http://api.openweathermap.org/data/2.5/forecast?lat=${val.coord.lat}&lon=${val.coord.lon}&appid=e6691cb66c8bfc0795ee874d3407fba1`)
                }
            });
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
            if (elmnt != x[i] && elmnt != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
autocomplete(zone, city);