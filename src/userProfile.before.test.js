const UserProfile = require('./cachingUserProfile');

describe("UserProfile", ()=> {
  let fakeUserService;
  beforeEach( ()=>{
    fakeUserService = {
      fetchUserDetails: jest.fn().mockReturnValue({fake:"response"})
    };
  });

  describe("with caching off", ()=> {
    let fakeFeatureFlags;
    beforeEach( ()=>{
      fakeFeatureFlags = createFakeFeatureFlags({shouldCacheUserProfile:false});
    });

    it('makes a call to the user service with the appropriate userId', async ()=> {
      const someUserId = 123;

      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });
      await userProfile.getUser(someUserId);

      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
    });

    it('calls the user service every time', async ()=> {
      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });

      await userProfile.getUser('blah');
      await userProfile.getUser('blah');

      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledTimes(2);
    });
  });

  describe("with caching on", ()=> {
    let fakeFeatureFlags;
    beforeEach( ()=>{
      fakeFeatureFlags = createFakeFeatureFlags({shouldCacheUserProfile:true});
    });

    it('makes a call to the user service with the appropriate userId', async ()=> {
      const someUserId = 123;

      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });
      await userProfile.getUser(someUserId);

      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
    });

    it('calls the user service once, then returns cached result', async ()=> {
      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });

      const firstResult = await userProfile.getUser('blah');
      const secondResult = await userProfile.getUser('blah');

      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledTimes(1);
      expect(secondResult).toEqual(firstResult);
    });
  });

  function createFakeFeatureFlags(overrides={}){
    return {
      shouldCacheUserProfile: ()=> overrides.shouldCacheUserProfile
    };
  }
});
