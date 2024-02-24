import { useRef, useCallback } from 'react';
import { Modal, Input, Button, Switch } from 'antd';
import { LogoutContent, ProfileWrapper, ProfileDetailsWrapper, ProfileImageWrapper, EditFooter } from './Profile.styled';
import { useProfile } from './useProfile.hook';
import { Logo } from 'logo/Logo';
import { AccountAccess } from './accountAccess/AccountAccess';
import { LogoutOutlined, RightOutlined, EditOutlined, BookOutlined, EnvironmentOutlined } from '@ant-design/icons';
import Cropper from 'react-easy-crop';

export function Profile({ closeProfile }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useProfile();
  const imageFile = useRef(null);
  const all = useRef(false);

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
        bodyStyle: { padding: 16 },
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
        bodyStyle: { padding: 16 },
      });
    }
  }

  const logout = () => {
    modal.confirm({
      title: <span style={state.menuStyle}>{state.strings.confirmLogout}</span>,
      icon: <LogoutOutlined />,
      content: <LogoutContent onClick={(e) => e.stopPropagation()}>
                <span className="logoutMode">{ state.strings.allDevices }</span>
                <Switch onChange={(e) => all.current = e} size="small" />
               </LogoutContent>,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.ok,
      onOk() {
        actions.logout(all.current);
      },
      cancelText: state.strings.cancel,
      onCancel() {},
    });
  }

  const editImageFooter = (
    <EditFooter>
      <input type='file' id='file' accept="image/*" ref={imageFile} onChange={e => selected(e)} style={{display: 'none'}}/>
      <div className="select">
        <Button key="select" className="pic" onClick={() => imageFile.current.click()}>Select Image</Button>
      </div>
      <Button key="back" onClick={actions.clearEditProfileImage}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveImage} loading={state.busy}>Save</Button>
    </EditFooter>
  );

  const onCropComplete = useCallback((area, crop) => {
    actions.setEditImageCrop(crop.width, crop.height, crop.x, crop.y)
    // eslint-disable-next-line
  }, []);

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
          <div className="section">Profile</div>
        </div>
      )}
      <div className={ state.display === 'xlarge' ? 'midContent' : 'rightContent' }>
        { state.urlSet && (
          <div className="logo" onClick={actions.setEditProfileImage}>
            <Logo url={state.url} width={'100%'} radius={4} />
            <div className="edit">
              <EditOutlined />
            </div>
          </div>
        )}
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
      { state.display !== 'xlarge' && state.displaySet && (
        <div className="rightAccess">
          <AccountAccess />
          { state.display === 'small' && (
            <div className="logout" onClick={logout}>
              <LogoutOutlined />
              <div className="label">Logout</div>
            </div>
          )}
          <div className="contentFill" />
        </div>
      )}
      <Modal title="Profile Image" centered visible={state.editProfileImage} footer={editImageFooter}
          bodyStyle={{ padding: 16 }} onCancel={actions.clearEditProfileImage}>

        <ProfileImageWrapper>
          <Cropper image={state.editImage} crop={state.crop} zoom={state.zoom} aspect={1}
              onCropChange={actions.setCrop} onCropComplete={onCropComplete} onZoomChange={actions.setZoom} />
        </ProfileImageWrapper>

      </Modal>
      <Modal centered closable={false} visible={state.editProfileDetails} footer={null}
          bodyStyle={{ borderRadius: 8, padding: 16, ...state.menuStyle }} onCancel={actions.clearEditProfileDetails}>

        <ProfileDetailsWrapper>
          <div className="title">Profile Details</div>
          <div class="info">
            <Input placeholder="Name" spellCheck="false" onChange={(e) => actions.setEditName(e.target.value)}
                defaultValue={state.editName} autocapitalize="word" />
          </div>
          <div class="info">
            <Input placeholder="Location" spellCheck="false" onChange={(e) => actions.setEditLocation(e.target.value)}
                defaultValue={state.editLocation} autocapitalize="word" />
          </div>
          <div class="info">
            <Input.TextArea placeholder="Description" onChange={(e) => actions.setEditDescription(e.target.value)}
                spellCheck="false" defaultValue={state.editDescription} autoSize={{ minRows: 2, maxRows: 6 }} />
          </div>

          <div className="controls">
            <Button key="back" onClick={actions.clearEditProfileDetails}>Cancel</Button>
            <Button key="save" type="primary" onClick={saveDetails} loading={state.busy}>Save</Button>
          </div>
        </ProfileDetailsWrapper>

      </Modal>
    </ProfileWrapper>
  );
}

