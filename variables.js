module.exports = function (self) {
  self.setVariableDefinitions([
    { variableId: 'volume_level', name: 'Audio Receiver Volume Level' },
    //{ variableId: 'rx_names_map', name: 'Receiver Names Map' },
    //{ variableId: 'rx_names', name: 'Receiver Names' },
    //{ variableId: 'tx_names_map', name: 'Transmitter Names Map' },
    //{ variableId: 'tx_names', name: 'Transmitter Names' },
  ])

  return {
    variableDefinitions: self.variableDefinitions,
  }
}
