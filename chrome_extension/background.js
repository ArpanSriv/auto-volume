console = chrome.extension.getBackgroundPage().console

total_tabs = 0
sound_output = false

function update_total_tabs(results) {
    total_tabs = results.length
    console.log("Tabs: " + total_tabs)
}

function soundOff(results) {

    if (results.length == total_tabs) {
        sound_output = false
    } else {
        sound_output = true
    }

    console.log('Sound: ' + sound_output)
}

function mainLoop() { 
   
    setTimeout(function () { // Run forever
        
        chrome.tabs.query({}, update_total_tabs)


        chrome.tabs.query({
            audible: false
        }, soundOff)
        
        mainLoop();
    
    }, 1000)
}

mainLoop();
 
