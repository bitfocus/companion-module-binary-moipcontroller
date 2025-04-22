const { InstanceBase, Regex, TCPHelper, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.initTCP() // Initialize TCP connection
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}
	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				regex: Regex.PORT,
			},
		]
	}

	initTCP() {
		if (this.socket) {
		  this.socket.destroy()
		}

		this.socket = new TCPHelper(this.config.host, 23)
	
		this.socket.on('connect', () => {
		  this.log('info', 'Connected to SnapAV MoIP Controller')
		  this.checkFeedbacks('connection_status')
		})
	
		this.socket.on('data', (data) => {
		  const response = data.toString()
		  this.log('debug', `Response: ${response}`)
	
		  if (response.includes('#Error')) {
			this.state.lastCommandError = true
			this.checkFeedbacks('recent_error')
		  } else {
			this.state.lastCommandError = false
			this.checkFeedbacks('recent_error')
		  }
		})
	
		this.socket.on('error', (err) => {
		  this.log('error', `Socket error: ${err}`)
		  this.checkFeedbacks('connection_status')
		})
	  }
	
	  sendCommand(cmd) {
		if (this.socket && this.socket.isConnected) {
		  this.socket.send(cmd)
		} else {
		  this.log('error', 'Socket not connected. Trying to reconnect...')
		}
	  }
	  

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
