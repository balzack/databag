import { useContext } from 'react';
import { Button } from 'antd';
import { AppContext } from 'context/AppContext'; 
import { ViewportContext } from 'context/ViewportContext';

export function Profile() {

  const app = useContext(AppContext);
  const viewport = useContext(ViewportContext);

  return (
    <div>
      <Button type="primary" onClick={() => app.actions.logout()}>LOGOUT</Button>
      <div>{ JSON.stringify(viewport.state) }</div>
    </div>
  );
}

