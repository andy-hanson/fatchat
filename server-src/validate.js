export const
	validateName = name => {
		if (name.length < 2)
			return 'Length must be >= 2.'
		if (name.length > 14)
			return 'Length must be <= 14.'
	},

	validateRoomName = validateName,

	validateMessage = msg => {
		if (msg.length < 2)
			return 'Length must be >= 2.'
		if (msg.length > 100)
			return 'Length must be <= 100.'
	}
