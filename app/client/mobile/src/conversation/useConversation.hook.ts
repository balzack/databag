import { useState, useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { DisplayContext } from '../context/DisplayContext'
import { Focus, FocusDetail, Topic, Profile, Card, AssetType, AssetSource, HostingMode, TransformType } from 'databag-client-sdk'
import { ContextType } from '../context/ContextType'
import { placeholder } from '../constants/Icons';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { createThumbnail } from "react-native-create-thumbnail";

const IMAGE_SCALE_SIZE = (50 * 1024);
const GIF_TYPE = 'image/gif';
const WEBP_TYPE = 'image/webp';
const LOAD_DEBOUNCE = 1000;

async function getImageThumb(path: string, type: string, size: number) {
console.log("GET THUMB: ", path, type, size);
  if (size < IMAGE_SCALE_SIZE) {
    const base = await RNFS.readFile(path, 'base64')
    return `data:image/jpeg;base64,${base}`;
  } else {
    const thumb = await ImageResizer.createResizedImage(path, 192, 192, "JPEG", 50, 0, null);
    const base = await RNFS.readFile(thumb.path, 'base64')
    return `data:image/jpeg;base64,${base}`;
  }
}

async function getVideoThumb(path: string, position?: number) {
  const timeStamp = position ? position * 1000 : 0;
  const shot = await createThumbnail({ url: path.slice(7), timeStamp })
  const thumb = await ImageResizer.createResizedImage('file://' + shot.path, 192, 192, "JPEG", 50, 0, null);
  const base = await RNFS.readFile(thumb.path, 'base64')
  return `data:image/jpeg;base64,${base}`;
}

export function useConversation() {
  const app = useContext(AppContext) as ContextType
  const display = useContext(DisplayContext) as ContextType
  const [state, setState] = useState({
    detail: undefined as FocusDetail | null | undefined,
    strings: display.state.strings,
    cardId: null as null | string,
    detailSet: false,
    focus: null as Focus | null,
    layout: null,
    topics: [] as Topic[],
    loaded: false,
    loadingMore: false,
    profile: null as Profile | null,
    cards: new Map<string, Card>(),
    host: false,
    sealed: false,
    access: false,
    subject: '',
    subjectNames: [],
    unknownContacts: 0,
    message: '',
    assets: [] as {type: string, path: string, mime?: string, position?: number, label?: string, size?: number}[],
    textColor: '#444444',
    textColorSet: false,
    textSize: 16,
    textSizeSet: false,
    progress: 0,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState((s) => ({ ...s, ...value }))
  }

  const updateAsset = (index: number, value: any) => {
    setState((s) => {
      s.assets[index] = { ...s.assets[index], ...value };
      return { ...s };
    });
  } 

  useEffect(() => {
    const { layout, strings } = display.state
    updateState({ layout, strings })
  }, [display.state])

  useEffect(() => {
    const host = state.cardId == null;
    const sealed = state.detail ? state.detail.sealed : false;
    const access = (state.detail != null);
    const subject = state.detail?.data?.subject ? state.detail.data.subject : null;
    const cards = Array.from(state.cards.values());
    const card = cards.find(entry => entry.cardId == state.cardId);
    const profileRemoved = state.detail?.members ? state.detail.members.filter(member => state.profile?.guid != member.guid) : [];
    const unhostedCards = profileRemoved.map(member => state.cards.get(member.guid));
    const contactCards = card ? [ card, ...unhostedCards ] : unhostedCards;
    const subjectCards = contactCards.filter(member => Boolean(member));
    const subjectNames = subjectCards.map(member => member?.name ? member.name : member?.handle);
    const unknownContacts = contactCards.length - subjectCards.length;
    updateState({ host, sealed, access, subject, subjectNames, unknownContacts, detailSet: state.detail !== undefined });
  }, [state.detail, state.cards, state.profile, state.cardId]);

  useEffect(() => {
    const focus = app.state.focus;
    const { contact, identity } = app.state.session || { };
    if (focus && contact && identity) {
      const setTopics = (topics: Topic[]) => {
        if (topics) {
          const filtered = topics.filter(topic => !topic.blocked);
          const sorted = filtered.sort((a, b) => {
            if (a.created < b.created) {
              return 1;
            } else if (a.created > b.created) {
              return -1;
            } else {
              return 0;
            }
          });
          updateState({ topics: sorted, loaded: true });
        }
      }
      const setCards = (cards: Card[]) => {
        const contacts = new Map<string, Card>();
        cards.forEach(card => {
          contacts.set(card.guid, card);
        });
        updateState({ cards: contacts });
      }
      const setProfile = (profile: Profile) => {
        updateState({ profile });
      }
      const setDetail = (focused: { cardId: string | null, channelId: string, detail: FocusDetail | null }) => {
        const detail = focused ? focused.detail : null;
        const cardId = focused.cardId;
        updateState({ detail, cardId });
      }
      updateState({ assets: [], message: '', topics: [], loaded: false });
      focus.addTopicListener(setTopics);
      focus.addDetailListener(setDetail);
      contact.addCardListener(setCards);
      identity.addProfileListener(setProfile);
      return () => {
        focus.removeTopicListener(setTopics);
        focus.removeDetailListener(setDetail);
        contact.removeCardListener(setCards);
        identity.removeProfileListener(setProfile);
      }
    }
  }, [app.state.focus]);

  const actions = {
    close: () => {
      app.actions.clearFocus();
    },
    setMessage: (message: string) => {
      updateState({ message });
    },
    setTextSize: (textSize: number) => {
      const textSizeSet = true;
      updateState({ textSize, textSizeSet });
    },
    setTextColor: (textColor: string) => {
      const textColorSet = true;
      updateState({ textColor, textColorSet });
    },
    setThumbPosition: (index: number, position: number) => {
      updateAsset(index, { position });
    },
    setLabel: (index: number, label: string) => {
      updateAsset(index, { label });
    },
    removeAsset: (index: number) => {
      state.assets.splice(index, 1);
      updateState({ assets: [ ...state.assets ] });
    },
    more: async () => {
      const focus = app.state.focus;
      if (focus) {
        if (!state.loadingMore) {
          updateState({ loadingMore: true });
          await focus.viewMoreTopics();
          setTimeout(() => {
            updateState({ loadingMore: false });
          }, LOAD_DEBOUNCE);
        }
      }
    },
    send: async () => {
      const focus = app.state.focus;
      const sealed = state.detail?.sealed ? true : false;
      if (focus) {
        const sources = [] as AssetSource[];
        const uploadAssets = state.assets.map(asset => {
          if (asset.type === 'image') {
            if (sealed) {
              sources.push({ type: AssetType.Image, source: asset.path, transforms: [
                { type: TransformType.Thumb, appId: `it${sources.length}`, thumb: async () => await getImageThumb(asset.path, asset.type, asset.size) },
                { type: TransformType.Copy, appId: `ic${sources.length}` }
              ]});
              return { encrypted: { type: 'image', thumb: `it${sources.length-1}`, parts: `ic${sources.length-1}` } };
            } else {
              sources.push({ type: AssetType.Image, source: asset.path, transforms: [
                { type: TransformType.Thumb, appId: `it${sources.length}` },
                { type: TransformType.Copy, appId: `ic${sources.length}` }
              ]});
              return { image: { thumb: `it${sources.length-1}`, full: `ic${sources.length-1}` } };
            }
          } else if (asset.type === 'video') {
            if (sealed) {
              sources.push({ type: AssetType.Video, source: asset.path, transforms: [
                { type: TransformType.Thumb, appId: `vt${sources.length}`, thumb: async () => await getVideoThumb(asset.path, asset.position) },
                { type: TransformType.Copy, appId: `vc${sources.length}` }
              ]});
              return { encrypted: { type: 'video', thumb: `vt${sources.length-1}`, parts: `vc${sources.length-1}` } };
            } else {
              sources.push({ type: AssetType.Video, source: asset.path, transforms: [
                { type: TransformType.Thumb, appId: `vt${sources.length}`, position: asset.position},
                { type: TransformType.HighQuality, appId: `vh${sources.length}` },
                { type: TransformType.LowQuality, appId: `vl${sources.length}` }
              ]});
              return { video: { thumb: `vt${sources.length-1}`, hd: `vh${sources.length-1}`, lq: `vl${sources.length-1}` } };
            }
          } else if (asset.type === 'audio') {
            if (sealed) {
              sources.push({ type: AssetType.Audio, source: asset.path, transforms: [
                { type: TransformType.Copy, appId: `ac${sources.length}` }
              ]});
              return { encrypted: { type: 'audio', label: asset.label, parts: `ac${sources.length-1}` } };
            } else {
              sources.push({ type: AssetType.Video, source: asset.path, transforms: [
                { type: TransformType.Copy, appId: `ac${sources.length}` }
              ]});
              return { audio: { label: asset.label, full: `ac${sources.length-1}` } };
            }
          } else {
            const { label, extension } = asset;
            if (sealed) {
              sources.push({ type: AssetType.Binary, source: asset.path, transforms: [
                { type: TransformType.Copy, appId: `bc${sources.length}` }
              ]});
              return { encrypted: { type: 'binary', label, extension, parts: `bc${sources.length-1}` } };
            } else {
              sources.push({ type: AssetType.Binary, source: asset.path, transforms: [
                { type: TransformType.Copy, appId: `bc${sources.length}` }
              ]});
              return { binary: { label, extension, data: `bc${sources.length-1}` } };
            }
          }
        });
        const subject = (uploaded: {assetId: string, appId: string}[]) => {
          const assets = uploadAssets.map(asset => {
            if(asset.encrypted) {
              const type = asset.encrypted.type;
              const label = asset.encrypted.label;
              const extension = asset.encrypted.extension;
              const thumb = uploaded.find(upload => upload.appId === asset.encrypted.thumb)?.assetId;
              const parts = uploaded.find(upload => upload.appId === asset.encrypted.parts)?.assetId;
              if (type === 'image' || type === 'video') {
                return { encrypted: { type, thumb, parts }};
              } else if (type === 'audio') {
                return { encrypted: { type, label, parts }};
              } else {
                return { encrypted: { type, label, extension, parts }};
              }
            } else if (asset.image) {
              const thumb = uploaded.find(upload => upload.appId === asset.image.thumb)?.assetId;
              const full = uploaded.find(upload => upload.appId === asset.image.full)?.assetId;
              return { image: { thumb, full } };
            } else if(asset.video) {
              const thumb = uploaded.find(upload => upload.appId === asset.video.thumb)?.assetId;
              const hd = uploaded.find(upload => upload.appId === asset.video.hd)?.assetId;
              const lq = uploaded.find(upload => upload.appId === asset.video.lq)?.assetId;
              return { video: { thumb, hd, lq } };
            } else if (asset.audio) {
              const label = asset.audio.label;
              const full = uploaded.find(upload => upload.appId === asset.audio.full)?.assetId;
              return { audio: { label, full } };
            } else {
              const data = uploaded.find(upload => upload.appId === asset.binary.data)?.assetId;
              const { label, extension } = asset.binary;
              return { binary: { label, extension, data } };
            }
          });
          return { text: state.message, textColor: state.textColorSet ? state.textColor : null, textSize: state.textSizeSet ? state.textSize : null, assets: assets.length > 0 ? assets : null };
        }
        const upload = (progress: number) => { updateState({ progress }) };
        await focus.addTopic(sealed, sealed ? 'sealedtopic' : 'superbasictopic', subject, sources, upload);
        updateState({ message: '', assets: [], progress: 0 });
      }
    }, 
    addImage: (path: string, mime: string, size: number) => {
      const type = 'image';
      updateState({ assets: [ ...state.assets, { type, path, mime, size } ]});
    },
    addVideo: (path: string, mime: string) => {
      const type = 'video';
      updateState({ assets: [ ...state.assets, { type, path, mime } ]});
    },
    addAudio: (path: string, name: string) => {
      const type = 'audio';
      updateState({ assets: [ ...state.assets, { type, path, label: name.split('.').shift() } ]});
    },
    addBinary: (path: string, name: string) => {
      const type = 'binary';
      updateState({ assets: [ ...state.assets, { type, path, label: name.split('.').shift(), extension: name.split('.').pop() } ]});
    },
  }

  return { state, actions }
}
