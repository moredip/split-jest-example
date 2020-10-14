const UserProfile = require('./userProfile');

describe("UserProfile", ()=> {
  it('makes a call to the user service', async ()=> {
    const fakeUserService = {
      fetchUserDetails: jest.fn()
    };
    const someUserId = 123;

    const userProfile = new UserProfile({userService:fakeUserService});
    await userProfile.getUser(someUserId);

    expect(fakeUserService.fetchUserDetails).toHaveBeenCalledWith(someUserId);
  });
});
