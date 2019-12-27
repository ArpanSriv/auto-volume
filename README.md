# chrome-auto-volume
[![HitCount](http://hits.dwyl.io/ArpanSriv/auto-volume.svg)](http://hits.dwyl.io/ArpanSriv/auto-volume)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FArpanSriv%2Fauto-volume.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FArpanSriv%2Fauto-volume?ref=badge_shield)

A utility to automatically manage the volume of any process with regards to the chrome volume. (That is the volume of the process reduces if something is being played in chrome.)

## Usage 📜

1. Install the unpacked extension from the [chrome_extension](chrome_extension) directory.

2. Start the flask server by running 'python app.py [process_name.exe]' and not 'flask run'. { Example: python app.py Spotify.exe }

3. Turn the extension on.

~~Note: Currently the name of the process 'Music.UI.exe' (Groove Music) is hardcoded. Change it in [app.py](app.py) in the main function.~~

☑ You can now change the process name by providing the process name from the command line.

## TODO: ✅

| Status                 | Task                                                                           | Priority |
|------------------------|--------------------------------------------------------------------------------|----------|
| <ul><li>[ ] </li></ul> | Add tests                                                                      | 🔴       |
| <ul><li>[ ] </li></ul> | Add error box in extension in case of any errors.                              | 🟡       |
| <ul><li>[ ] </li></ul> | Make the extension choose the name of the process to manipulate the volume of. | 🔴       |
| <ul><li>[ ] </li></ul> | Keep a settings page for extension.                                            | 🟡       |
| <ul><li>[ ] </li></ul> | Add a GUI to the flask server.                                                 | 🔴       |
| <ul><li>[ ] </li></ul> | Make a clean folder structure for chrome extension.                            | 🟡       |
| <ul><li>[ ] </li></ul> | Other OS Support.                                                              | 🟡       |
| <ul><li>[ ] </li></ul> | Pack the extension.                                                            | 🟡       |
| <ul><li>[ ] </li></ul> | Message Passing in port.postMessage (need serialization)                       | 🟡       |
| <ul><li>[x] </li></ul> | Added support for changing process name using command line args.               | 🟢       |
| <ul><li>[x] </li></ul> | Switch off extension if the server is not running.                             | 🟢       |
| <ul><li>[x] </li></ul> | Add License.                                                                   | 🟢       |



## Note: Works on Windows only.

## Contributions: 🎁
Contributions are most welcome. Fork the repo and submit a pull request.

## Donations:
[Click Here](https://paypal.me/arpansrivastav) to donate.


## License: [MIT License](LICENSE) 
