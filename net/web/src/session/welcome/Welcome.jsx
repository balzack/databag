import { WelcomeWrapper } from './Welcome.styled';

import session from 'images/session.png';

export function Welcome() {
  return (
    <WelcomeWrapper>
      <div class="title">
        <div class="header">Welcome to Databag</div>
        <div>Communication for the decentralized web</div>
      </div>
      <img class="session" src={session} alt="Session Background" />
      <div class="message">
        <p>Step 1: setup your profile</p>
        <p>Step 2: connect with people</p>
        <p>Step 3: start a conversation</p>
      </div>
    </WelcomeWrapper>
  );
}

