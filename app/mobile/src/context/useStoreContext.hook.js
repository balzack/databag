import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

const DATABAG_DB = 'databag_v011.db';

export function useStoreContext() {
  const [state, setState] = useState({});
  const db = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const initSession = async (guid) => {
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS channel_${guid} (channel_id text, revision integer, detail_revision integer, topic_revision integer, detail text, summary text, unique(channel_id))`);
    await db.current.executeSql(`CREATE TABLE IF NOT EXISTS topic_${guid} (channel_id text, topic_id text, revision integer, detail_revision integer, detail text, unique(channel_id, topic_id))`);
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
console.log("HERE", channelId);
      const values = await getAppValues(db.current, `SELECT revision, detail_revision, topic_revision FROM channel_${guid} WHERE channel_id=?`, [channelId]);
      if (!values.length) {
        return {};
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



