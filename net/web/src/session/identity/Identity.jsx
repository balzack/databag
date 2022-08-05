import { useContext } from 'react';
import { AppContext } from 'context/AppContext';
import { Button } from 'antd';

export function Identity() {

  const app = useContext(AppContext);

  return <Button type="primary" onClick={() => app.actions.logout()}>Logout</Button>
}

