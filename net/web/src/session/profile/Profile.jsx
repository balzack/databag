import { useContext } from 'react';
import { Button, Checkbox } from 'antd';
import { AppContext } from 'context/AppContext'; 
import { ViewportContext } from 'context/ViewportContext';
import { ProfileWrapper } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { Logo } from 'logo/Logo';
import { LockOutlined, RightOutlined, EditOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Profile({ closeProfile }) {

  const { state, actions } = useProfile();

  const Image = (
    <div class="logo">
      <Logo url={state.url} width={'100%'} radius={8} />
      <div class="edit">
        <EditOutlined />
      </div>
    </div>
  );

  const Details = (
    <div class="details">
      <div class="name">
        <div class="data">{ state.name }</div>
        <EditOutlined />
      </div>
      <div class="location">
        <EnvironmentOutlined />
        <div class="data">{ state.location }</div>
      </div>
      <div class="description">
        <BookOutlined />
        <div class="data">{ state.description }</div>
      </div>
    </div>
  );

  return (
    <ProfileWrapper>
      { state.init && state.display === 'xlarge' && (
        <>
          <div class="header">
            <div class="handle">{ state.handle }</div>
            <div class="close" onClick={closeProfile}>
              <RightOutlined />
            </div>
          </div>

          <div class="content">
            { Image }
            { Details }
          </div>
        </>
      )}
      { state.init && state.display !== 'xlarge' && (
        <div class="view">
          <div class="title">{ state.handle }</div>
          <div class="section">Profile Settings</div>
          <div class="controls">
            { Image }
            { Details }
          </div>
          <div class="section">Account Settings</div>
          <div class="controls">
            <Checkbox>Visible in Registry</Checkbox>
            <div class="link">
              <LockOutlined />
              <div class="label">Change Login</div>
            </div>
          </div>
        </div>
      )}
    </ProfileWrapper>
  );
}

