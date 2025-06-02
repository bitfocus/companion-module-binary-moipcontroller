const moipCommands = require('./moipCommands')

module.exports = function (self) {
	self.setActionDefinitions({
		// sample_action: { // Sample action that came with the template
		// 	name: 'Say Hello!',
		// 	options: [
		// 		{
		// 			id: 'num',
		// 			type: 'number',
		// 			label: 'Test',
		// 			default: 5,
		// 			min: 0,
		// 			max: 100,
		// 		},
		// 	],
		// 	callback: async (event) => {
		// 		//self.log('info', 'Hello World!, the number is: ' + event.options['num'])
		// 		const cmd = moipCommands.getRouting()
		// 		self.sendCommand(cmd)
		// 		setTimeout(() => {
		// 			for (let i = 1; i <= 3; i++) {
		// 				let routingValue = self.routing[i]
		// 				self.log('info', `Receiver ${i} is streaming transmitter ${routingValue}`)
		// 			}
		// 		}, 10)
		// 	},
		// },

		switch_input: {
			name: 'Switch Input',
			options: [
			  {
				type: 'number',
				label: 'Transmitter #',
				id: 'tx',
				default: 1,
			  },
			  {
				type: 'number',
				label: 'Receiver #',
				id: 'rx',
				default: 1,
			  },
			],
			callback: ({ options }) => {
			  const cmd = moipCommands.switchInput(options.tx, options.rx)
			  self.log('debug', "Switching input to " + options.tx + " on receiver " + options.rx)
			  self.sendCommand(cmd)
			},
		  },
	  
		  disconnect_input: {
			name: 'Disconnect Input from Receiver',
			options: [
			  {
				type: 'number',
				label: 'Receiver Index (RX)',
				id: 'rx',
				default: 1,
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
