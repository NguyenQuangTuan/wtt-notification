const User = function(params){
    let self = this;
    self.user_id = params.user_id;
    self.refresh_token = params.refresh_token;
}

module.exports = User;