import type { AssetItem } from './items';
import { HostingMode } from './types';

export function getLegacyData(data: any): { data: any, assets: AssetItem[] } {
  if (data == null) {
    return { data: null, assets: [] };
  }

  const { text, textColor, textSize, assets } = data;
  let index: number = 0;
  const assetItems = new Set<AssetItem>();
  const dataAssets = !assets ? [] : assets.map(({ encrypted, image, audio, video, binary }: BasicAsset) => {
    if (encrypted) {
      const { type, thumb, label, extension, parts } = encrypted;
      if (thumb) {
        const asset = {
          assetId: `${index}`,
          hosting: HostingMode.Inline,
          inline: thumb,
        }
        assetItems.add(asset);
        index += 1;
      }
      const asset = {
        assetId: `${index}`,
        hosting: HostingMode.Split,
        split: parts,
      }
      assetItems.add(asset);
      index += 1;

      if (thumb) {
        return { encrypted: { type, thumb: `${index-2}`, parts: `${index-1}`, label, extension } }
      } else {
        return { encrypted: { type, parts: `${index-1}`, label, extension } }
      }
    } else {
      if (image) {
        const { thumb, full } = image;
        const thumbAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: thumb,
        }
        assetItems.add(thumbAsset);
        index += 1;
        const fullAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: full,
        }
        assetItems.add(fullAsset);
        index += 1;
        return { image: { thumb: `${index-2}`, full: `${index-1}` }};
      } else if (video) {
        const { thumb, hd, lq } = video;
        const thumbAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: thumb,
        }
        assetItems.add(thumbAsset);
        index += 1;
        const hdAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: hd,
        }
        assetItems.add(hdAsset);
        index += 1;
        const lqAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: lq,
        }
        assetItems.add(lqAsset);
        index += 1;
        return { video: { thumb: `${index-3}`, hd: `${index-2}`, lq: `${index-1}` }};
      } else if (audio) {
        const { label, full } = audio;
        const fullAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: full,
        }
        assetItems.add(fullAsset);
        index += 1;
        return { audio: { label, full: `${index-1}` }};
      } else {
        const { label, extension, data } = binary;
        const dataAsset = {
          assetId: `${index}`,
          hosting: HostingMode.Basic,
          basic: data,
        }
        assetItems.add(dataAsset);
        index += 1;
        return { audio: { label, extension, data: `${index-1}` }};
      }
    }
  })
  return { data: { text, textColor, textSize, assets: dataAssets }, assets: Array.from(assetItems.values()) }; 
}

