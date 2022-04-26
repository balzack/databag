export function getListingImageUrl(server, guid, revision) {
  return `https://${server}/account/listing/${guid}/image?revision=${revision}`
}


