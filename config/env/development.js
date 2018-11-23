module.exports = {
	port: 8080,
	mysql: {
		username: 'wtt',
		password: 'Wtt@20181',
		database: 'wtt-notification',
		host: '18.191.51.82',
		dialect: 'mysql',
		dialectOptions: { charset: 'utf8mb4', decimalNumbers: true },
		define: { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' },
		pool: {
			min: 0,
			max: 10,
			acquire: 15000
		}
	},
	authen: {
		secret: 'test',
		token_expires_in: 2 * 7 * 24 * 60 * 60
	},
	retry: {
		times: 5,
		interval: retry_count => 50 * Math.pow(2, retry_count)
	},
	message_producer: {
		options: {
			connectionString: '206.189.191.22:9092'
		},
		topic: 'tuan-wtt'
	},
}