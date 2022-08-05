import { UserOutlined } from '@ant-design/icons';
import { AdminWrapper } from './Admin.styled';
import { useAdmin } from './useAdmin.hook';

export function Admin() {

  const { state, actions } = useAdmin();

  return (
    <AdminWrapper>
      <div class="app-title">
        <span>Databag</span>
        <div class="user" onClick={() => actions.onUser()}>
          <UserOutlined />
        </div>
      </div>
    </AdminWrapper>
  );
}

