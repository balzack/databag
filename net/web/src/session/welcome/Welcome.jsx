import { WelcomeWrapper } from './Welcome.styled';
import { RightOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import { useWelcome } from './useWelcome.hook';

import light from 'images/lightsess.png';
import dark from 'images/darksess.png';

export function Welcome() {

  const { state } = useWelcome();

  return (
    <WelcomeWrapper>
      <div className="title">
        <div className="header">Databag</div>
        <div>{ state.strings.communication }</div>
      </div>
      { state.scheme === 'light' && (
        <img className="session" src={light} alt="Session Background" />
      )}
      { state.scheme === 'dark' && (
        <img className="session" src={dark} alt="Session Background" />
      )}
      <div className="message">
        <Space>
          <div>{ state.strings.setupProfile }</div>
          <RightOutlined />
          <div>{ state.strings.connectPeople }</div>
          <RightOutlined />
          <div>{ state.strings.startConversation }</div>
        </Space>
      </div>
    </WelcomeWrapper>
  );
}


