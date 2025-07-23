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
					type: 'dropdown',
					label: 'Source (Tx)',
					choices: self.txList,  // Use the txList generated from names
					
				},
				{
					id: 'rx',
					type: 'dropdown',
					label: 'Destination (Rx)',
					choices: self.rxList,  // Use the rxList generated from names
				}
			],
			callback: ({options}) => {
				return self.routing[options.rx] == options.tx // Update the routing object with the current state

			},
		},

	})
}
