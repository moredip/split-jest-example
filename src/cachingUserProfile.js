module.exports = class UserProfile{
  constructor({userService,featureFlags}){
    this.userService = userService; 
    this.featureFlags = featureFlags;
    this.userCache = new Map();
  }

  async getUser(userId){
    if(this.featureFlags.shouldCacheUserProfile()){
      return this.getUserWithCache(userId);
    }else{
      return this.getUserWithoutCache(userId);
    }
  }

  async getUserWithCache(userId){
    if(this.userCache.has(userId)){
      return this.userCache.get(userId);
    }

    const user = this.getUserWithoutCache(userId);
    this.userCache.set(userId,user);
    return user;
  }

  async getUserWithoutCache(userId){
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
