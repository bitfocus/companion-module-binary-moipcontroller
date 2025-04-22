module.exports = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'variable2', name: 'My second variable' },
		{ variableId: 'variable3', name: 'Another variable' },
	 	{ variableId: 'rx_tx_map', name: 'RX to TX Mapping' },
     	{ variableId: 'scene_active', name: 'Active Scene Name' },
      	{ variableId: 'volume_levels', name: 'Receiver Volume Levels (CSV)' },
    ]);

    function updateVariables() {
      // Get Receiver Input Mappings
      self.sendCommand('?Receivers\n')
      self.socket.once('data', (data) => {
        const match = data.toString().match(/=([\d:,]+)/)
        if (match) {
          self.setVariableValues({ rx_tx_map: match[1] })
        }
      })

      // Get Scene List (just populates the last known active scene)
      self.sendCommand('?Scenes\n')
      self.socket.once('data', (data) => {
        const match = data.toString().match(/=\{([^}]+)\}/)
        if (match) {
          self.setVariableValues({ scene_active: match[1] })
        }
      })

      // Get All Volume Levels
      self.sendCommand('?AudioVolumelevel=1\n')
      self.socket.once('data', (data) => {
        const match = data.toString().match(/=\d+,(\d+)/)
        if (match) {
          self.setVariableValues({ volume_levels: match[1] })
        }
      })
    }
}
