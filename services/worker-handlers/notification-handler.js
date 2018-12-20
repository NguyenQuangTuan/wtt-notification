const async = require('async')
const config = require('../../config/config')
const PostEvent = require('../../domain-models/event/post-event')
const sendMessage = require('../fcm/send-message')
module.exports = class NotificationHandler {
  constructor(notification_repository, user_repository) {
    this.notification_repository = notification_repository;
    this.user_repository = user_repository;
    this.handle = this.handle.bind(this)
    this.handle_post_created = this.handle_post_created.bind(this)
  }

  handle({ action, payload }, callback) {
    console.log(action);
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
    console.log(payload)
    this.notification_repository.createNotify({
      content: post,
      type: PostEvent.POST_CREATED
    })
      .then(newNotification => {
        // danh dau notification cho nguoi dung
        return this.notification_repository
          .add_notify_user(newNotification.notification_id, payload.user_follows)
      })
      .then(res => {
        return this.user_repository.get_refresh_tokens(payload.user_follows)
      })
      .then(refresh_tokens => {
        try {
          refresh_tokens.forEach(item => {
            sendMessage({
              title: `${post.full_name} đã đăng một bài viết mới`,
              body: post.title,
              // click_action: `https://tuannq.ml/posts/${post.post_id}`,
              icon: "https://tuannq.ml/img/logo.png"
            }, item)
          });
        } catch (error) {
          console.log(error);
        }
        callback(null, { success: true });
        return null
      })
      .catch(error => {
        console.log(error);
        callback(error);
        return null;
      })
  }

  handle_review_created(payload, callback) {
    let { post, review } = payload
    console.log(post)
    if (post.user_id == review.user_id) {
      callback(null, null);
      return null;
    }
    this.notification_repository.createNotify({
      content: payload,
      type: PostEvent.REVIEW_CREATED
    })
      .then(newNotification => {
        // danh dau notification cho nguoi dung
        return this.notification_repository
          .add_notify_user(newNotification.notification_id, [post.user_id])
      })
      .then(res => {
        return this.user_repository.get_refresh_tokens([post.user_id])
      })
      .then(refresh_tokens => {
        try {
          refresh_tokens.forEach(item => {
            sendMessage({
              title: `${review.full_name} đã bình luận về bài viết của bạn`,
              body: review.content,
              // click_action: `https://tuannq.ml/posts/${post.post_id}`,
              icon: "https://tuannq.ml/img/logo.png"
            }, item)
          });
        } catch (error) {
          console.log(error);
        }
        callback(null, { success: true });
        return null
      })
      .catch(error => {
        callback(error);
        return null;
      })
  }

  handle_sub_review_created(payload, callback) {
    let { sub_review, review } = payload
    if (sub_review.user_id == review.user_id) {
      callback(null, null);
      return null;
    }
    this.notification_repository.createNotify({
      content: payload,
      type: PostEvent.SUB_REVIEW_CREATED
    })
      .then(newNotification => {
        // danh dau notification cho nguoi dung
        return this.notification_repository
          .add_notify_user(newNotification.notification_id, [review.user_id])
      })
      .then(res => {
        return this.user_repository.get_refresh_tokens([review.user_id])
      })
      .then(refresh_tokens => {
        try {
          refresh_tokens.forEach(item => {
            sendMessage({
              title: `${sub_review.full_name} đã trả lời một bình luận của bạn`,
              body: sub_review.content,
              // click_action: `https://tuannq.ml/posts/${review.post_id}`,
              icon: "https://tuannq.ml/img/logo.png"
            }, item)
          });
        } catch (error) {
          console.log(error);
        }
        callback(null, { success: true });
        return null
      })
      .catch(error => {
        callback(error);
        return null;
      })
  }

}