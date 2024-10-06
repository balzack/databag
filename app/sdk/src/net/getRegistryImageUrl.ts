export function getRegistryImageUrl(node: string, secure: boolean, guid: string): string {
  return `http${secure ? 's' : ''}://${node}/account/listing/${guid}/image`
}

