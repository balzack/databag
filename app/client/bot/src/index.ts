import { DatabagSDK } from 'databag-client-sdk';

const run = async () => {
  const sdk = new DatabagSDK(null);
  const bot = await sdk.automate();
  console.log(bot);
}

run();
