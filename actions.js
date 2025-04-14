module.exports = function (self) {
	self.setActionDefinitions({
		sample_action: { // Sample action that came with the template
			name: 'My First Action',
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
		set_ip:{ // Action to set the IP address
			name: 'set-ip',
			options:[
				{
					id: 'IP Address',
					type: 'textinput',
					label: 'IP Address',
					default: "0.0.0.0",
					regex: self.REGEX_IP,
				}
			],
			callback: async (event) => {//needs work!!!!!!!!
				self.setVariableValues({
					'CTRL_IP': event.options['IP Address']
				})
			},
		}
	})
}
