const { combineRgb } = require('@companion-module/base')
const { moipCommands } = require('./moipCommands')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		// ChannelStatus: {
		// 	name: 'Example Feedback',
		// 	type: 'boolean',
		// 	label: 'Channel State',
		// 	defaultStyle: {
		// 		bgcolor: combineRgb(255, 0, 0),
		// 		color: combineRgb(0, 0, 0),
		// 	},
		// 	options: [
		// 		{
		// 			id: 'num',
		// 			type: 'number',
		// 			label: 'Re',
		// 			default: 5,
		// 			min: 0,
		// 			max: 10,
		// 		},
		// 	],
		// 	callback: (feedback) => {
		// 		self.log('info', 'Hello world!', feedback.options.num)
		// 		if (feedback.options.num > 5) {

		// 			return true
		// 		} else {
		// 			return false
		// 		}
		// 	},
		// },

		AV_Route: {
			type: 'boolean',
			name: 'Audio/Video Route',
			label: 'Audio/Video Route',
			description: 'Feedback for the current audio/video route',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
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
			callback: (feedback) => {
				const tx = feedback.options.tx  // User-selected Transmitter #
				const rx = feedback.options.rx  // User-selected Receiver #

				return self.routing[rx] === tx // Update the routing object with the current state

			},
		},

	})
}
