import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

const DATABAG_DB = 'databag_v019.db';

export function useStoreContext() {
  const [state, setState] = useState({});
  const db = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const initSession = async (guid) => {
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS channel_${guid} (channel_id text, revision integer, detail_revision integer, topic_revision integer, detail text, summary text, offsync integer, unique(channel_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS channel_topic_${guid} (channel_id text, topic_id text, revision integer, detail_revision integer, detail text, unique(channel_id, topic_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS card_${guid} (card_id text, revision integer, detail_revision integer, profile_revision integer, detail text, profile text, notified_view integer, notified_article integer, notified_profile integer, notified_channel integer, offsync integer, unique(card_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS card_channel_${guid} (card_id text, channel_id text, revision integer, detail_revision integer, topic_revision integer, detail text, summary text, offsync integer, unique(card_id, channel_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS card_channel_topic_${guid} (card_id text, channel_id text, topic_id text, revision integer, detail_revision integer, detail text, unique(card_id, channel_id, topic_id))`);
  }

  const actions = {
    init: async () => {
      SQLite.DEBUG(false);
      SQLite.enablePromise(true);
      db.current = await SQLite.openDatabase({ name: DATABAG_DB, location: "default" });
      await db.current.executeSql("CREATE TABLE IF NOT EXISTS app (key text, value text, unique(key));");
      await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values ('session', null);");
      return await getAppValue(db.current, 'session');
    },
    setSession: async (access) => {
      await initSession(access.guid);
      await db.current.executeSql("UPDATE app SET value=? WHERE key='session';", [encodeObject(access)]);
    },
    clearSession: async () => {
      await db.current.executeSql("UPDATE app set value=? WHERE key='session';", [null]);
    },

    getProfile: async (guid) => {
      const dataId = `${guid}_profile`;
      return await getAppValue(db.current, dataId, {});
    },
    setProfile: async (guid, profile) => {
      const dataId = `${guid}_profile`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(profile)]);
    },
    getProfileRevision: async (guid) => {
      const dataId = `${guid}_profileRevision`;
      return await getAppValue(db.current, dataId, null);
    },
    setProfileRevision: async (guid, revision) => {
      const dataId = `${guid}_profileRevision`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(revision)]);
    },

    getAccountStatus: async (guid) => {
      const dataId = `${guid}_status`;  
      return await getAppValue(db.current, dataId, {});
    },
    setAccountStatus: async (guid, status) => {
      const dataId = `${guid}_status`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(status)]);
    },
    getAccountRevision: async (guid) => {
      const dataId = `${guid}_accountRevision`;
      return await getAppValue(db.current, dataId, null);
    },
    setAccountRevision: async (guid, revision) => {
      const dataId = `${guid}_accountRevision`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(revision)]);
    }, 

    getCardRevision: async (guid) => {
      const dataId = `${guid}_cardRevision`;
      return await getAppValue(db.current, dataId, null);
    },
    setCardRevision: async (guid, revision) => {
      const dataId = `${guid}_cardRevision`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(revision)]);
    },
    setCardItem: async (guid, card) => {
      const { id, revision, data } = card;
      await db.current.executeSql(`INSERT OR REPLACE INTO card_${guid} (card_id, revision, detail_revision, profile_revision, detail, profile, notified_view, notified_profile, notified_article, notified_channel) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [id, revision, data.detailRevision, data.profileRevision, encodeObject(data.cardDetail), encodeObject(data.cardProfile), null, null, null, null]);
    },
    clearCardItem: async (guid, cardId) => {
      await db.current.executeSql(`DELETE FROM card_${guid} WHERE card_id=?`, [cardId]);
    },
    setCardItemRevision: async (guid, cardId, revision) => {
      await db.current.executeSql(`UPDATE card_${guid} set revision=? where card_id=?`, [revision, cardId]);
    },
    setCardItemNotifiedView: async (guid, cardId, notified) => {
      await db.current.executeSql(`UPDATE card_${guid} set notified_view=? where card_id=?`, [notified, cardId]);
    },
    setCardItemNotifiedArticle: async (guid, cardId, notified) => {
      await db.current.executeSql(`UPDATE card_${guid} set notified_article=? where card_id=?`, [notified, cardId]);
    },
    setCardItemNotifiedProfile: async (guid, cardId, notified) => {
      await db.current.executeSql(`UPDATE card_${guid} set notified_profile=? where card_id=?`, [notified, cardId]);
    },
    setCardItemNotifiedChannel: async (guid, cardId, notified) => {
      await db.current.executeSql(`UPDATE card_${guid} set notified_channel=? where card_id=?`, [notified, cardId]);
    },
    setCardItemOffsync: async (guid, cardId) => {
      await db.current.executeSql(`UPDATE card_${guid} set offsync=? where card_id=?`, [1, cardId]);
    },
    clearCardItemOffsync: async (guid, cardId) => {
      await db.current.executeSql(`UPDATE card_${guid} set offsync=? where card_id=?`, [0, cardId]);
    },
    setCardItemDetail: async (guid, cardId, revision, detail) => {
      await db.current.executeSql(`UPDATE card_${guid} set detail_revision=?, detail=? where card_id=?`, [revision, encodeObject(detail), cardId]);
    },
    setCardItemProfile: async (guid, cardId, revision, profile) => {
      await db.current.executeSql(`UPDATE card_${guid} set profile_revision=?, profile=? where card_id=?`, [revision, encodeObject(profile), cardId]);
    },
    getCardItemStatus: async (guid, cardId) => {
      const values = await getAppValues(db.current, `SELECT detail, profile, notified_view, notified_article, notified_profile, notified_channel, offsync FROM card_${guid} WHERE card_id=?`, [cardId]);
      if (!values.length) {
        return null;
      }
      return {
        detail: decodeObject(values[0].detail),
        profile: decodeObject(values[0].profile),
        offsync: values[0].offsync,
        notifiedView: values[0].notified_view,
        notifiedArticle: values[0].notified_article,
        notifiedProfile: values[0].notified_profile,
        notifiedChannel: values[0].notified_cahnnel,
      };
    },
    getCardItemView: async (guid, cardId) => {
      const values = await getAppValues(db.current, `SELECT revision, detail_revision, profile_revision FROM card_${guid} WHERE card_id=?`, [cardId]);
      if (!values.length) {
        return null;
      }
      return {
        revision: values[0].revision,
        detailRevision: values[0].detail_revision,
        profileRevision: values[0].profile_revision,
      };
    },
    getCardItems: async (guid) => {
      const values = await getAppValues(db.current, `SELECT card_id, revision, detail_revision, profile_revision, detail, profile, notified_view, notified_profile, notified_article, notified_channel FROM card_${guid}`, []);
      return values.map(card => ({
        cardId: card.card_id,
        revision: card.revision,
        detailRevision: card.detail_revision,
        profileRevision: card.profile_revision,
        detail: decodeObject(card.detail),
        profile: decodeObject(card.profile),
        notifiedView: card.notified_view,
        notifiedProfile: card.notified_profile,
        notifiedArticle: card.notified_article,
        notifiedChannel: card.notified_channel,
      }));
    },

    getChannelRevision: async (guid) => {
      const dataId = `${guid}_channelRevision`;
      return await getAppValue(db.current, dataId, null);
    },
    setChannelRevision: async (guid, revision) => {
      const dataId = `${guid}_channelRevision`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(revision)]);
    }, 
    setChannelItem: async (guid, channel) => {
      const { id, revision, data } = channel;
      await db.current.executeSql(`INSERT OR REPLACE INTO channel_${guid} (channel_id, revision, detail_revision, topic_revision, detail, summary) values (?, ?, ?, ?, ?, ?);`, [id, revision, data.detailRevision, data.topicRevision, encodeObject(data.channelDetail), encodeObject(data.channelSummary)]);
    },
    clearChannelItem: async (guid, channelId) => {
      await db.current.executeSql(`DELETE FROM channel_${guid} WHERE channel_id=?`, [channelId]);
    },
    setChannelItemRevision: async (guid, channelId, revision) => {
      await db.current.executeSql(`UPDATE channel_${guid} set revision=? where channel_id=?`, [revision, channelId]);
    },
    setChannelItemDetail: async (guid, channelId, revision, detail) => {
      await db.current.executeSql(`UPDATE channel_${guid} set detail_revision=?, detail=? where channel_id=?`, [revision, encodeObject(detail), channelId]);
    },
    setChannelItemSummary: async (guid, channelId, revision, summary) => {
      await db.current.executeSql(`UPDATE channel_${guid} set topic_revision=?, summary=? where channel_id=?`, [revision, encodeObject(summary), channelId]);
    },
    getChannelItemView: async (guid, channelId) => {
      const values = await getAppValues(db.current, `SELECT revision, detail_revision, topic_revision FROM channel_${guid} WHERE channel_id=?`, [channelId]);
      if (!values.length) {
        return null;
      }
      return {
        revision: values[0].revision,
        detailRevision: values[0].detail_revision,
        topicRevision: values[0].topic_revision,
      };
    },
    getChannelItems: async (guid) => {
      const values = await getAppValues(db.current, `SELECT channel_id, revision, detail_revision, topic_revision, detail, summary FROM channel_${guid}`, []);
      return values.map(channel => ({
        channelId: channel.channel_id,
        revision: channel.revision,
        detailRevision: channel.detail_revision,
        topicRevision: channel.topic_revision,
        detail: decodeObject(channel.detail),
        summary: decodeObject(channel.summary),
      }));
    },

    setCardChannelItem: async (guid, cardId, channel) => {
      const { id, revision, data } = channel;
      await db.current.executeSql(`INSERT OR REPLACE INTO card_channel_${guid} (card_id, channel_id, revision, detail_revision, topic_revision, detail, summary) values (?, ?, ?, ?, ?, ?, ?);`, [cardId, id, revision, data.detailRevision, data.topicRevision, encodeObject(data.channelDetail), encodeObject(data.channelSummary)]);
    },
    clearCardChannelItem: async (guid, cardId, channelId) => {
      await db.current.executeSql(`DELETE FROM card_channel_${guid} WHERE card_id=? and channel_id=?`, [cardId, channelId]);
    },
    setCardChannelItemRevision: async (guid, cardId, channelId, revision) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set revision=? where card_id=? and channel_id=?`, [revision, cardId, channelId]);
    },
    setCardChannelItemDetail: async (guid, cardId, channelId, revision, detail) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set detail_revision=?, detail=? where card_id=? and channel_id=?`, [revision, encodeObject(detail), cardId, channelId]);
    },
    setCardChannelItemSummary: async (guid, cardId, channelId, revision, summary) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set topic_revision=?, summary=? where card_id=? and channel_id=?`, [revision, encodeObject(summary), cardId, channelId]);
    },
    getCardChannelItemView: async (guid, cardId, channelId) => {
      const values = await getAppValues(db.current, `SELECT revision, detail_revision, topic_revision FROM card_channel_${guid} WHERE channel_id=?`, [cardId, channelId]);
      if (!values.length) {
        return null;
      }
      return {
        revision: values[0].revision,
        detailRevision: values[0].detail_revision,
        topicRevision: values[0].topic_revision,
      };
    },
    getCardChannelItems: async (guid) => {
      const values = await getAppValues(db.current, `SELECT card_id, channel_id, revision, detail_revision, topic_revision, detail, summary FROM card_channel_${guid}`, []);
      return values.map(channel => ({
        cardId: channel.card_id,
        channelId: channel.channel_id,
        revision: channel.revision,
        detailRevision: channel.detail_revision,
        topicRevision: channel.topic_revision,
        detail: decodeObject(channel.detail),
        summary: decodeObject(channel.summary),
      }));
    },
    clearCardChannelItems: async (guid, cardId) => {
      await db.current.executeSql(`DELETE FROM card_channel_${guid} WHERE card_id=?`, [cardId]);
    },

  }
  return { state, actions }
}

function decodeObject(s: string) {
  if(s == null) {
    return null;
  }
  return JSON.parse(s);
}

function encodeObject(o: any) {
  if(o == null) {
    return null;
  }
  return JSON.stringify(o);
}

function hasResult(res) {
  if(res === undefined || res[0] === undefined || res[0].rows === undefined || res[0].rows.length == 0) {
    return false;
  }
  return true;
}

function executeSql(sql: SQLite.SQLiteDatabase, query, params, uset) {
  return new Promise((resolve, reject) => {
    sql.executeSql(query, params, (tx, results) => {
      resolve(results);
    });
  });
}

async function getAppValue(sql: SQLite.SQLiteDatabase, id: string, unset) {
  const res = await sql.executeSql(`SELECT * FROM app WHERE key='${id}';`);
  if (hasResult(res)) {
    return decodeObject(res[0].rows.item(0).value);
  }
  return unset;
}

async function getAppValues(sql: SQLite.SQLiteDatabase, query: string, params) {
  const res = await sql.executeSql(query, params);
  if (!hasResult(res)) {
    return [];
  }
  const values = [];
  for (let i = 0; i < res[0].rows.length; i++) {
    values.push(res[0].rows.item(i));
  }
  return values;
}



