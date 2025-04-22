const moipCommands = require('./moipCommands')

module.exports = function (self) {
	self.setActionDefinitions({
		sample_action: { // Sample action that came with the template
			name: 'Say Hello!',
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 100,
				},
			],
			callback: async (event) => {
				self.log('info', 'Hello World!, the number is: ' + event.options['num'])
			},
		},

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
	  
		  exit_session: {
			name: 'Exit Session',
			options: [],
			callback: () => {
			  const cmd = moipCommands.exitSession()
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
	  
		  activate_scene: {
			name: 'Activate Scene',
			options: [
			  {
				type: 'textinput',
				label: 'Scene Name',
				id: 'name',
				default: 'Movie Night',
			  },
			],
			callback: ({ options }) => {
			  const cmd = moipCommands.activateScene(options.name)
			  self.sendCommand(cmd)
			},
		  },
	  
		  volume_up: {
			name: 'Volume Up (+5)',
			options: [
			  {
				type: 'number',
				label: 'Receiver Index (RX)',
				id: 'rx',
				default: 1,
			  },
			],
			callback: ({ options }) => {
			  self.sendCommand(`?AudioVolumelevel=${options.rx}\n`)
			  self.socket.once('data', (data) => {
				const match = data.toString().match(/=\d+,(\d+)/)
				if (match) {
				  const current = parseInt(match[1])
				  const next = Math.min(100, current + 5)
				  const cmd = moipCommands.setAudioVolume(options.rx, next)
				  self.sendCommand(cmd)
				}
			  })
			},
		  },
	  
		  volume_down: {
			name: 'Volume Down (-5)',
			options: [
			  {
				type: 'number',
				label: 'Receiver Index (RX)',
				id: 'rx',
				default: 1,
			  },
			],
			callback: ({ options }) => {
			  self.sendCommand(`?AudioVolumelevel=${options.rx}\n`)
			  self.socket.once('data', (data) => {
				const match = data.toString().match(/=\d+,(\d+)/)
				if (match) {
				  const current = parseInt(match[1])
				  const next = Math.max(0, current - 5)
				  const cmd = moipCommands.setAudioVolume(options.rx, next)
				  self.sendCommand(cmd)
				}
			  })
			},
		  },
	})
}
