import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionWrapper } from './Session.styled';
import { Button } from 'antd';
import { AppContext } from 'context/AppContext';
import { ViewportContext } from 'context/ViewportContext';

export function Session() {

  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (app.state) {
      if (!app.state.access) {
        navigate('/');
      }
    }
  }, [app, navigate]);

  return (
    <SessionWrapper>
      { (viewport.state.display === 'xlarge') && (
        <div class="desktop-layout">
          <Button type="primary" onClick={app.actions.logout}>Logout</Button>
        </div>
      )}
      { (viewport.state.display === 'large' || viewport.state.display === 'medium') && (
        <div class="tablet-layout">
          <Button type="primary" onClick={app.actions.logout}>Logout</Button>
        </div>
      )}
      { (viewport.state.display === 'small') && (
        <div class="mobile-layout">
          <Button type="primary" onClick={app.actions.logout}>Logout</Button>
        </div>
      )}
    </SessionWrapper>
  );
}

