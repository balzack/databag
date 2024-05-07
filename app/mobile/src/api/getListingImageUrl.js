export function getListingImageUrl(server, guid) {
  const insecure = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|:\d+$|$)){4}$/.test(server);
  const protocol = insecure ? 'http' : 'https';

  let host = "";
  if (server) {
    host = `${protocol}://${server}`;
  }

  return `${host}/account/listing/${guid}/image`
}


