import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {ContextType} from '../context/ContextType';
import {useLocation, useNavigate} from 'react-router-dom';

export function useRoot() {
  const app = useContext(AppContext) as ContextType;
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    pathname: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    const {pathname} = location;
    updateState({pathname});
  }, [location.pathname]);

  useEffect(() => {
    if (state.pathname === '/session' && !app.state.session) {
      navigate('/');
    } else if (state.pathname === '/node' && !app.state.node) {
      navigate('/');
    } else if (
      state.pathname === '/' &&
      !app.state.session &&
      !app.state.node
    ) {
      navigate('/access');
    } else if (state.pathname !== '/node' && app.state.node) {
      navigate('/node');
    } else if (state.pathname !== '/session' && app.state.session) {
      navigate('/session');
    }
  }, [state.pathname, app.state.session, app.state.node]);

  const actions = {};

  return {state, actions};
}
