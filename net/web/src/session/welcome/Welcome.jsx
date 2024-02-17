import { WelcomeWrapper } from './Welcome.styled';
import { RightOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import light from 'images/session.png';
import dark from 'images/darksess.png';

export function Welcome({ theme }) {
  return (
    <WelcomeWrapper>
      <div className="title">
        <div className="header">Databag</div>
        <div>Communication for the decentralized web</div>
      </div>
      { theme === 'light' && (
        <img className="session" src={light} alt="Session Background" />
      )}
      { theme === 'dark' && (
        <img className="session" src={dark} alt="Session Background" />
      )}
      <div className="message">
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


