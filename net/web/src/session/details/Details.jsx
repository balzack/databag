import { Button, Modal, Tooltip } from 'antd';
import { DetailsWrapper, ModalFooter } from './Details.styled';
import { CloseOutlined } from '@ant-design/icons';
import { useDetails } from './useDetails.hook';
import { Logo } from 'logo/Logo';
import { EditOutlined, CloseCircleOutlined, UserSwitchOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CardSelect } from '../cardSelect/CardSelect';
import { EditSubject } from './editSubject/EditSubject';
import { EditMembers } from './editMembers/EditMembers';
import { UnlockOutlined, LockFilled } from '@ant-design/icons';

export function Details({ closeDetails, closeConversation, openContact }) {

  const [modal, modalContext] = Modal.useModal();
  const { state, actions } = useDetails();

  const setMember = async (id) => {
    try {
      await actions.setMember(id);
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: 'Failed to Set Conversation Member',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const clearMember = async (id) => {
    try {
      await actions.clearMember(id);
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: 'Failed to Clear Conversation Member',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const deleteChannel = async () => {
    modal.confirm({
      title: 'Are you sure you want to delete the topic?',
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { padding: 16 },
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
      await actions.removeChannel();
      closeConversation();
    }
    catch(err) {
      modal.error({
        title: 'Failed to Delete Topic',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const leaveChannel = async () => {
    modal.confirm({
      title: 'Are you sure you want to leave the topic?',
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { padding: 16 },
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
      await actions.removeChannel();
      closeConversation();
    }
    catch(err) {
      modal.error({
        title: 'Failed to Leave Topic',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  const saveSubject = async () => {
    try {
      await actions.setSubject();
      actions.clearEditSubject();
    }
    catch(err) {
      modal.error({
        title: 'Failed to Update Subject',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
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
      { modalContext }
      <div className="header">
        <div className="label">Topic Details</div>
        { state.display === 'xlarge' && (
          <div className="dismiss" onClick={closeConversation}>
            <CloseOutlined />
          </div>
        )}
        { state.display === 'small' && (
          <div className="dismiss" onClick={closeDetails}>
            <CloseOutlined />
          </div>
        )}
      </div>
      <div className="content">
        <div className="description">
          <div className="logo">
            <Logo src={state.logo} width={72} height={72} radius={4} img={state.img} />
          </div>
          <div className="stats">
            { !state.host && (
              <div className="subject" onClick={actions.setEditSubject}>
                { state.sealed && !state.contentKey && (
                  <LockFilled style={{ paddingRight: 4 }} />
                )}
                { state.sealed && state.contentKey && (
                  <UnlockOutlined style={{ paddingRight: 4 }} />
                )}
                { state.title && (
                  <span>{ state.title }</span>
                )}
                { !state.title && (
                  <span>{ state.label }</span>
                )}
                { (!state.sealed || state.contentKey) && (
                  <span className="edit" onClick={actions.setEditSubject}>
                    <EditOutlined style={{ paddingLeft: 4 }}/>
                  </span>
                )}
              </div>
            )}
            { state.host && (
              <div className="subject">
                { state.sealed && !state.contentKey && (
                  <LockFilled style={{ paddingRight: 4 }} />
                )}
                { state.sealed && state.contentKey && (
                  <UnlockOutlined style={{ paddingRight: 4 }} />
                )}
                { state.title && (
                  <span>{ state.title }</span>
                )}
                { !state.title && (
                  <span>{ state.label }</span>
                )}
              </div>
            )}
            { !state.host && (
              <div className="host">host</div>
            )}
            { state.host && (
              <div className="host">guest</div>
            )}
            <div className="created">{ state.started }</div>
          </div>
        </div>
        <div className="actions">
          <div className="label">{ state.strings.actions }</div>
          <div className="controls">
            { !state.host && (
              <Tooltip placement="top" title="Delete Topic">
                <Button className="button" type="primary" icon={<DeleteOutlined />} size="medium"  onClick={deleteChannel}>{ state.strings.remove }</Button>
              </Tooltip>
            )}
            { !state.host && !state.sealed && (
              <Tooltip placement="top" title="Edit Membership">
                <Button className="button" type="primary" icon={<UserSwitchOutlined />} size="medium"  onClick={actions.setEditMembers}>{state.strings.members}</Button>
              </Tooltip>
            )}
            { state.host && (
              <Tooltip placement="top" title="Leave Channel">
                <Button className="button" type="primary" icon={<CloseCircleOutlined />} size="medium"  onClick={leaveChannel}>{state.strings.leave}</Button>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="label">Members</div>
        <div className="members">
          <CardSelect filter={(item) => {
            if(state.members.includes(item.id)) {
              return true;
            }
            return false;
          }} unknown={state.unknown}
          markup={state.host} />
        </div>
      </div>
      <Modal title="Edit Subject" centered visible={state.showEditSubject} footer={editSubjectFooter}
          bodyStyle={{ padding: 16 }} onCancel={actions.clearEditSubject}>
        <EditSubject subject={state.editSubject} setSubject={actions.setSubjectUpdate} />
      </Modal>
      <Modal title="Edit Members" centered visible={state.showEditMembers} footer={editMembersFooter}
          bodyStyle={{ padding: 16 }} onCancel={actions.clearEditMembers}>
        <EditMembers members={state.editMembers} setMember={setMember} clearMember={clearMember} />
      </Modal>
    </DetailsWrapper>
  );
}

