import { useRef } from 'react';
import { Space, Modal, Button } from 'antd';
import { ProfileWrapper, EditFooter } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { ProfileImage } from './profileImage/ProfileImage';
import { ProfileDetails } from './profileDetails/ProfileDetails';
import { Logo } from 'logo/Logo';
import { AccountAccess } from './accountAccess/AccountAccess';
import { LogoutOutlined, RightOutlined, EditOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';

export function Profile({ closeProfile }) {

  const [ modal, modalContext ] = Modal.useModal();
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
      modal.error({
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
      modal.error({
        title: 'Failed to Save',
        content: 'Please try again.',
      });
    }
  }

  const logout = () => {
    modal.confirm({
      title: 'Are you sure you want to logout?',
      icon: <LogoutOutlined />,
      onOk() {
        actions.logout();
      },
      onCancel() {},
    });
  }

  const editImageFooter = (
    <EditFooter>
      <input type='file' id='file' accept="image/*" ref={imageFile} onChange={e => selected(e)} style={{display: 'none'}}/>
      <div className="select">
        <Button key="select" className="select" onClick={() => imageFile.current.click()}>Select Image</Button>
      </div>
      <Button key="back" onClick={actions.clearEditProfileImage}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveImage} loading={state.busy}>Save</Button>
    </EditFooter>
  );

  const editDetailsFooter = (
    <EditFooter>
      <div className="select"></div>
      <Button key="back" onClick={actions.clearEditProfileDetails}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveDetails} loading={state.busy}>Save</Button>
    </EditFooter>
  );

  return (
    <ProfileWrapper>
      { modalContext }
      { state.display === 'xlarge' && (
        <div className="middleHeader">
          <div className="handle">{ state.handle }</div>
          <div className="close" onClick={closeProfile}>
            <RightOutlined />
          </div>
        </div>
      )}
      { state.display !== 'xlarge' && (
        <div className="rightHeader">
          <div className="title">{ state.handle }</div>
          <div className="section">Profile Settings</div>
        </div>
      )}
      <div className={ state.display === 'xlarge' ? 'midContent' : 'rightContent' }>
        <div className="logo" onClick={actions.setEditProfileImage}>
          <Logo url={state.url} width={'100%'} radius={4} />
          <div className="edit">
            <EditOutlined />
          </div>
        </div>
        <div className="details">
          <div className="name" onClick={actions.setEditProfileDetails}>
            { state.name && (
              <div className="data">{ state.name }</div>
            )}
            { !state.name && (
              <div className="data notset">name</div>
            )}
            <div className="icon">
              <EditOutlined />
            </div>
          </div>
          <div className="location">
            <EnvironmentOutlined />
              { state.location && (
                <div className="data">{ state.location }</div>
              )}
              { !state.location && (
                <div className="data notset">location</div>
              )}
          </div>
          <div className="description">
            <BookOutlined />
            { state.description && (
              <div className="data">{ state.description }</div>
            )}
            { !state.description && (
              <div className="data notset">description</div>
            )}
          </div>
        </div>
      </div>
      { state.init && state.display !== 'xlarge' && (
        <div className="account">
          <div className="section">Account Settings</div>
          <div className="controls">
            <AccountAccess />
            { state.display === 'small' && (
              <div className="logout" onClick={logout}>
                <LogoutOutlined />
                <div className="label">Logout</div>
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

