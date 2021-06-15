const wifiListUrl = '';

const url = "http://192.168.1.48:5000"


async function getWifiList() {

    let response =
        await fetch((url + '/wifilist'))

    let data = await response.json()
    console.log("data", data["li"]);
    return data["li"];
    // return ['Niltech1', "Niltech1-5G", "Niltech2", "Niltech2-5G", "Android"]
}

async function connectToWifi(ssid, password) {
    console.log("Connecting to wifi");
    // console.log("SSID: ", ssid);
    // console.log('PASSWORD: ', password);
    const u = url + '/connect?' + "ssid=" + ssid + "&" + "password=" + password;
    let response = await fetch(u)
    let data = await response.json();
    return data;
}

async function getWifiStatus() {
    try {
        let response = await fetch(url + '/get-wifi-status');
        let data = await response.json();
        console.log("Data : ", data);
        return data['status'];
    } catch (e) {
        console.log("get Wifistatus error");
        return "Unknown";
    }
}

function getInternetStatus() {

    return 'Unknown';
}
