console = chrome.extension.getBackgroundPage().console

// constants declaration
const EXT_NOT_SET = -1
const EXT_OFF = 0
const EXT_ON = 1

const SOUND_OFF = 2
const SOUND_ON = 3

const INTERVAL_NOT_SET = -2
const INTERVAL_DEFAULT = 2000

const SERVER_AUDIO_OFF = 'AUDIO_OFF'
const SERVER_AUDIO_ON = 'AUDIO_ON'

// init variables
poll_interval = INTERVAL_DEFAULT
sound_output = SOUND_OFF
extension_status = EXT_NOT_SET
total_tabs = 0
localhost_port = 50000
url = `http://localhost:${localhost_port}/audio_manager`


// Two Way Communication with popup.js
chrome.extension.onConnect.addListener(function (port) {
    console.log("Connected ...");

    port.onMessage.addListener(function (msg) {
        console.log("message recieved" + msg);
        // port.postMessage("Hi Popup.js");

        // if (typeof msg == 'object') {
            if ('UPDATE' in msg) {
                console.log("Updating below value:")

                if ('EXT_STATUS' in msg) {
                    console.log("Recieved message contains EXT_STATUS")
                    write_to_storage('EXT_STATUS', msg.EXT_STATUS, () => {
                        extension_status = msg.EXT_STATUS

                        if (msg.EXT_STATUS == EXT_ON) {
                            console.info('Started mainLoop() from the message listener.')
                            mainLoop()
                        }
                    })
                }

                if ('POLL_INTERVAL' in msg) {
                    console.log("Recieved message contains POLL_INTERVAL")
                    write_to_storage('POLL_INTERVAL', Number(msg.POLL_INTERVAL), () => {
                        poll_interval = Number(msg.POLL_INTERVAL)
                        console.log("New Interval updated to: " + poll_interval)
                    })
                }
            }

            if ('READ' in msg) {
                console.log("Recieved message contains READ")
                read_storage(msg.READ, msg.CALLBACK)
            }
        // }   
    });

    function update_total_tabs(results) {
        total_tabs = results.length
        console.log("Tabs: " + total_tabs)
    }

    // Callback function for chrome.query
    function soundOff(results) {

        let params = {}

        // If total number of non sound tabs == total tabs then...
        if (results.length == total_tabs) {
            sound_output = SOUND_OFF

            params.status = SERVER_AUDIO_OFF
        } else {
            sound_output = SOUND_ON

            params.status = SERVER_AUDIO_ON
        }

        let url_object = new URL(url)

        url_object.search = new URLSearchParams(params).toString()

        console.info("Sending request...")
        
        fetch(url_object)
            .then(data => data.text())
            .then((text) => console.log(`Response: ${text}`))
            .catch((error) => {
                console.error("Fetch failed. Is the server running on the correct port?")

                // Show notification
                chrome.notifications.create(
                    "chrome-auto-volume-error",
                    {
                        type: "basic",
                        iconUrl: 'software.png',
                        title: 'Auto Volume Manager',
                        message: 'Failed to connect to the main application. Is the server running?',
                        contextMessage: 'Switching off the extension.',
                        priority: 2
                    },
                    (notification_id) => console.log("Notification Shown.")
                )
                // Stop the extension
                write_to_storage('EXT_STATUS', EXT_OFF, () => {
                    extension_status = EXT_OFF

                    console.info('Stopped extension: ' + error)
                })

                // Send message to popup.js to change the checkbox state
                console.log("Sending message to popup.js to update the checkbox state.")
                port.postMessage({
                    'UPDATE': 'EXT_CHECKBOX'
                })
            })

        console.log('Sound: ' + sound_output)
    }

    // FIXME: Loop starts again on opening extension
    function mainLoop() {

        setTimeout(function () { // Run forever

            if (extension_status == EXT_OFF) return;

            chrome.tabs.query({}, update_total_tabs)

            chrome.tabs.query({
                audible: false
            }, soundOff)

            mainLoop();

        }, poll_interval)
    }

    // TODO: Add a default value param
    // Just a wrapper for chrome.storage.local
    function read_storage(key, callback) {
        
        console.log(`Reading value of ${key}`)

        chrome.storage.local.get([`${key}`], (value) => {
            console.log("read_storage: Calling read_storage callback provided.")
            console.log(callback)
            callback(value)
        })

    }

    function write_to_storage(key, value, callback = undefined) {
        // if (typeof value != "undefined") {

            if (callback == undefined) {
                console.log("Proceeding to set value in storage without callback.")

                chrome.storage.local.set({[`${key}`]: value}, () => {
                    console.log(`chrome.storage: set ${key} = ${value}`)

                    console.log("Trying to retrieve the same value...")

                    chrome.storage.local.get([`${key}`], (_) => {
                        console.log(`Retreived: ${_}`)
                        console.log(_)

                        console.assert(value == _[`${key}`], 'Assertion.')
                    })
                })
            }

            else {
                console.log("Proceeding to set value in storage with callback.")
                chrome.storage.local.set({[`${key}`]: value}, callback)
            }

            return;
        // }

        // else {
        //     if (typeof callback == "undefined") {
        //         throw Error("Callback required for getting value.")
        //     }

        //     else {
        //         if (typeof defaultValue == "undefined") {
        //             chrome.storage.local.get([key], callback)
        //         }

        //         else {
        //             chrome.storage.local.get({key: defaultValue}, callback)
        //         }
        //     }

        //     return;
        // }
    }

    function init_values_from_storage() {
        
        // TODO MakeUseOf our own storage api which is insane.
        // AND FUCCCKINNGG DOESN'T WORKKKK
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

            console.log("Sent message about ext_status.")

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

            console.log("Sent message about interval.")
        })
    }

    init_values_from_storage()

    mainLoop()
    
    // chrome.storage.local.get({EXT_STATUS: EXT_NOT_SET}, (data) => {
    //     if (data.EXT_STATUS == EXT_NOT_SET) {
    //         console.error("Well, that's an error. Init EXT_STATUS and try again maybe?")
    //     }

    //     else if (data.EXT_STATUS == EXT_OFF) {

    //     }

    //     console.log("Attempted to start loop but lol :p")
    // })

})