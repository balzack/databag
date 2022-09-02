import { Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

export function AccountLogin({ state, actions }) {
  return (
    <Form name="basic" wrapperCol={{ span: 24, }}>
        <Form.Item name="username" validateStatus={state.editStatus} help={state.editMessage}>
          <Input placeholder="Username" spellCheck="false" onChange={(e) => actions.setEditHandle(e.target.value)}
              defaultValue={state.editHandle} autocomplete="username" autocapitalize="none" prefix={<UserOutlined />} />
        </Form.Item>

        <Form.Item name="password">
          <Input.Password placeholder="Password" spellCheck="false" onChange={(e) => actions.setEditPassword(e.target.value)}
              autocomplete="new-password" prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item name="confirm">
          <Input.Password placeholder="Confirm Password" spellCheck="false" onChange={(e) => actions.setEditConfirm(e.target.value)}
              autocomplete="new-password" prefix={<LockOutlined />} />
        </Form.Item>
    </Form>
  );
}

