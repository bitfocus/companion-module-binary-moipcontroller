const moipCommands = require('./moipCommands')

module.exports = function (self) {
	self.setActionDefinitions({
		switch_input: {
			name: 'Switch Input',
			options: [
			  {
				type: 'dropdown',
				label: 'Source (Tx)',
				id: 'tx',
				choices: self.txList,
			  },
			  {
				type: 'dropdown',
				label: 'Destination (Rx)',
				id: 'rx',
				choices: self.rxList,
			  },
			],
			callback: ({ options }) => {
			  const txIndex = options.tx
			  const rxIndex = options.rx
			  const cmd = moipCommands.switchInput(txIndex, rxIndex)
			  self.log('info', `Sending ${options.tx} to ${options.rx}`)
			  self.sendCommand(cmd)
			},
		  },
	  
		  disconnect_input: {
			name: 'Disconnect Input from Receiver',
			options: [
			  {
				type: 'dropdown',
				label: 'Destination (Rx)',
				id: 'rx',
				choices: self.rxList,
			  },
			],
			callback: ({ options }) => {
			  const cmd = moipCommands.switchInput(0, options.rx)
			  self.sendCommand(cmd)
			},
		  },
	  
		  display_osd: {
			name: 'Display OSD Message',
			options: [
			  {
				type: 'number',
				label: 'Receiver Index',
				id: 'rx',
				default: 1,
			  },
			  {
				type: 'textinput',
				label: 'Message',
				id: 'message',
				default: 'Hello World',
			  },
			],
			callback: ({ options }) => {
			  const cmd = moipCommands.displayOSD(options.rx, options.message)
			  self.sendCommand(cmd)
			},
		  },
	  
		  clear_osd: {
			name: 'Clear OSD Message',
			options: [
			  {
				type: 'number',
				label: 'Receiver Index',
				id: 'rx',
				default: 1,
			  },
			],
			callback: ({ options }) => {
			  const cmd = moipCommands.displayOSD(options.rx, 'CLEAR')
			  self.sendCommand(cmd)
			},
		  },
	  
		  reboot_controller: {
			name: 'Reboot Controller',
			options: [],
			callback: () => {
			  const cmd = moipCommands.rebootController()
			  self.sendCommand(cmd)
			},
		  },
	  
	  
		  cec_control: {
			name: 'Set CEC Mode',
			options: [
			  {
				type: 'number',
				label: 'Receiver Index',
				id: 'rx',
				default: 1,
			  },
			  {
				type: 'dropdown',
				label: 'Mode',
				id: 'mode',
				choices: [
				  { id: 0, label: 'Off' },
				  { id: 1, label: 'On' },
				],
				default: 1,
			  },
			],
			callback: ({ options }) => {
				const cmd = moipCommands.setCEC(options.rx, options.mode)
			 	self.sendCommand(cmd)
			},
		  },
	  
		  volume_up: {
			name: 'Volume Up (+5)',

			callback: () => {
				if(self.getVariableValue('volume_level') !== undefined && self.getVariableValue('volume_level') !== 100){ //check volume level variable
					let volume = self.getVariableValue('volume_level') //make local variable
					const audioRxIndex = self.config.audioRx_index // Use default value of 1 if undefined
					volume = Math.min(100, volume + 5) //set volume to current + 5
					const cmd = moipCommands.setAudioVolume(audioRxIndex, volume) //set volume to current + 5
					self.setVariableValues({'volume_level' : volume}) //update variable
					self.log('info', 'Volume level set to: ' + self.getVariableValue('volume_level'))//log current volume level
					self.sendCommand(cmd) //send command to MoIP
				} else if (self.getVariableValue('volume_level') == 100) {
					self.log('info', 'Volume level is already at 100')
				}else{
					self.log('info', 'Volume level not found, initializing variables')
					self.updateControllerInfo()
				}
			}
		  },
	  
		  volume_down: {
			name: 'Volume Down (-5)',
			
			callback: () => {
				if(self.getVariableValue('volume_level') !== undefined && self.getVariableValue('volume_level') !== 0){ //check volume level variable
					let volume = self.getVariableValue('volume_level') //make local variable
					const audioRxIndex = self.config.audioRx_index // Use default value of 1 if undefined
					volume = Math.max(0, volume - 5) //set volume to current - 5
					const cmd = moipCommands.setAudioVolume(audioRxIndex, volume) //set volume to current - 5
					self.setVariableValues({'volume_level' : volume}) //update variable
					self.log('info', 'Volume level set to: ' + self.getVariableValue('volume_level'))//log current volume level
					self.sendCommand(cmd) //send command
				} else if (self.getVariableValue('volume_level') == 0) {
					self.log('info', 'Volume level is already at 0')
				}else{
					self.log('info', 'Volume level not found, initializing variables')
					self.updateControllerInfo()
				}
			}
		  },

		  volume_mute: {
			name: 'Mute Volume',
			callback: () => {
				const audioRxIndex = self.config.audioRx_index // Use default value of 1 if undefined
				const cmd = moipCommands.setAudioVolume(audioRxIndex, 0) //mute audio
				self.log('info', 'Volume muted')//log current volume level
				self.sendCommand(cmd) //send command to MoIP
			}
		  },

		  volume_unmute: {
			name: 'Unmute Volume',
			callback: () => {
				let volume = self.getVariableValue('volume_level') //make local variable
				const audioRxIndex = self.config.audioRx_index // Use default value of 1 if undefined
				const cmd = moipCommands.setAudioVolume(audioRxIndex, volume) //unmute audio
				self.log('info', 'Volume unmuted')//log current volume level
				self.sendCommand(cmd) //send command to MoIP
			}
		  },

	})
}
