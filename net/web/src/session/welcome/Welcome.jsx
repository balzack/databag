import { WelcomeWrapper } from './Welcome.styled';
import { RightOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import session from 'images/session.png';

export function Welcome() {
  return (
    <WelcomeWrapper>
      <div class="title">
        <div class="header">Databag</div>
        <div>Communication for the decentralized web</div>
      </div>
      <img class="session" src={session} alt="Session Background" />
      <div class="message">
        <Space>
          <div>Setup your profile</div>
          <RightOutlined />
          <div>Connect with people</div>
          <RightOutlined />
          <div>Start a conversation</div>
        </Space>
      </div>
    </WelcomeWrapper>
  );
}

