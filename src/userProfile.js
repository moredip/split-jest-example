module.exports = class UserProfile{
  constructor({userService}){
    this.userService = userService; 
  }

  async getUser(userId){
    return this.userService.fetchUserDetails(userId);
  }
}
