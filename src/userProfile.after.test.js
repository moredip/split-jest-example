const UserProfile = require('./userProfile');

describe("UserProfile", ()=> {
  withFeatureFlagInvariant('shouldCacheUserProfile', (fakeFeatureFlags)=>{
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


      expect(fakeUserService.fetchUserDetails)
        .toHaveBeenCalledWith(someUserId);
    });
  });

  withFeatureFlagOff('shouldCacheUserProfile', (fakeFeatureFlags)=>{
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

      expect(fakeUserService.fetchUserDetails)
        .toHaveBeenCalledTimes(2);
    });
  });

  withFeatureFlagOn('shouldCacheUserProfile', (fakeFeatureFlags)=>{
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

      expect(fakeUserService.fetchUserDetails)
        .toHaveBeenCalledTimes(1);
      expect(secondResult).toEqual(firstResult);
    });
  });
});

function withFeatureFlagInvariant(featureCheckName,fn){
  withFeatureFlagOn(featureCheckName,fn);
  withFeatureFlagOff(featureCheckName,fn);
}

function withFeatureFlagOn(featureCheckName,fn){
  describe(`with feature ${featureCheckName} on`, ()=>{
    const featureFlags = createFixedFeatureFlags(featureCheckName,true);
    fn(featureFlags);
  });
}

function withFeatureFlagOff(featureCheckName,fn){
  describe(`with feature ${featureCheckName} off`, ()=>{
    const featureFlags = createFixedFeatureFlags(featureCheckName,false);
    fn(featureFlags);
  });
}

function createFixedFeatureFlags(featureCheckName,fixedFlagState){
  return {
    [featureCheckName]: ()=> fixedFlagState
  };
}
