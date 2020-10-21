module.exports = class UserProfile{
  constructor({userService}){
    this.userService = userService; 
  }

  async getUser(userId){
    const response  = await this.userService.fetchUserDetails(userId);
    return this.transformResponse(response);
  }

  transformResponse(response){
    // in a real system, we'd do some logic here to
    // pull out the information we care about in a nice
    // format
    return response;
  }
}
