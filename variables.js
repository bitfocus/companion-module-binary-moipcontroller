module.exports = function (self) {
  self.setVariableDefinitions([
    { variableId: 'volume_level', name: 'Audio Receiver Volume Level' },
  ])

  return {
    variableDefinitions: self.variableDefinitions,
  }
}
