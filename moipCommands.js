/**
 * SnapAV Binary MoIP Command Generator for cleaner code
 * All functions return command strings to be sent via TCP to the MoIP controller.
 */

module.exports = {
    getFirmware: () => `?Firmware\n`,
    getRouting: () => `?Receivers\n`,
    getDevices: () => `?Devices\n`,
    getNames: (type = 0) => `?Name=${type}\n`, // 0 = RX, 1 = TX
    getScenes: () => `?Scenes\n`,
    getAudioVolume: (rx) => `?AudioVolumeLevel=${rx}\n`,
    getHDMIAudioMute: (rx) => `?HDMIAudioMute=${rx}\n`,
  
    switchInput: (tx, rx) => `!Switch=${tx},${rx}\n`,
    setResolution: (rx, mode) => `!Resolution=${rx},${mode}\n`,
    displayOSD: (rx, message) => `!OSD=${rx},${message}\n`,
    setOSDImage: (url, refreshRate, receivers, pos) =>
      `!SetOSDImage=${url},${refreshRate},[${receivers.join(',')}],${pos}\n`,
    setOSDSource: (tx, receivers, pos) =>
      `!SetOSDSource=${tx},[${receivers.join(',')}],${pos}\n`,
    stopOSD: (receivers) => `!StopOSD=[${receivers.join(',')}]\n`,
    rebootController: () => `!Reboot\n`,
    exitSession: () => `!Exit\n`,
    setCEC: (rx, mode) => `!CEC=${rx},${mode}\n`, // 0 = Off, 1 = On
  
    sendSerial: (type, index, baudStr, data) =>
      `!Serial=${type},${index},${baudStr},${data}\n`,
    sendIR: (type, index, pronto) => `!IR=${type},${index},${pronto}\n`,
    setAudioVolume: (rx, level) => `!SetAudioVolumeLevel=${rx},${level}\n`,
    setHDMIAudioMute: (rx, mute) => `!HDMIAudioMute=${rx},${mute}\n`, // 0 = Unmute, 1 = Mute
    activateScene: (name) => `!ActivateScene=${name}\n`,
  };
  