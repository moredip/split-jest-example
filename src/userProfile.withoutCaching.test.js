const UserProfile = require('./userProfile');

describe("UserProfile", ()=> {
  it('makes a call to the user service with the appropriate userId', async ()=> {
    const fakeUserService = {
      fetchUserDetails: jest.fn().mockResolvedValue({})
    };
    const someUserId = 123;

    const userProfile = new UserProfile({
      userService:fakeUserService,
    });

    await userProfile.getUser(someUserId);

    expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
  });
});
