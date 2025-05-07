const { combineRgb } = require('@companion-module/base')
const { moipCommands } = require('./moipCommands')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		ChannelStatus: {
			name: 'Example Feedback',
			type: 'boolean',
			label: 'Channel State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Re',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: (feedback) => {
				console.log('Hello world!', feedback.options.num)
				if (feedback.options.num > 5) {
					return true
				} else {
					return false
				}
			},
		},

		AV_Route: {
			type: 'boolean',
			name: 'Audio/Video Route',
			label: 'Audio/Video Route',
			description: 'Feedback for the current audio/video route',
			defaultStyle: {
				bgcolor: combineRgb(0, 0, 0),
				color: combineRgb(255, 255, 255),
			},
			options: [
				{
					id: 'tx',
					type: 'number',
					label: 'Transmitter #',
					default: 1,
					min: 1,
				},
				{
					id: 'rx',
					type: 'number',
					label: 'Receiver #',
					default: 1,
					min: 1,	
				}
			],
			callback: ({ options }) => {
				// const cmd = moipCommands.getRouting()
				// self.sendCommand(cmd)
				// self.log('debug', `Checking route for TX ${options.tx} to RX ${options.rx}`)
				// self.socket.once(data => {
				// 	const response = data.toString()
				// 	self.log('debug', `Received response: ${response}`)
					
				// 	// This is a placeholder; you will need to implement the actual parsing logic
				// 	const isActive = response.includes(`TX${options.tx} RX${options.rx}`)
					
				// 	if (isActive) {
				// 		return true
				// 	} else {
				// 		return false
				// 	}
				// })

				

				// // For now, we'll just return true for demonstration purposes
				// return true
				
			},
		}

	})
}
