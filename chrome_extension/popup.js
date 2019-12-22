const EXT_NOT_SET = -1
const EXT_OFF = 0
const EXT_ON = 1

const SOUND_OFF = 2
const SOUND_ON = 3

const INTERVAL_NOT_SET = -2
const INTERVAL_DEFAULT = 2000


extension_status = EXT_OFF
poll_interval = INTERVAL_DEFAULT


var port = chrome.extension.connect({
    name: "Sample Communication"
});

// Imp: Will send only when popup is active


port.onMessage.addListener(function (msg) {
    // console.log("Listener adding...")
    console.log("Message: ")
    console.log(msg)

    if (msg.hasOwnProperty('EXT_STATUS')) {
        extension_status = msg.ext_status
        print("Message recieved: ext_status = " + msg.ext_status)
    } 

    if (msg.hasOwnProperty('POLL_INTERVAL')) {
        poll_interval = msg.interval
        print(`Message recieved: interval = ${poll_interval}`)
    }
});

for (i = 0; i < 100; i++) {
    port.postMessage("Hi Background");
    
}

