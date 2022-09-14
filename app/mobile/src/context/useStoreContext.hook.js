import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

const DATABAG_DB = 'databag_v005.db';

export function useStoreContext() {
  const [state, setState] = useState({});
  const db = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
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
      await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values (?, null);", [dataId]);
      await db.current.executeSql("UPDATE app SET value=? WHERE key=?;", [encodeObject(profile), dataId]);
    },
    getProfileRevision: async (guid) => {
      const dataId = `${guid}_profileRevision`;
      return await getAppValue(db.current, dataId, 0);
    },
    setProfileRevision: async (guid, revision) => {
      const dataId = `${guid}_profileRevision`;
      await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values (?, 0);", [dataId]);
      await db.current.executeSql("UPDATE app SET value=? WHERE key=?;", [encodeObject(revision), dataId]);
    },

    getAccountStatus: async (guid) => {
      const dataId = `${guid}_status`;  
      return await getAppValue(db.current, dataId, {});
    },
    setAccountStatus: async (guid, status) => {
      const dataId = `${guid}_status`;
      await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values (?, null);", [dataId]);
      await db.current.executeSql("UPDATE app SET value=? WHERE key=?;", [encodeObject(status), dataId]);
    },
    getAccountRevision: async (guid) => {
      const dataId = `${guid}_accountRevision`;
      return await getAppValue(db.current, dataId, 0);
    },
    setAccountRevision: async (guid, revision) => {
      const dataId = `${guid}_accountRevision`;
      await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values (?, 0);", [dataId]);
      await db.current.executeSql("UPDATE app SET value=? WHERE key=?;", [encodeObject(revision), dataId]);
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


