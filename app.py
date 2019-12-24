from flask import Flask, request
from pycaw.pycaw import AudioUtilities
import numpy as np
import sys

app = Flask(__name__)

AUDIO_OFF = 'AUDIO_OFF'
AUDIO_ON = 'AUDIO_ON'

CURRENT_STATE = AUDIO_ON

CURRENT_PROCESS_VOLUME = -1

class AudioController(object):
    def __init__(self, process_name):
        self.process_name = process_name
        self.volume = self.process_volume()

    def mute(self):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            interface = session.SimpleAudioVolume
            if session.Process and session.Process.name() == self.process_name:
                interface.SetMute(1, None)
                print(self.process_name, 'has been muted.')  # debug

    def unmute(self):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            interface = session.SimpleAudioVolume
            if session.Process and session.Process.name() == self.process_name:
                interface.SetMute(0, None)
                print(self.process_name, 'has been unmuted.')  # debug

    def process_volume(self):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            interface = session.SimpleAudioVolume
            if session.Process and session.Process.name() == self.process_name:
                print('Volume:', interface.GetMasterVolume())  # debug
                return interface.GetMasterVolume()

    def set_volume(self, decibels):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            interface = session.SimpleAudioVolume
            if session.Process and session.Process.name() == self.process_name:
                # only set volume in the range 0.0 to 1.0
                self.volume = min(1.0, max(0.0, decibels))
                interface.SetMasterVolume(self.volume, None)
                print('Volume set to', self.volume)  # debug

    def decrease_volume(self, decibels):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            interface = session.SimpleAudioVolume
            if session.Process and session.Process.name() == self.process_name:
                # 0.0 is the min value, reduce by decibels
                self.volume = max(0.0, self.volume-decibels)
                interface.SetMasterVolume(self.volume, None)
                print('Volume reduced to', self.volume)  # debug

    def increase_volume(self, decibels):
        sessions = AudioUtilities.GetAllSessions()
        for session in sessions:
            interface = session.SimpleAudioVolume
            if session.Process and session.Process.name() == self.process_name:
                # 1.0 is the max value, raise by decibels
                self.volume = min(1.0, self.volume+decibels)
                interface.SetMasterVolume(self.volume, None)
                print('Volume raised to', self.volume)  # debug


# from .main import *

@app.route('/audio_manager/')
def manipulate_volume():
    # audio_controller.mute()
    global CURRENT_PROCESS_VOLUME
    global CURRENT_STATE

    chrome_audio_status = request.args.get('status', AUDIO_OFF)
    
    if chrome_audio_status == AUDIO_ON:

        if CURRENT_STATE == AUDIO_ON:
            
            CURRENT_PROCESS_VOLUME = audio_controller.process_volume()

            print("Current Volume: {}".format(CURRENT_PROCESS_VOLUME))

            for i in np.linspace(CURRENT_PROCESS_VOLUME, 0.0, 40):
                print("i: {}".format(i))
                audio_controller.set_volume(i)

            CURRENT_STATE = AUDIO_OFF

            return "Muted."

    elif chrome_audio_status == AUDIO_OFF:
    #    audio_controller.unmute() 
        if CURRENT_STATE == AUDIO_OFF:
            print("CURRENT_PRO_VOL: {}".format(CURRENT_PROCESS_VOLUME))

            for i in np.linspace(0, CURRENT_PROCESS_VOLUME, 40):
                    print("i: {}".format(i))
                    audio_controller.set_volume(i)

            CURRENT_STATE = AUDIO_ON

            return "Unmuted."

    return "Hola ${}".format(request.args.get('hello'))

if __name__ == '__main__':

    # Error handling for the sys.argv

    audio_controller = AudioController(sys.argv[1])

    CURRENT_PROCESS_VOLUME = audio_controller.process_volume()

    app.run(port=50000)