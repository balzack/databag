import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

const DATABAG_DB = 'databag_v001.db';

export function useStoreContext() {
  const [state, setState] = useState({
    init: false,
    session: null,
    revision: null,
  });
  
  const db = useRef(null);
  const loaded = useRef(false);
  const syncing = useRef(false);
  const setRevision = useRef(null);
  const appRevision = useRef({});
  const appSession = useRef(null);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  const setAppRevision = async () => {
    if (syncing.current) {
      return;
    }
    if (!setRevision.current) {
      return;
    }
    if (!loaded.current) {
      return;
    }
    if (!appSession.current) {
      return;
    }

    // sync revisions
    syncing.current = true;
    const rev = setRevision.current;
    
    try {
      const id = `${appSession.current.guid}_revision`;
      await db.current.executeSql(`UPDATE app SET value=? WHERE key='${id}';`, [encodeObject(rev)]);
      appRevision.current = setRevision.current;
    }
    catch (err) {
      console.log(err);
    }

    syncing.current = false;
  };

  const initialize = async () => {
    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
    db.current = await SQLite.openDatabase({ name: DATABAG_DB, location: "default" });
    await db.current.executeSql("CREATE TABLE IF NOT EXISTS app (key text, value text, unique(key));");
    await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values ('session', null);");
    await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values ('revision', null);");

    appSession.current = await getAppValue(db.current, 'session');
    if (appSession.current) {
      const revisionId = `${appSession.current.guid}_revision`;
      appRevision.currrent = await getAppValue(db.current, revisionId);
    }

    loaded.current = true;
    updateState({ init: true, session: appSession.current, revision: appRevision.current });
  };

  const actions = {
    setSession: async (access) => {
      await db.current.executeSql("UPDATE app SET value=? WHERE key='session';", [encodeObject(access)]);

      const revisionId = `${access.guid}_revision`;
      appRevision.currrent = await getAppValue(db.current, revisionId);

      appSession.current = access;
      updateState({ session: access, revision: appRevision.current });
    },
    clearSession: async () => {
      await db.current.executeSql("UPDATE app set value=? WHERE key='session';", [null]);
      appSession.current = null;
      updateState({ session: null });
    },
    setRevision: (rev) => {
      setRevision.current = rev;
      setAppRevision();
    },
  }

  useEffect(() => {
    initialize();
  }, []);

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

async function getAppValue(sql: SQLite.SQLiteDatabase, id: string) {
  const res = await sql.executeSql(`SELECT * FROM app WHERE key='${id}';`);
  if (hasResult(res)) {
    return decodeObject(res[0].rows.item(0).value);
  }
  return null;
}


