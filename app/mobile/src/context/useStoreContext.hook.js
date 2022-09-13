import { useEffect, useState, useRef, useContext } from 'react';
import SQLite from "react-native-sqlite-storage";

const DATABAG_DB = 'databag_v001.db';

export function useStoreContext() {
  const [state, setState] = useState({
    init: false,
    session: null,
    sessionId: 0,
    profileRevision: null,
    cardRevision: null,
    channelRevision: null,
    accountRevision: null,
  });
  
  const db = useRef(null);
  const session = useRef(null);
  const sessionId = useRef(0);

  const updateState = (value) => {
    setState((s) => ({ ...s, ...value }))
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (state.init && state.session && sessionId.current === state.sessionId) {
      const revision = {
        accountRevision: state.accountRevision,
        profileRevision: state.profileRevision,
        cardRevision: state.cardRevision,
        channelRevision: state.channelRevision,
      }
      const revisionId = `${session.current.guid}_revision`;
      db.current.executeSql(`UPDATE app SET value=? WHERE key='${revisionId}';`, [encodeObject(revision)]);
    }
  }, [state]);

  const initialize = async () => {
    SQLite.DEBUG(false);
    SQLite.enablePromise(true);
    db.current = await SQLite.openDatabase({ name: DATABAG_DB, location: "default" });
    await db.current.executeSql("CREATE TABLE IF NOT EXISTS app (key text, value text, unique(key));");
    await db.current.executeSql("INSERT OR IGNORE INTO app (key, value) values ('session', null);");

    session.current = await getAppValue(db.current, 'session');
    if (!session.current) {
      updateState({ init: true });
    }
    else {
      const revisionId = `${session.current.guid}_revision`;
      const revision = await getAppValue(db.current, revisionId, {});
      updateState({ init: true, session: session.current, ...revision });
    }
  };

  const actions = {
    setSession: async (access) => {
      await db.current.executeSql("UPDATE app SET value=? WHERE key='session';", [encodeObject(access)]);

      const revisionId = `${access.guid}_revision`;
      const revision = await getAppValue(db.current, revisionId, {});

      session.current = access;
      sessionId.current++;
      updateState({ session: access, sessionId: sessionId.current, ...revision });
    },
    clearSession: async () => {
      await db.current.executeSql("UPDATE app set value=? WHERE key='session';", [null]);
      session.current = null;
      updateState({ session: null });
    },
    setProfileRevision: (id, profileRevision) => {
      if (sessionId.current === id) {
        updateState({ profileRevision });
      }
    },
    setAccountRevision: (id, accountRevision) => {
      if (sessionId.current === id) {
        updateState({ accountRevision });
      }
    },
    setCardRevision: (id, cardRevision) => {
      if (sessionId.current === id) {
        updateState({ cardRevision });
      }
    },
    setChannelRevision: (channelRevision) => {
      if (sessionId.current === id) {
        updateState({ channelRevision });
      }
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

async function getAppValue(sql: SQLite.SQLiteDatabase, id: string, unset) {
  const res = await sql.executeSql(`SELECT * FROM app WHERE key='${id}';`);
  if (hasResult(res)) {
    return decodeObject(res[0].rows.item(0).value);
  }
  return unset;
}


