import { useRef, useState, useEffect, useContext } from 'react';
import { Linking, Alert } from 'react-native';
import { ConversationContext } from '../../../context/ConversationContext';
import { CardContext } from '../../../context/CardContext';
import { ProfileContext } from '../../../context/ProfileContext';
import { DisplayContext } from '../../../context/DisplayContext';
import { AccountContext } from '../../../context/AccountContext';
import moment from 'moment';
import { useWindowDimensions, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { getCardByGuid } from '../../../context/cardUtil';
import { decryptBlock, decryptTopicSubject } from '../../../context/sealUtil';
import { sanitizeUrl } from '@braintree/sanitize-url';
import Share from 'react-native-share';
import RNFetchBlob from "rn-fetch-blob";
import RNFS from 'react-native-fs';
import { checkResponse, fetchWithTimeout } from '../../../api/fetchUtil';
import { getLanguageStrings } from '../../../constants/Strings';

export function useTopicItem(item, hosting, remove, contentKey) {

  const [state, setState] = useState({
    strings: getLanguageStrings(), 
    name: null,
    nameSet: null,
    known: null,
    logo: null,
    timestamp: null,
    message: null,
    clickable: null,
    carousel: false,
    carouselIndex: 0,
    width: null,
    height: null,
    activeId: null,
    fontSize: 14,
    fontColor: Colors.text,
    shareable: false,
    editable: false,
    deletable: false,
    flagable: false,
    assets: [],
    sharing: false,
    monthLast: false,
    timeFull: false,
  });

  const conversation = useContext(ConversationContext);
  const profile = useContext(ProfileContext);
  const display = useContext(DisplayContext);
  const card = useContext(CardContext);
  const account = useContext(AccountContext);
  const dimensions = useWindowDimensions();

  const cancel = useRef(false);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }));
  }

  useEffect(() => {
    updateState({ width: dimensions.width, height: dimensions.height });
  }, [dimensions]);

  const setAssets = (parsed) => {
    const assets = [];
    if (parsed?.length) {
      for (let i = 0; i < parsed.length; i++) {
        const asset = parsed[i];
        if (asset.encrypted) {
          const encrypted = true;
          const { type, thumb, label, extension, parts } = asset.encrypted;
          assets.push({ type, thumb, label, extension, encrypted, decrypted: null, parts });
        }
        else {
          const encrypted = false
          if (asset.image) {
            const type = 'image';
            const thumb = conversation.actions.getTopicAssetUrl(item.topicId, asset.image.thumb);
            const full = conversation.actions.getTopicAssetUrl(item.topicId, asset.image.full);
            assets.push({ type, thumb, encrypted, full });
          }
          else if (asset.video) {
            const type = 'video';
            const thumb = conversation.actions.getTopicAssetUrl(item.topicId, asset.video.thumb);
            const lq = conversation.actions.getTopicAssetUrl(item.topicId, asset.video.lq);
            const hd = conversation.actions.getTopicAssetUrl(item.topicId, asset.video.hd);
            assets.push({ type, thumb, encrypted, lq, hd });
          }
          else if (asset.audio) {
            const type = 'audio';
            const label = asset.audio.label;
            const full = conversation.actions.getTopicAssetUrl(item.topicId, asset.audio.full);
            assets.push({ type, label, encrypted, full });
          }
          else if (asset.binary) {
            const type = 'binary';  
            const { label, extension } = asset.binary;
            const data = conversation.actions.getTopicAssetUrl(item.topicId, asset.binary.data);
            assets.push({ type, label, extension, data });
          }
        }
      };
    }
    return assets;
  }

  useEffect(() => {

    const { topicId, revision, detail, unsealedDetail } = item;
    const { guid, created, dataType, data, status, transform } = detail || {};

    let name, nameSet, known, logo;
    const { identity, imageUrl, monthLast, timeFull } = profile.state || {};
    if (guid === identity.guid) {
      known = true;
      if (identity.name) {
        name = identity.name;
        nameSet = true;
      }
      else {
        name = identity.node ? `${identity.handle}/${identity.node}` : identity.handle;
        nameSet = false;
      }
      const img = imageUrl;
      if (img) {
        logo = img;
      }
      else {
        logo = 'avatar';
      }
    }
    else {
      const contact = getCardByGuid(card.state.cards, guid)?.card;
      if (contact) {
        logo = contact.profile?.imageSet ? card.actions.getCardImageUrl(contact.cardId) : null;

        known = true;
        if (contact.profile.name) {
          name = contact.profile.name;
          nameSet = true;
        }
        else {
          const { node, handle } = contact.profile || {};
          name = node ? `${handle}/${node}` : handle;
          nameSet = false;
        }
      }
      else {
        name = "unknown";
        nameSet = false;
        known = false;
        logo = null;
      }
    }

    let parsed, sealed, message, clickable, assets, fontSize, fontColor;
    if (dataType === 'superbasictopic') {
      try {
        sealed = false;
        parsed = JSON.parse(data);
        message = parsed?.text;
        clickable = clickableText(parsed.text);
        assets = setAssets(parsed.assets);
        if (parsed.textSize === 'small') {
          fontSize = 10;
        }
        else if (parsed.textSize === 'large') {
          fontSize = 20;
        }
        else {
          fontSize = 14;
        }
        if (parsed.textColor) {
          fontColor = parsed.textColor;
        }
        else {
          fontColor = Colors.text;
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    else if (dataType === 'sealedtopic') {
      let unsealed = unsealedDetail;
      if (!unsealed && contentKey) {
        try {
          unsealed = decryptTopicSubject(detail?.data, contentKey);
          (async () => {
            try {
              await conversation.actions.unsealTopic(topicId, revision, unsealed);
            }
            catch(err) {
              console.log(err);
            }
          })();
        }
        catch(err) {
          console.log(err);
        }
      }
      if (unsealed) {
        sealed = false;
        parsed = unsealed.message;
        assets = setAssets(parsed.assets);
        message = parsed?.text;
        clickable = clickableText(parsed?.text);
        if (parsed?.textSize === 'small') {
          fontSize = 10;
        }
        else if (parsed?.textSize === 'large') {
          fontSize = 20;
        }
        else {
          fontSize = 14;
        }
        if (parsed?.textColor) {
          fontColor = parsed?.textColor;
        }
        else {
          fontColor = Colors.text;
        }
      }
      else {
        sealed = true;
      }
    }

    let timestamp;
    const date = new Date(created * 1000);
    const now = new Date();
    const offset = now.getTime() - date.getTime();
    if(offset < 86400000) {
      if (timeFull) { 
        timestamp = moment(date).format('H:mm');
      }
      else {
        timestamp = moment(date).format('h:mma');
      }
    }
    else if (offset < 31449600000) {
      if (monthLast) {
        timestamp = moment(date).format('DD/M');
      }
      else {
        timestamp = moment(date).format('M/DD');
      }
    }
    else {
      if (monthLast) {
        timestamp = moment(date).format('DD/M/YYYY');
      }
      else {
        timestamp = moment(date).format('M/DD/YYYY');
      }
    }

    const shareable = parsed;
    const editable = guid === identity?.guid && parsed;
    const flagable = guid !== identity?.guid;
    const deletable = guid === identity?.guid || hosting;

    updateState({ logo, name, nameSet, known, sealed, message, clickable, fontSize, fontColor, timestamp, transform, status, assets, deletable, shareable, editable, flagable, editData: parsed, editMessage: message, editType: dataType });
  }, [conversation.state, card.state, account.state, profile.state, item, contentKey]);

  const unsealTopic = async (topicId, revision, topicDetail) => {
    try {
      const channelDetail = conversation.state.channel?.detail;
      const seals = getChannelSeals(channelDetail?.data);
      const sealKey = account.state.sealKey;
      if (isUnsealed(seals, sealKey)) {
        const contentKey = await getContentKey(seals, sealKey);
      }
    }
    catch(err) {
      console.log(err);
    }
  };

  const clickableText = (text) => {
      const urlPattern = new RegExp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');
      const hostPattern = new RegExp('^https?:\\/\\/', 'i');

      let clickable = [];
      let group = '';
      const words = text == null ? [''] : text.split(' ');
      words.forEach((word, index) => {
        if (!!urlPattern.test(word)) {
          clickable.push(<Text key={index}>{ group }</Text>);
          group = '';
          const url = !!hostPattern.test(word) ? word : `https://${word}`;
          clickable.push(<Text key={'link-' + index} onPress={() => Linking.openURL(sanitizeUrl(url))} style={{ fontStyle: 'italic' }}>{ sanitizeUrl(word) + ' ' }</Text>);
        }
        else {
          group += `${word} `;
        }
      })
      clickable.push(<Text key={words.length}>{ group }</Text>);
      return <Text>{ clickable }</Text>;
  };

  const getExtension = async (path, type) => {
    if (type === 'video') {
        return 'mp4';
      }
  }

  const actions = {
    showCarousel: async (index) => {
      const assets = state.assets.map((asset) => ({ ...asset, error: false, decrypted: null }));
      updateState({ assets, carousel: true, carouselIndex: index });

      try {
        cancel.current = false;
        const assets = state.assets;
        for (let i = 0; i < assets.length; i++) {
          const cur = (i + index) % assets.length
          const asset = assets[cur];
          if (asset.encrypted) {
            const ext = asset.type === 'video' ? '.mp4' : asset.type === 'audio' ? '.mp3' : '';
            const path = RNFS.DocumentDirectoryPath + `/${i}.asset${ext}`;
            const exists = await RNFS.exists(path);
            if (exists) {
              RNFS.unlink(path);
            }
            assets[cur] = { ...asset, block: 0, total: asset.parts.length };
            updateState({ assets: [ ...assets ]});
            for (let j = 0; j < asset.parts.length; j++) {
              const part = asset.parts[j];
              const url = conversation.actions.getTopicAssetUrl(item.topicId, part.partId);
              const response = await fetchWithTimeout(url, { method: 'GET' });
              const block = await response.text();
              const decrypted = decryptBlock(block, part.blockIv, contentKey);
              if (cancel.current) {
                throw new Error("unseal assets cancelled");
              }
              await RNFS.appendFile(path, decrypted, 'base64');

              if (cancel.current) {
                throw new Error("unseal assets cancelled");
              }
              assets[cur] = { ...asset, block: j+1, total: asset.parts.length };
              updateState({ assets: [ ...assets ]});
            };

            if (asset.type === 'image') {
              const prefix = await RNFS.read(path, 64, 0, "base64");
              const ext = prefix.startsWith('R0lGODlh') ? '.gif' : '.jpg';
              const exists = await RNFS.exists(path + ext);
              if (exists) {
                RNFS.unlink(path + ext);
              }
              await RNFS.moveFile(path, path + ext);
              asset.decrypted = path + ext;
            }
            else {
              asset.decrypted = path;
            }
            
            assets[cur] = { ...asset };
            updateState({ assets: [ ...assets ]});
          };
        }
      }
      catch (err) {
        console.log(err);
        const assets = state.assets.map((asset) => ({ ...asset, error: true }));
        updateState({ assets: [ ...assets ]});
      }
    },
    hideCarousel: () => {
      const assets = state.assets.map((asset) => ({ ...asset, error: false, decrypted: null }));
      updateState({ carousel: false, assets });
      cancel.current = true;
    },
    setActive: (activeId) => {
      updateState({ activeId });
    },
    getTopicAssetUrl: (topicId, assetId) => {
      return conversation.actions.getTopicAssetUrl(topicId, assetId);
    },
    shareMessage: async () => {
      if (!state.sharing) {
        updateState({ sharing: true });
        const files = []
        const unlink = []
        const fs = RNFetchBlob.fs;
        try {
          const data = JSON.parse(item.detail.data)
          const assets = data.assets || []

          for (let i = 0; i < assets.length; i++) {

            let asset
            if (assets[i].image) {
              asset = assets[i].image.full;
            }
            else if (assets[i].video?.hd) {
              asset = assets[i].video.hd;
            }
            else if (assets[i].video?.lq) {
              asset = assets[i].video.lq;
            }
            else if (assets[i].audio?.full) {
              asset = assets[i].audio.full;
            }

            if (asset) {
              const url = actions.getTopicAssetUrl(item.topicId, asset);
              const blob = await RNFetchBlob.config({ fileCache: true }).fetch("GET", url);
              const type = blob.respInfo.headers["Content-Type"] || blob.respInfo.headers["content-type"]

              const src = blob.path();
              const dir = src.split('/').slice(0,-1).join('/')
              const dst = dir + '/' + asset + '.' + getExtension(type);

              try {
                await fs.unlink(dst);
              }
              catch(err) {
                console.log(err);
              }
              await RNFetchBlob.fs.mv(src, dst);
              files.push(`file://${dst}`);
              unlink.push(dst);
            }
          }

          await Share.open({ urls: files, message: files.length > 0 ? null : data.text, title: 'Databag', subject: 'Shared from Databag' })
          while (unlink.length > 0) {
            const file = unlink.shift();
            await fs.unlink(file);
          }
        }
        catch(err) {
          console.log(err);
          for (let i = 0; i < fs.unlink.length; i++) {
            try {
              await fs.unlink(unlink[i])
            }
            catch(err) {
              console.log(err);
            }
          }
        }
        updateState({ sharing: false });
      }
    },
    promptBlock: (block) => {
      display.actions.showPrompt({
        title: state.strings.blockMessage,
        centerButtons: true,
        ok: { label: state.strings.confirmBlock, action: async () => await block(item.topicId), failed: () => {
          Alert.alert(
            state.strings.error,
            state.strings.tryAgain,
          );
        }},
        cancel: { label: state.strings.cancel },
      }); 
    },
    promptReport: (report) => {
      display.actions.showPrompt({
        title: state.strings.reportMessage,
        centerButtons: true,
        ok: { label: state.strings.confirmReport, action: async () => await report(item.topicId), failed: () => {
          Alert.alert(
            state.strings.error,
            state.strings.tryAgain,
          );
        }},
        cancel: { label: state.strings.cancel },
      }); 
    },
    promptRemove: (remove) => {
      display.actions.showPrompt({
        title: state.strings.deleteMessage,
        centerButtons: true,
        ok: { label: state.strings.confirmDelete, action: async () => await remove(item.topicId), failed: () => {
          Alert.alert(
            state.strings.error,
            state.strings.tryAgain,
          );
        }},
        cancel: { label: state.strings.cancel },
      }); 
    },
  };

  return { state, actions };
}

function getExtension(mime) {
  if (mime === 'image/gif') {
    return 'gif';
  }
  if (mime === 'image/jpeg') {
    return 'jpg';
  }
  if (mime === 'text/plain') {
    return 'txt';
  }
  if (mime === 'image/png') {
    return 'png';
  }
  if (mime === 'image/bmp') {
    return 'bmp';
  }
  if (mime === 'image/svg+xml') {
    return 'svg';
  }
  if (mime === 'application/msword') {
    return 'doc';
  }
  if (mime === 'application/pdf') {
    return 'pdf';
  }
  if (mime === 'application/vnd.ms-excel') {
    return 'xls';
  }
  if (mime === 'application/vnd.ms-powerpoint') {
    return 'ppt';
  }
  if (mime === 'application/zip') {
    return 'zip';
  }
  if (mime === 'audio/mpeg') {
    return 'mp3';
  }
  if (mime === 'audio/ogg') {
    return 'ogg';
  }
  if (mime === 'video/mpeg') {
    return 'mpg';
  }
  if (mime === 'video/quicktime') {
    return 'mov';
  }
  if (mime === 'video/x-ms-wmv') {
    return 'wmv';
  }
  if (mime === 'video/x-msvideo') {
    return 'avi';
  }
  if (mime === 'video/mp4') {
    return 'mp4';
  }
  return 'bin'
}
