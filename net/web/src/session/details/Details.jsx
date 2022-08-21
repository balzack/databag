import { Space, Button, Modal } from 'antd';
import { DetailsWrapper, ModalFooter } from './Details.styled';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useDetails } from './useDetails.hook';
import { Logo } from 'logo/Logo';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CardSelect } from '../cardSelect/CardSelect';
import { EditSubject } from './editSubject/EditSubject';
import { EditMembers } from './editMembers/EditMembers';

export function Details({ cardId, channelId, closeDetails, closeConversation, openContact }) {

  const { state, actions } = useDetails(cardId, channelId);

  const deleteChannel = async () => {
    Modal.confirm({
      title: 'Are you sure you want to delete the channel?',
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Delete",
      cancelText: "No, Cancel",
      onOk() {
        applyDeleteChannel();
      },
      onCancel() {},
    });
  }

  const applyDeleteChannel = async () => {
    try {
      await actions.deleteChannel();
      closeConversation();
    }
    catch(err) {
      Modal.error({
        title: 'Failed to Delete Channel',
        content: 'Please try again.',
      });
    }
  }

  const leaveChannel = async () => {
    Modal.confirm({
      title: 'Are you sure you want to leave the channel?',
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Leave",
      cancelText: "No, Cancel",
      onOk() {
        applyLeaveChannel();
      },
      onCancel() {},
    });
  }

  const applyLeaveChannel = async () => {
    try {
      await actions.leaveChannel();
      closeConversation();
    }
    catch(err) {
      Modal.error({
        title: 'Failed to Leave Channel',
        content: 'Please try again.',
      });
    }
  }

  const saveSubject = async () => {
    try {
      const id = await actions.setSubject();
      actions.clearEditSubject();
    }
    catch(err) {
      Modal.error({
        title: 'Failed to Update Subject',
        content: 'Please try again.',
      });
    }
  };

  const editSubjectFooter = (
    <ModalFooter>
      <Button key="back" onClick={actions.clearEditSubject}>Cancel</Button>
      <Button key="save" type="primary" onClick={saveSubject} loading={state.busy}>Save</Button>
    </ModalFooter>
  );

  const editMembersFooter = (
    <ModalFooter>
      <Button key="back" onClick={actions.clearEditMembers}>Done</Button>
    </ModalFooter>
  );

  return (
    <DetailsWrapper>
      <div class="header">
        <div class="label">Channel</div>
        <div class="dismiss" onClick={closeConversation}>
          <DoubleRightOutlined />
        </div>
      </div>
      <div class="content">
        <div class="description">
          <div class="logo">
            <Logo width={72} height={72} radius={4} img={state.img} />
          </div>
          <div class="stats">
            { state.host && (
              <div class="subject edit" onClick={actions.setEditSubject}>
                <Space>
                  <div>{ state.subject }</div>
                  <EditOutlined />
                </Space>
              </div>
            )}
            { !state.host && (
              <div class="subject">{ state.subject }</div>
            )}
            { state.host && (
              <div class="host">host</div>
            )}
            { !state.host && (
              <div class="host">guest</div>
            )}
            <div class="created">{ state.started }</div>
          </div>
        </div>
        { state.host && (
          <div class="button" onClick={deleteChannel}>Delete Channel</div>
        )}
        { state.host && (
          <div class="button" onClick={actions.setEditMembers}>Edit Membership</div>
        )}
        { !state.host && (
          <div class="button" onClick={leaveChannel}>Leave Channel</div>
        )}
        <div class="label">Members</div>
        <div class="members">
          <CardSelect filter={(item) => {
            if(state.contacts.includes(item.id)) {
              return true;
            }
            return false;
          }} unknown={state.unknown}
          markup={cardId} />
        </div>
      </div>
      <Modal title="Edit Subject" centered visible={state.editSubject} footer={editSubjectFooter}
          onCancel={actions.clearEditSubject}>
        <EditSubject state={state} actions={actions} />
      </Modal>
      <Modal title="Edit Members" centered visible={state.editMembers} footer={editMembersFooter}
          onCancel={actions.clearEditMembers}>
        <EditMembers state={state} actions={actions} />
      </Modal>
    </DetailsWrapper>
  );
}

