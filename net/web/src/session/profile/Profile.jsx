import { useRef } from 'react';
import { Modal, Button } from 'antd';
import { ProfileWrapper, EditFooter } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { ProfileImage } from './profileImage/ProfileImage';
import { ProfileDetails } from './profileDetails/ProfileDetails';
import { Logo } from 'logo/Logo';
import { AccountAccess } from '../accountAccess/AccountAccess';
import { LogoutOutlined, RightOutlined, EditOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Profile({ closeProfile }) {

  const { state, actions } = useProfile();
  const imageFile = useRef(null);

  const selected = (e) => {
    var reader = new FileReader();
    reader.onload = () => {
      actions.setEditImage(reader.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  const saveImage = async () => {
    try {
      await actions.setProfileImage();
      actions.clearEditProfileImage();
    }
    catch(err) {
      console.log(err);
      Modal.error({
        title: 'Failed to Save',
        content: 'Please try again.',
      });
    }
  }

  const saveDetails = async () => {
    try {
      await actions.setProfileDetails();
      actions.clearEditProfileDetails();
    }
    catch(err) {
      console.log(err);
      Modal.error({
        title: 'Failed to Save',
        content: 'Please try again.',
      });
    }
  }

  const logout = () => {
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      icon: <LogoutOutlined />,
      onOk() {
        actions.logout();
      },
      onCancel() {},
    });
  }

  const Image = (
    <div class="logo" onClick={actions.setEditProfileImage}>
      <Logo url={state.url} width={'100%'} radius={4} />
      <div class="edit">
        <EditOutlined />
      </div>
    </div>
  );

  const Details = (
    <div class="details">
      <div class="name" onClick={actions.setEditProfileDetails}>
        <div class="data">{ state.name }</div>
        <div class="icon">
          <EditOutlined />
        </div>
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

  const editImageFooter = (
    <EditFooter>
      <input type='file' id='file' accept="image/*" ref={imageFile} onChange={e => selected(e)} style={{display: 'none'}}/>
      <div class="select">
        <Button key="select" class="select" onClick={() => imageFile.current.click()}>Select Image</Button>
      </div>
      <Button key="back" onClick={actions.clearEditProfileImage}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveImage} loading={state.busy}>Save</Button>
    </EditFooter>
  );

  const editDetailsFooter = (
    <EditFooter>
      <div class="select"></div>
      <Button key="back" onClick={actions.clearEditProfileDetails}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveDetails} loading={state.busy}>Save</Button>
    </EditFooter>
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
            <AccountAccess />
            { state.display === 'small' && (
              <div class="logout" onClick={logout}>
                <LogoutOutlined />
                <div class="label">Logout</div>
              </div>
            )}
          </div>
        </div>
      )}
      <Modal title="Profile Image" centered visible={state.editProfileImage} footer={editImageFooter}
          onCancel={actions.clearEditProfileImage}>
        <ProfileImage state={state} actions={actions} />
      </Modal>
      <Modal title="Profile Details" centered visible={state.editProfileDetails} footer={editDetailsFooter}
          onCancel={actions.clearEditProfileDetails}>
        <ProfileDetails state={state} actions={actions} />
      </Modal>
    </ProfileWrapper>
  );
}

