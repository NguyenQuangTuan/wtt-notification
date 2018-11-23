let workers = [
  {
    group_id: 'wtt-notification-worker',
    prefix_client_id: 'notification-worker',
    connection_string: '206.189.191.22:9092',
    topics: ['tuan-wtt'],
    client_instance: 1,
    parser_instances: 'TEXT,JSON',
    timeout: null,
    handler: 'notification_handler'
  },
]

module.exports = workers
