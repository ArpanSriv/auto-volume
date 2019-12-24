# chrome-auto-volume
[![HitCount](http://hits.dwyl.io/ArpanSriv/auto-volume.svg)](http://hits.dwyl.io/ArpanSriv/auto-volume)

A utility to automatically manage the volume of any process with regards to the chrome volume. (That is the volume of the process reduces if something is being played in chrome.)

## Usage 📜

1. Install the unpacked extension from the [chrome_extension](chrome_extension) directory.

2. Start the flask server by running 'python app.py' and not 'flask run'.

3. Turn the extension on.

Note: Currently the name of the process 'Music.UI.exe' (Groove Music) is hardcoded. Change it in [app.py](app.py) in the main function.

## TODO: ✅

- [ ] Add tests 🔴
- [ ] Add error box in extension in case of any errors. 🟡
- [ ] Make the extension choose the name of the process to manipulate the volume of. 🔴
- [ ] Keep a settings page for extension. 🟡
    - [ ] Add Option to add more ports
- [ ] Add a GUI to the flask server. 🔴
- [ ] Make a clean folder structure for chrome extension. 🟡
- [ ] Other OS Support. 🟡
- [ ] Pack the extension. 🟡
- [x] Switch off extension if the server is not running. 🟢
- [x] Add License. 🟢

## Note: Works on Windows only.

## Contributions: 🎁
Contributions are most welcome. Fork the repo and submit a pull request.

## License: [MIT License](LICENSE) 
