import {useState, useContext, useEffect} from 'react';
import {DisplayContext} from '../context/DisplayContext';
import {AppContext} from '../context/AppContext';
import {ContextType} from '../context/ContextType';

export function useMessage() {
  const app = useContext(AppContext) as ContextType;
  const display = useContext(DisplayContext) as ContextType;
  const [state, setState] = useState({
    strings: display.state.strings,
    fullDayTime: app.state.fullDayTime,
    monthFirstDate: app.state.monthFirstDate,
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const {strings} = display.state;
    updateState({strings});
  }, [display.state]);

  useEffect(() => {
    const {monthFirstDate, fullDayTime} = app.state;
    updateState({ monthFirstDate, fullDayTime });
  }, [app.state]);

  const actions = {
    block: async (topicId: string) => {
      const focus = app.state.focus;
      if (focus) {
        await focus.setBlockTopic(topicId);
      }
    },
    flag: async (topicId: string) => {
      const focus = app.state.focus;
      if (focus) {
        await focus.flagTopic(topicId);
      }
    },
    remove: async (topicId: string) => {
      const focus = app.state.focus;
      if (focus) {
        await focus.removeTopic(topicId);
      }
    },
    saveSubject: async (topicId: string, sealed: boolean, subject: any) => {
      const focus = app.state.focus;
      if (focus) {
        await focus.setTopicSubject(
          topicId,
          sealed ? 'sealedtopic' : 'superbasictopic',
          () => subject,
          [],
          () => true,
        );
      }
    },
    getTimestamp: (created: number) => {
      const now = Math.floor(new Date().getTime() / 1000);
      const date = new Date(created * 1000);
      const offset = now - created;
      if (offset < 43200) {
        if (state.fullDayTime) {
          return date.toLocaleTimeString('en-GB', {hour12: false, hour: 'numeric', minute: '2-digit'});
        } else {
          return date.toLocaleTimeString('en-US', {hour12: true, hour: 'numeric', minute: '2-digit'});
        }
      } else if (offset < 31449600) {
        if (state.monthFirstDate) {
          return date.toLocaleDateString('en-US', {day: 'numeric', month: 'numeric'});
        } else {
          return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric'});
        }
      } else {
        if (state.monthFirstDate) {
          return date.toLocaleDateString('en-US');
        } else {
          return date.toLocaleDateString('en-GB');
        }
      }
    },
  };

  return {state, actions};
}
