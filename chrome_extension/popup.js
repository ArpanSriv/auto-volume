const EXT_NOT_SET = -1
const EXT_OFF = 0
const EXT_ON = 1

const SOUND_OFF = 2
const SOUND_ON = 3

const INTERVAL_NOT_SET = -2
const INTERVAL_DEFAULT = 2000


extension_status = EXT_OFF
poll_interval = INTERVAL_DEFAULT

$extension_status_checkbox = $('#extension-status-checkbox')

$interval_input = $('#interval-input')

function update_extension_status_toggle(new_status) {

    if (new_status == EXT_ON) {
        $extension_status_checkbox.prop('checked', false)
    } else if (new_status == EXT_OFF) {
        $extension_status_checkbox.prop('checked', true)
    }
}

function update_interval_value(new_interval) {
    $interval_input.val(new_interval)
}


var port = chrome.extension.connect({
    name: "Sample Communication"
});

// Imp: Will send only when popup is active
port.onMessage.addListener(function (msg) {
    // console.log("Listener adding...")
    console.log("Message Recieved: ")
    console.log(msg)

    if ('EXT_STATUS' in msg) {
        extension_status = msg.EXT_STATUS
        console.log("Message recieved: ext_status = " + extension_status)

        update_extension_status_toggle(extension_status)
    }

    if ('POLL_INTERVAL' in msg) {
        poll_interval = msg.POLL_INTERVAL
        console.log(`Message recieved: interval = ${poll_interval}`)

        update_interval_value(poll_interval)
    }
});

$extension_status_checkbox.change(function () {
    if ($(this).is(':checked')) {
        port.postMessage({
            'UPDATE': true,
            'EXT_STATUS': EXT_OFF
        })
    } else {
        port.postMessage({
            'UPDATE': true,
            'EXT_STATUS': EXT_ON
            // 'STOP_LOOP': true
        })
    }
});

$interval_input.on('input', function (e) {
    console.log(this.value)

    new_interval = this.value

    // if (new_interval < 1000) {
    //     this.value = 1000
    //     console.log("Sanitized value: " + this.value)
    // }

    // else if (new_interval > 5000) {
    //     this.value = 5000
    //     console.log("Sanitized value: " + this.value)
    // }

    // new_interval = this.value // Needed again because of updations in case

    port.postMessage({
        'UPDATE': true,
        'POLL_INTERVAL': new_interval
    })

});

for (i = 0; i < 100; i++) {
    port.postMessage("Hi Background");
}