function updateWifiInput(data) {
    const el = document.getElementById('input_ssid');
    el.value = data;
    console.log(el.value);
}


function connectToWifiBtn() {
    let ssid = document.getElementById("input_ssid");
    let password = document.getElementById("input_password");
    // console.log("SSID : ", ssid.value);
    // console.log("PASS : ", password.value);
    if (ssid && password) {
        connectToWifi(ssid.value, password.value).then((data) => console.log(data));
        // console.log(connectedToWifi(ssid.value, password.value));
    }
}

function updateWifiStatus() {
    console.log("Function called");
    const element = document.getElementById("wifi_status");
    const text = getWifiStatus().then((result) => {
        element.innerText = result;
    });
}

function updateInternetStatus() {
    const element = document.getElementById("internet_status");
    const text = getInternetStatus();
    console.log(text);
    element.innerText = text;
}


function updateWifi() {
    let element = document.getElementById("wifi_list")

    // removes previous wifi child elements if exists.
    removeWifiChild();

    const main_ele = document.createElement("div");
    main_ele.id = "wifi_list_container";
    element.appendChild(main_ele);

    // fetches the list of wifi from the server and
    // add's it to the list
    getWifiList().then((result) => {
        result.forEach((d) => {
            const el = document.createElement("div");
            el.classList.add("py-2", "border", "mb-3");
            el.appendChild(document.createTextNode(d));
            el.style.cursor = "pointer";
            el.style.userSelect = "none";
            el.addEventListener("click", () => {
                updateWifiInput(d);
            });
            main_ele.appendChild(el)
        });
    });
    console.log("hello");
}

function removeWifiChild() {
    const list = document.getElementById("wifi_list_container");
    console.log(list.childNodes.length);
    list.remove();

}

window.addEventListener("DOMContentLoaded", function () {
    updateWifiStatus();
    updateInternetStatus();
    setInterval(() => {
        updateWifiStatus();
    }, 5000);
});

