console = chrome.extension.getBackgroundPage().console

// Two Way Communication with popup.js
chrome.extension.onConnect.addListener(function (port) {
    console.log("Connected ...");

    port.onMessage.addListener(function (msg) {
        console.log("message recieved" + msg);
        port.postMessage("Hi Popup.js");
    });

    // constants declaration
    const EXT_NOT_SET = -1
    const EXT_OFF = 0
    const EXT_ON = 1

    const SOUND_OFF = 2
    const SOUND_ON = 3

    const INTERVAL_NOT_SET = -2
    const INTERVAL_DEFAULT = 2000

    // init variables
    poll_interval = INTERVAL_DEFAULT
    sound_output = SOUND_OFF
    extension_status = EXT_NOT_SET
    total_tabs = 0

    function update_total_tabs(results) {
        total_tabs = results.length
        console.log("Tabs: " + total_tabs)
    }

    // Callback function for chrome.query
    function soundOff(results) {

        // If total number of non sound tabs == total tabs then...
        if (results.length == total_tabs) {
            sound_output = SOUND_OFF
        } else {
            sound_output = SOUND_ON
        }

        console.log('Sound: ' + sound_output)
    }

    function mainLoop() {

        if (extension_status == EXT_OFF) return;

        setTimeout(function () { // Run forever

            chrome.tabs.query({}, update_total_tabs)

            chrome.tabs.query({
                audible: false
            }, soundOff)

            mainLoop();

        }, poll_interval)
    }


    function update_values_from_storage() {
        chrome.storage.local.get({'EXT_STATUS': EXT_NOT_SET} , (data) => {
            if (data.EXT_STATUS == EXT_NOT_SET) {
                chrome.storage.local.set({'EXT_STATUS': EXT_OFF}, () => {
                    console.log('EXT_STATUS value set.')
                })

                return;
            }

            console.log(`Recieved value from storage for EXT_STATUS: ${data.EXT_STATUS}`)
            extension_status = data.EXT_STATUS
            port.postMessage({
                'EXT_STATUS': data.EXT_STATUS
            })
        })

        chrome.storage.local.get({'POLL_INTERVAL': INTERVAL_NOT_SET}, (data) => {
            if (data.POLL_INTERVAL == INTERVAL_NOT_SET) {
                chrome.storage.local.set({'POLL_INTERVAL': INTERVAL_DEFAULT}, () => {
                    console.log('Init interval value.')
                })

                return;
            }

            console.log(`Recieved value from storage for POLL_INTERVAL: ${data.POLL_INTERVAL}`)
            interval = data.POLL_INTERVAL
            port.postMessage({
                'POLL_INTERVAL': data.POLL_INTERVAL
            })
        })
    }



    update_values_from_storage()

    

    mainLoop();

})