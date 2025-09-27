import {useState, useContext, useEffect} from 'react';
import {AppContext} from '../context/AppContext';
import {ContextType} from '../context/ContextType';
import {useLocation, useNavigate} from 'react-router-dom';
import SplashScreen from 'react-native-splash-screen';

const CLEAR_TIME = 5000;

export function useRoot() {
  const app = useContext(AppContext) as ContextType;
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    pathname: '',
  });

  const updateState = (value: any) => {
    setState(s => ({...s, ...value}));
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, CLEAR_TIME);
  }, []);

  useEffect(() => {
    const {pathname} = location;
    updateState({pathname});
  }, [location]);

  useEffect(() => {
    if (!app.state.initialized) {
      navigate('/');
    } else if (state.pathname === '/session' && !app.state.session) {
      navigate('/');
    } else if (state.pathname === '/service' && !app.state.service) {
      navigate('/');
    } else if (state.pathname === '/' && !app.state.session && !app.state.service) {
      navigate('/access');
    } else if (state.pathname !== '/service' && app.state.service) {
      navigate('/service');
    } else if (state.pathname !== '/session' && app.state.session) {
      navigate('/session');
    }
  }, [state.pathname, app.state.session, app.state.service, app.state.initialized, navigate]);

  const actions = {};

  return {state, actions};
}
