const async = require('async')
const config = require('../../config/config')
const PostEvent = require('../../domain-models/event/post-event')
const topic_enum = require('../../repositories/enums/topic')
const sendMessage = require('../fcm/send-message')
module.exports = class NotificationHandler {
  constructor(notification_service, topic_service) {
    this.notification_service = notification_service;
    this.topic_service = topic_service;
    this.handle = this.handle.bind(this)
  }

  handle({ action, payload }, callback) {
    switch (action) {
      case PostEvent.POST_CREATED:
        this.handle_post_created(payload, callback)
        break
      case PostEvent.REVIEW_CREATED:
        this.handle_review_created(payload, callback)
        break
      case PostEvent.SUB_REVIEW_CREATED:
        this.handle_sub_review_created(payload, callback)
        break
      default:
        return callback(null, null)
    }
  }

  handle_post_created(payload, callback) {
    let { post } = payload
    console.log(post)
    // tao topic moi cua post
    this.topic_service.create({
      topic_id: post.post_id,
      type: topic_enum.POST
    }).then((err1, newTopic) => {
      if (err1) {
        callback(err1)
        return
      }
      //save notifcation vao db
      return this.notification_service.create({
        topic_id: newTopic.topic_id,
        content: `${post.full_name} đã đăng một bài viết mới`
      })
    }).then((err2, newNotification) => {
      if (err2) {
        callback(err2);
        return
      }
      // lay danh sach nguoi dung theo doi user dang post
      return this.topic_service.get_all_user_by_topic(post.user_id, topic_enum.USER)
    }).then((err3, sub_users) => {
      if (err3) {
        callback(err3);
        return
      }
      let processes = sub_users.map(sub_user => {
        sendMessage({ newNotification }, sub_user.refresh_token)       // push notify cho nguoi dung
        return this.notification_service.add_unseen_notify(sub_user.user_id, newNotification.notification_id); // danh dau chua xem
      });
      return Promise.all(processes);
    }).then(() => {
      callback(null, { success: true });
      return null;
    }).catch(error => {
      callback(error);
      return null;
    })
  }

  handle_review_created(payload, callback) {
    let { post, review } = payload
    console.log(review)
  }

  handle_sub_review_created(payload, callback) {
    let { sub_review, review } = payload
    console.log(sub_review)
  }

}