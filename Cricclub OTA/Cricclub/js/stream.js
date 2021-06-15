// const constraints = MediaStreamConstraints({ video: true });
var to_stream = true;
var stream_data;
var ws;
var fixture_id;
var club_id;
var youtube_key;
var mediaRecorder;

function startStream() {
    if (!to_stream) {
        console.log('Stream started broooo');
        console.log(stream_data);
        socket_connection();
        to_stream = true;
        recorder();
    }

}


function stopStream() {
    window.location.reload();
}

function socket_connection() {
    ws = new WebSocket("wss://ubuntuvideostreamingmanual.cricclubs.com:3000");
    ws.onopen = function (event) {
        console.log("connected to server");
        var streaming_data = {
            youtube_key: "9caa-h7wc-4bdj-qrx7-10e6",
            fixture_id: 1372,
            club_id: 50,
        };

        ws.send(
            JSON.stringify(streaming_data)
        );
        console.log(streaming_data);
    };

    ws.addEventListener('message', (msg) => {
        console.log('message recived ws: ', msg);
    });
    ws.addEventListener('error', (msg) => {
        console.log("Error websocket : ", msg)
    });
}


function recorder() {
    console.log('function called');
    var options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        // mimeType: 'video/mp4'
    }
    mediaRecorder = new MediaRecorder(stream_data);
    mediaRecorder.start(1000);

    mediaRecorder.ondataavailable = function (e) {
        if (ws && ws.readyState == 1) {
            console.log('sending data ', e.data);
            ws.send(e.data);
        }
        // console.log('media recorder data:  ', e.data);

    }
}


function accesCamera(deviceId) {
    var constraints = deviceId ? {audio: false, video: {width: 1280, height: 720, deviceId: deviceId}} : {
        audio: true,
        video: {width: 1280, height: 720}
    };
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (mediaStream) {
            const track = mediaStream.getVideoTracks()[0];
            var video = document.querySelector('video');
            console.log('recived stream : ', mediaStream);
            video.srcObject = mediaStream
            video.onloadedmetadata = (e) => {
                console.log('logging onloadedmetadata : ', e);
                // document.getElementById("loading-gif").style.display = "none"
                video.play();
                stream_data = mediaStream;
                to_stream = false;
            }
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        }); // always check for errors at the end.
}


function getListOfCameras() {
    // if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    //     console.log("enumerateDevices() not supported");
    //     return;
    // }

    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        const element = document.getElementById('listCameras');
        devices.forEach((device) => {
            // console.log(device.kind + ": " + device.label +
            //     " id = " + device.deviceId);
            if (device.kind === 'videoinput') {
                const el = document.createElement("div");
                el.classList.add("py-2", "border", "mb-3");
                const text = device.label ? document.createTextNode(device.label) : document.createTextNode(device.deviceId);
                el.appendChild(text);
                el.style.cursor = "pointer";
                el.style.userSelect = "none";
                console.log(device.label);
                el.addEventListener('click', () => {
                    accesCamera(device.deviceId);
                },);
                element.appendChild(el);
            }
        })
    })
}

function updateStreamRightInput() {
    let  stream_key = document.getElementById("stream_key");
    let stream_overlay_url = document.getElementById("stream_overlay_url");
    let stream_site = document.getElementById("stream_site");

    stream_key.value  = youtube_key;
    // stream_overlay_url =


}

function updateStreamData() {
    let  stream_key = document.getElementById("stream_key");
    let stream_overlay_url = document.getElementById("stream_overlay_url");
    let stream_site = document.getElementById("stream_site");

    youtube_key = stream_key.value;
    console.log(youtube_key);
}

function refreshStreamData() {
    getJson();
}

function getJson() {
    var url = "https://sportapi.cricclubs.com/sport/app/event/stream?deviceId=a123-bdcetesd-cc3343";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            youtube_key = xhr.response['data']['key'];
            fixture_id = xhr.response['data']['matchId'];
            club_id = xhr.response['data']['clubId'];
            // socket_connection();
            updateStreamRightInput();
        } else {
            console.log(xhr.response);
        }
    };
    xhr.send();
}

window.addEventListener("DOMContentLoaded", function () {
    getJson();
    getListOfCameras();
});
