export function getListingImageUrl(server, guid) {
  let host = "";
  if (server) {
    host = `https://${server}`;
  }

  return `${host}/account/listing/${guid}/image`
}


