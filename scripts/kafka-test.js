const config = require('../config/config')
const KafkaProducer = require('../messaging/kafka-producer')
const PostEvent = require('../domain-models/event/post-event')

const kafka_producer = new KafkaProducer(config.message_producer.options, config.message_producer.topic)

let publish_obj = {
  action: PostEvent.REVIEW_CREATED,
  payload: {
    "review": {
      "review_id": 2,	// id review
      "content": "good",	// nội dung review
      "user_id": "5PGXbvehe",	// id người review
      "post_id": "CP9hZWY3d",	// id bài viết
      "full_name": "tuan"		// tên người viết review
    },
    "post": {
      "post_id": "CP9hZWY3d",	// id bài viết
      "user_id": "abcd"		// id chủ bài viết
    }
  }
}

kafka_producer.send('tuan-wtt', 123, publish_obj, (err, res) => {
  if (err) console.log(err)
  else console.log(res)
})