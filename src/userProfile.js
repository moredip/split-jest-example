module.exports = class UserProfile{
  constructor({userService,featureFlags}){
    this.userService = userService; 
    this.featureFlags = featureFlags;
    this.responseCache = new Map();
  }

  async getUser(userId){
    if(this.featureFlags.shouldCacheUserProfile()){
      return this.getUserWithCache(userId);
    }else{
      return this.getUserWithoutCache(userId);
    }
  }

  async getUserWithCache(userId){
    if(this.responseCache.has(userId)){
      return this.responseCache.get(userId);
    }

    const response = this.getUserWithoutCache(userId);
    this.responseCache.set(userId,response);
    return response;
  }

  async getUserWithoutCache(userId){
    return await this.userService.fetchUserDetails(userId);
  }
}
