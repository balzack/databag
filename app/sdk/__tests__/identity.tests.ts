import { IdentityModule } from '../src/identity';
import { NoStore } from '../src/store';
import { ConsoleLogging } from '../src/logging';
import { defaultProfileEntity } from '../src/entities';
import { Profile } from '../src/types';
import { waitFor } from '../__mocks__/waitFor';

const testProfile = JSON.parse(JSON.stringify(defaultProfileEntity));

jest.mock('../src/net/fetchUtil', () => {
  const fn = jest.fn().mockImplementation((url: string, options: { method: string, body: string }) => {
    if (options.method === 'GET') {
      testProfile.handle = "test";
      return Promise.resolve({ status: 200, json: () => (testProfile) });
    }
    if (options.method === 'PUT') {
      if (url == 'http://test_url/profile/data?agent=test_token') {
        Object.assign(testProfile, JSON.parse(options.body));
      }
      else if (url == 'http://test_url/profile/image?agent=test_token') {
        testProfile.image = options.body;
      }
      return Promise.resolve({ state: 200 });
    }
  });

  return {
    fetchWithTimeout: fn,
    checkResponse: () => {},
  }
});
  
class TestStore extends NoStore {
  public async getProfileRevision(): Promise<number> {
    return 4;
  }
}

test('identity module works', async () => {
  let profile: Profile | null = null;
  const log = new ConsoleLogging();
  const store = new TestStore();
  const identity = new IdentityModule(log, store, 'test_guid', 'test_token', 'test_url', false);
  identity.setRevision(5);
  identity.addProfileListener((ev: Profile) => { profile = ev });
  await waitFor(() => (profile?.handle == 'test' && profile?.name != 'test_name' && !profile?.imageSet));
  identity.setProfileData("test_name", "test_location", "test_description");
  identity.setRevision(6);
  await waitFor(() => (profile?.name == 'test_name' && !profile?.imageSet));
  identity.setProfileImage("test_image");
  identity.setRevision(7);
  await waitFor(() => (Boolean(profile?.imageSet)));
});
