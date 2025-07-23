const { InstanceBase, Regex, TCPHelper, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const moipCommands = require('./moipCommands')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)
		this.initTCP() // Initialize TCP connection

		this.routing = {} // Initialize routing object
		this.rxNames = {} // Initialize receiver device names object
		this.txNames = {} // Initialize transmitter device names object
		this.rxList = [] // Initialize RX list
		this.txList = [] // Initialize TX list
		this.updateControllerInfo() // export variables
		
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy() {
		if (this.socket) {
			this.socket.destroy()
			this.socket = null
		}
		this.updateStatus(InstanceStatus.Disconnected)
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
		this.init()
	}
	// Return config fields for web config
	getConfigFields() {
		return [
			{//Establish MoIP Controller IP configration
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
			{//Establish MoIP Audio Reciever Index
				type: 'textinput',
				id: 'audioRx_index',
				label: 'Audio Receiver Index',
				width: 8,
				default: 1,
				regex: Regex.NUMBER,
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
			this.updateStatus(InstanceStatus.Ok)
			this.log('info', 'Requesting initial routing information from MoIP Controller...')
			
			setTimeout(() => {
				this.sendCommand(moipCommands.getNames(0)) // Get RX names after 2 seconds
			}, 500)

			setTimeout(() => {
				this.sendCommand(moipCommands.getNames(1)) // Get TX names after 4 seconds
			}, 1000)
			setTimeout(() => {
				this.sendCommand(moipCommands.getRouting()) // Get routing information after 6 seconds
			}, 1500)
			
		})

		this.socket.on('error', (err) => {
			this.log('error', `Socket error: ${err.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure)
		})


		//Incoming message handler
		this.socket.on('data', (data) => {
			const response = data.toString().trim()

			// Store for future use (feedbacks, variables, debugging)
			this.state = this.state || {}
			this.state.lastResponse = response
		  
			// Log to Companion log window
			this.log('info', `[MoIP Response] ${this.state.lastResponse}`)

			// Parse routing information
			if (response.startsWith('?Receivers=') || response.startsWith('~Receivers=')) {
				this.parseRouting(response)
			}

			// Parse device names
			if (response.startsWith('?Name=')) {
				this.parseNames(response)
			}
		  
			// Optional: Parse known error replies
			if (response.includes('#Error')) {
			  this.state.lastCommandError = true
			} else {
			  this.state.lastCommandError = false
			}
		  
			// If you want to track volume or routing responses, start parsing here
			// Example: if (response.startsWith('?Receivers=')) { ... }
		  })
	
	  }
	
	   sendCommand(cmd) {
		try {
		  if (this.socket && this.socket.isConnected) {
			this.socket.send(cmd)
			this.log('info', `Sent command: ${cmd}`)
		  } else {
			this.log('error', 'Socket not connected')
		  }
		} catch (err) {
		  this.log('info', `Failed to send command: ${err.message}`)
		}
	  }

	  /**
 * Parses a TCP response string like "?Receivers=1:3,1:2,2:1"
 * and returns a lookup object where each receiver maps to a transmitter.
 *
 */
		parseRouting(response) {
			const prefix = '?Receivers='
			const mappingString = response.slice(prefix.length);
			const pairs = mappingString.split(',')
			const routing = {}
	  
			for (const pair of pairs) {
				// Split "1:3" into [1, 3] and convert to numbers
				const [transmitter, receiver] = pair.split(':').map(Number)
	  
				// Basic validation to ensure valid numbers
				if (isNaN(receiver) || isNaN(transmitter)) {
					this.log('info', `Invalid pair encountered: ${pair}`)
					throw new Error(`Invalid pair: ${pair}`)
				}
	  
				// Store in object
				routing[receiver] = transmitter;
				//this.log('info', `Transmitter ${transmitter} is streaming to Receiver ${receiver}`)
				//this.log('info', `Receiver ${receiver} is streaming Transmitter ${transmitter}`)

				//make a new object and store the routing using names
				if (this.rxNames[receiver] && this.txNames[transmitter]) {
					this.routing[this.rxNames[receiver]] = this.txNames[transmitter]
					this.log('info', `${this.rxNames[receiver]} is streaming ${this.txNames[transmitter]}`)
				} 
			}

			this.routing = routing
		 	this.checkFeedbacks() // Update feedbacks
		}
 	 
		parseNames(response) {
			if (response.startsWith('?Name=0')) {
				//
				// Parse RX names
				//
				this.log('info', 'Parsing RX names from response')
				let rxNamesMap = {}
				let rxNamesRaw = ''
				const lines = response.toString().split('\n')
				for (const line of lines) {
					const match = line.match(/\?Name=0,(\d+),(.+)/)
					if (match) {
						const index = match[1]
						const name = match[2].trim()
						rxNamesMap[index] = name
						rxNamesRaw += name + ', '
					}
				}
				if (Object.keys(rxNamesMap).length > 0) {
					this.rxNames = { ...this.rxNames, ...rxNamesMap }					
				} else {this.log('error', 'Failed to parse RX names response')}

				this.rxList = Object.entries(this.rxNames).map(([index, name]) => ({
					id: index,
					label: name,
				}))
				this.log('info', `RX List: ${JSON.stringify(this.rxList)}`)

				
			} else if (response.startsWith('?Name=1')) {
				//
				// Parse TX names
				//
				this.log('info', 'Parsing TX names from response')
				let txNamesMap = {}
				let txNamesRaw = ''
				const lines = response.toString().split('\n')
				for (const line of lines) {
					const match = line.match(/\?Name=1,(\d+),(.+)/)
					if (match) {
						const index = match[1]
						const name = match[2].trim()
						txNamesMap[index] = name
						txNamesRaw += name + ', '
					}
				}
				if (Object.keys(txNamesMap).length > 0) {
					this.txNames = { ...this.txNames, ...txNamesMap }
				} else {this.log('error', 'Failed to parse TX names response')}

				this.txList = Object.entries(this.txNames).map(([index, name]) => ({
					id: index,
					label: name,
				}))
				this.log('info', `TX List: ${JSON.stringify(this.txList)}`)
			}
			else {
			this.log('error', 'Unknown response format for names')
			return
			}

			// Update actions and feedbacks after parsing names
			this.updateActions()
			this.updateFeedbacks()
			this.checkFeedbacks()
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

	async updateControllerInfo() {
		//Request and parse volume level
		if (this.socket && this.socket.isConnected) {
			this.sendCommand(moipCommands.getAudioVolume(this.config.audioRx_index))
			this.socket.once('data', (data) => {
				const match = data.toString().match(/=\d+,(\d+)/)
				if (match) {
					const currentVolume = parseInt(match[1])
					this.setVariableValues({'volume_level' : currentVolume})
					this.log('info', `Current volume level: ${currentVolume}`)
				} else {
					this.log('error', 'Failed to parse volume query response')
				}
			})
		} else {
			this.log('error', 'Socket not connected, cannot update controller info')
			return
		} 

		
	} 
}

runEntrypoint(ModuleInstance, UpgradeScripts)
