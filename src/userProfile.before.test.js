const UserProfile = require('./cachingUserProfile');

describe("UserProfile", ()=> {
  let fakeFeatureFlags; 
  describe("with caching off", ()=> {
    beforeEach( ()=>{
      fakeFeatureFlags = createFakeFeatureFlags({shouldCacheUserProfile:false});
    });

    it('makes a call to the user service with the appropriate userId', async ()=> {
      const fakeUserService = {
        fetchUserDetails: jest.fn()
      };
      const someUserId = 123;

      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });
      await userProfile.getUser(someUserId);

      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
    });

    it('calls the user service every time', async ()=> {
      const fakeUserService = {
        fetchUserDetails: jest.fn().mockReturnValue({fake:"response"})
      };

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
    beforeEach( ()=>{
      fakeFeatureFlags = createFakeFeatureFlags({shouldCacheUserProfile:true});
    });

    it('makes a call to the user service with the appropriate userId', async ()=> {
      const fakeUserService = {
        fetchUserDetails: jest.fn()
      };
      const someUserId = 123;

      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });
      await userProfile.getUser(someUserId);

      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
    });

    it('calls the user service once, then returns cached result', async ()=> {
      const fakeUserService = {
        fetchUserDetails: jest.fn().mockReturnValue({fake:"response"})
      };

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
