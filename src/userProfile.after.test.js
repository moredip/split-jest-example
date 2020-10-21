const UserProfile = require('./cachingUserProfile');

describe("UserProfile", ()=> {
  let fakeUserService;
  beforeEach( ()=>{
    fakeUserService = {
      fetchUserDetails: jest.fn().mockReturnValue({fake:"response"})
    };
  });

  describeFeatureFlagInvariant('shouldCacheUserProfile', (fakeFeatureFlags)=>{
    it('makes a call to the user service with the appropriate userId', async ()=> {
      const someUserId = 123;

      const userProfile = new UserProfile({
        userService:fakeUserService,
        featureFlags:fakeFeatureFlags
      });
      await userProfile.getUser(someUserId);


      expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
    });
  });

  describeFeatureFlagOff('shouldCacheUserProfile', (fakeFeatureFlags)=>{
    it('calls the user service every time', async ()=> {
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

  describeFeatureFlagOn('shouldCacheUserProfile', (fakeFeatureFlags)=>{
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
});

function describeFeatureFlagInvariant(featureCheckName,fn){
  describeFeatureFlagOn(featureCheckName,fn);
  describeFeatureFlagOff(featureCheckName,fn);
}

function describeFeatureFlagOn(featureCheckName,fn){
  describe(`with feature ${featureCheckName} on`, ()=>{
    const featureFlags = createFixedFeatureFlags(featureCheckName,true);
    fn(featureFlags);
  });
}

function describeFeatureFlagOff(featureCheckName,fn){
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
