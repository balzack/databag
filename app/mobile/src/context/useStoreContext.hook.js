import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

const DATABAG_DB = 'databag_v047.db';

export function useStoreContext() {
  const [state, setState] = useState({});
  const db = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const initSession = async (guid) => {
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS channel_${guid} (channel_id text, revision integer, detail_revision integer, topic_revision integer, blocked integer, sync_revision integer, detail text, summary text, offsync integer, read_revision integer, unique(channel_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS channel_topic_${guid} (channel_id text, topic_id text, revision integer, detail_revision integer, blocked integer, detail text, unique(channel_id, topic_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS card_${guid} (card_id text, revision integer, detail_revision integer, profile_revision integer, detail text, profile text, notified_view integer, notified_article integer, notified_profile integer, notified_channel integer, offsync integer, blocked integer, unique(card_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS card_channel_${guid} (card_id text, channel_id text, revision integer, detail_revision integer, topic_revision integer, sync_revision integer, detail text, summary text, offsync integer, blocked integer, read_revision integer, unique(card_id, channel_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS card_channel_topic_${guid} (card_id text, channel_id text, topic_id text, revision integer, detail_revision integer, blocked integer, detail text, unique(card_id, channel_id, topic_id))`);
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
    getFirstRun: async (guid) => {
      const firstRun = await getAppValue(db.current, "firstrun", { set: true });
      return firstRun.set;
    },
    setFirstRun: async () => {
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", ["firstrun", encodeObject({ set: false })]);
    },
    getCardRequestStatus: async (guid) => {
      const dataId = `${guid}_card_status`;
      return await getAppValue(db.current, dataId, {});
    },
    setCardRequestStatus: async (guid, status) => {
      const dataId = `${guid}_card_status`;
      await db.current.executeSql("INSERT OR REPLACE INTO app (key, value) values (?, ?);", [dataId, encodeObject(status)]);
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
    setCardItemBlocked: async (guid, cardId) => {
      await db.current.executeSql(`UPDATE card_${guid} set blocked=? where card_id=?`, [1, cardId]);
    },
    clearCardItemBlocked: async (guid, cardId) => {
      await db.current.executeSql(`UPDATE card_${guid} set blocked=? where card_id=?`, [0, cardId]);
    },
    setCardItemDetail: async (guid, cardId, revision, detail) => {
      await db.current.executeSql(`UPDATE card_${guid} set detail_revision=?, detail=? where card_id=?`, [revision, encodeObject(detail), cardId]);
    },
    setCardItemProfile: async (guid, cardId, revision, profile) => {
      await db.current.executeSql(`UPDATE card_${guid} set profile_revision=?, profile=? where card_id=?`, [revision, encodeObject(profile), cardId]);
    },
    getCardItemStatus: async (guid, cardId) => {
      const values = await getAppValues(db.current, `SELECT detail, profile, profile_revision, detail_revision, notified_view, notified_article, notified_profile, notified_channel, offsync FROM card_${guid} WHERE card_id=?`, [cardId]);
      if (!values.length) {
        return null;
      }
      return {
        detail: decodeObject(values[0].detail),
        profile: decodeObject(values[0].profile),
        profileRevision: values[0].profile_revision,
        detailRevision: values[0].detail_revision,
        notifiedView: values[0].notified_view,
        notifiedArticle: values[0].notified_article,
        notifiedProfile: values[0].notified_profile,
        notifiedChannel: values[0].notified_channel,
        offsync: values[0].offsync,
        blocked: values[0].blocked,
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
      const values = await getAppValues(db.current, `SELECT card_id, revision, detail_revision, profile_revision, detail, profile, offsync, blocked, notified_view, notified_profile, notified_article, notified_channel FROM card_${guid}`, []);
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
        offsync: card.offsync,
        blocked: card.blocked,
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
    setChannelItemReadRevision: async (guid, channelId, revision) => {
      await db.current.executeSql(`UPDATE channel_${guid} set read_revision=? where channel_id=?`, [revision, channelId]);
    },
    setChannelItemSyncRevision: async (guid, channelId, revision) => {
      await db.current.executeSql(`UPDATE channel_${guid} set sync_revision=? where channel_id=?`, [revision, channelId]);
    },
    setChannelItemBlocked: async (guid, channelId) => {
      await db.current.executeSql(`UPDATE channel_${guid} set blocked=? where channel_id=?`, [1, channelId]);
    },
    clearChannelItemBlocked: async (guid, channelId) => {
      await db.current.executeSql(`UPDATE channel_${guid} set blocked=? where channel_id=?`, [0, channelId]);
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
      const values = await getAppValues(db.current, `SELECT channel_id, read_revision, revision, sync_revision, blocked, detail_revision, topic_revision, detail, summary FROM channel_${guid}`, []);
      return values.map(channel => ({
        channelId: channel.channel_id,
        revision: channel.revision,
        readRevision: channel.read_revision,
        detailRevision: channel.detail_revision,
        topicRevision: channel.topic_revision,
        syncRevision: channel.sync_revision,
        blocked: channel.blocked,
        detail: decodeObject(channel.detail),
        summary: decodeObject(channel.summary),
      }));
    },


    getChannelTopicItems: async (guid, channelId) => {
      const values = await getAppValues(db.current, `SELECT topic_id, revision, blocked, detail_revision, detail FROM channel_topic_${guid} WHERE channel_id=?`, [channelId]);
      return values.map(topic => ({
        topicId: topic.topic_id,
        revision: topic.revision,
        blocked: topic.blocked,
        detailRevision: topic.detail_revision,
        detail: decodeObject(topic.detail),
      }));  
    },
    setChannelTopicItem: async (guid, channelId, topic) => { 
      const { id, revision, data } = topic;
      await db.current.executeSql(`INSERT OR REPLACE INTO channel_topic_${guid} (channel_id, topic_id, revision, detail_revision, detail) values (?, ?, ?, ?, ?);`, [channelId, id, revision, data.detailRevision, encodeObject(data.topicDetail)]);
    },
    clearChannelTopicItem: async (guid, channelId, topicId) => {
      await db.current.executeSql(`DELETE FROM channel_topic_${guid} WHERE channel_id=? and topic_id=?`, [channelId, topicId]);
    },
    clearChannelTopicItems: async (guid, channelId) => {
      await db.current.executeSql(`DELETE FROM channel_topic_${guid} WHERE channel_id=?`, [channelId]);
    },
    setChannelTopicBlocked: async (guid, channelId, topicId, blocked) => {
      await db.current.executeSql(`UPDATE channel_topic_${guid} set blocked=? WHERE channel_id=? and topic_id=?`, [blocked, channelId, topicId]);
    },
    getChannelTopicBlocked: async (guid) => {
      const values = await getAppValues(db.current, `SELECT channel_id, topic_id, detail FROM channel_topic_${guid} WHERE blocked=?`, [1]);
      return values.map(topic => ({
        channelId: topic.channel_id,
        topicId: topic.topic_id,
        detail: decodeObject(topic.detail),
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
    setCardChannelItemReadRevision: async (guid, cardId, channelId, revision) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set read_revision=? where card_id=? and channel_id=?`, [revision, cardId, channelId]);
    },
    setCardChannelItemSyncRevision: async (guid, cardId, channelId, revision) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set sync_revision=? where card_id=? and channel_id=?`, [revision, cardId, channelId]);
    },
    setCardChannelItemDetail: async (guid, cardId, channelId, revision, detail) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set detail_revision=?, detail=? where card_id=? and channel_id=?`, [revision, encodeObject(detail), cardId, channelId]);
    },
    setCardChannelItemSummary: async (guid, cardId, channelId, revision, summary) => {
      await db.current.executeSql(`UPDATE card_channel_${guid} set topic_revision=?, summary=? where card_id=? and channel_id=?`, [revision, encodeObject(summary), cardId, channelId]);
    },
    getCardChannelItemView: async (guid, cardId, channelId) => {
      const values = await getAppValues(db.current, `SELECT revision, detail_revision, topic_revision FROM card_channel_${guid} WHERE card_id=? and channel_id=?`, [cardId, channelId]);
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
      const values = await getAppValues(db.current, `SELECT card_id, channel_id, read_revision, sync_revision, revision, blocked, detail_revision, topic_revision, detail, summary FROM card_channel_${guid}`, []);
      return values.map(channel => ({
        cardId: channel.card_id,
        channelId: channel.channel_id,
        revision: channel.revision,
        readRevision: channel.read_revision,
        detailRevision: channel.detail_revision,
        topicRevision: channel.topic_revision,
        syncRevision: channel.sync_revision,
        detail: decodeObject(channel.detail),
        summary: decodeObject(channel.summary),
        blocked: channel.blocked,
      }));
    },
    clearCardChannelItems: async (guid, cardId) => {
      await db.current.executeSql(`DELETE FROM card_channel_${guid} WHERE card_id=?`, [cardId]);
    },

    getCardChannelTopicItems: async (guid, cardId, channelId) => {
      const values = await getAppValues(db.current, `SELECT topic_id, revision, blocked, detail_revision, detail FROM card_channel_topic_${guid} WHERE card_id=? AND channel_id=?`, [cardId, channelId]);
      return values.map(topic => ({
        topicId: topic.topic_id,
        revision: topic.revision,
        blocked: topic.blocked,
        detailRevision: topic.detail_revision,
        detail: decodeObject(topic.detail),
      }));  
    },    
    setCardChannelTopicItem: async (guid, cardId, channelId, topic) => {
      const { id, revision, data } = topic;
      await db.current.executeSql(`INSERT OR REPLACE INTO card_channel_topic_${guid} (card_id, channel_id, topic_id, revision, detail_revision, detail) values (?, ?, ?, ?, ?, ?);`, [cardId, channelId, id, revision, data.detailRevision, encodeObject(data.topicDetail)]);
    },
    clearCardChannelTopicItem: async (guid, cardId, channelId, topicId) => {
      await db.current.executeSql(`DELETE FROM card_channel_topic_${guid} WHERE card_id=? and channel_id=? and topic_id=?`, [cardId, channelId, topicId]);
    },
    clearCardChannelTopicItems: async (guid, cardId, channelId) => {
      await db.current.executeSql(`DELETE FROM card_channel_topic_${guid} WHERE card_id=? and channel_id=?`, [cardId, channelId]);
    },
    setCardChannelTopicBlocked: async (guid, cardId, channelId, topicId, blocked) => {
      await db.current.executeSql(`UPDATE card_channel_topic_${guid} set blocked=? WHERE card_id=? and channel_id=? and topic_id=?`, [blocked ? 1 : 0, cardId, channelId, topicId]);
    },
    getCardChannelTopicBlocked: async (guid) => {
      const values = await getAppValues(db.current, `SELECT card_id, channel_id, topic_id, detail FROM card_channel_topic_${guid} WHERE blocked=?`, [1]);
      return values.map(topic => ({
        cardId: topic.card_id,
        channelId: topic.channel_id,
        topicId: topic.topic_id,
        detail: decodeObject(topic.detail),
      }));  
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


