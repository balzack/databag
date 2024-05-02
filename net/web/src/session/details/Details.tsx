import { Button, Modal, Tooltip } from 'antd';
import { DetailsWrapper } from './Details.styled';
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
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
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
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const deleteChannel = async () => {
    modal.confirm({
      title: <span style={state.menuStyle}>{state.strings.confirmTopic}</span>,
      content: <span style={state.menuStyle}>{state.strings.sureTopic}</span>,
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.remove,
      cancelText: state.strings.cancel,
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
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }

  const leaveChannel = async () => {
    modal.confirm({
      title: <span style={state.menuStyle}>{state.strings.confirmLeave}</span>,
      content: <span style={state.menuStyle}>{state.strings.sureLeave}</span>,
      icon: <ExclamationCircleOutlined />,
      bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      okText: state.strings.leave,
      cancelText: state.strings.cancel,
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
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
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
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  };

  return (
    <DetailsWrapper>
      { modalContext }
      <div className="header">
        <div className="label">{state.strings.details}</div>
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
            <Logo width={72} height={72} radius={4} img={state.img} />
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
              <div className="host">{ state.strings.host }</div>
            )}
            { state.host && (
              <div className="host">{ state.strings.guest }</div>
            )}
            <div className="created">{ state.started }</div>
          </div>
        </div>
        <div className="actions">
          <div className="label">{ state.strings.actions }</div>
          <div className="controls">
            { !state.host && (
              <Tooltip placement="top" title={state.strings.deleteTopic}>
                <Button className="button" type="primary" icon={<DeleteOutlined />} 
                 //@ts-ignore
                 size="medium"
                   onClick={deleteChannel}>{ state.strings.remove }</Button>
              </Tooltip>
            )}
            { !state.host && !state.sealed && (
              <Tooltip placement="top" title={state.strings.editMembership}>
                <Button className="button" type="primary" icon={<UserSwitchOutlined />}
                 //@ts-ignore
                 size="medium"
                   onClick={actions.setEditMembers}>{state.strings.members}</Button>
              </Tooltip>
            )}
            { state.host && (
              <Tooltip placement="top" title={state.strings.leaveTopic}>
                <Button className="button" type="primary" icon={<CloseCircleOutlined />}
                 //@ts-ignore
                 size="medium"
                   onClick={leaveChannel}>{state.strings.leave}</Button>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="label">{state.strings.members}</div>
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
      <Modal centered visible={state.showEditSubject} closable={false} footer={null} bodyStyle={{borderRadius: 8, padding: 16, ...state.menuStyle}}>
        <EditSubject subject={state.editSubject} cancelSubject={actions.clearEditSubject} saveSubject={saveSubject} setSubject={actions.setSubjectUpdate}
            strings={state.strings} />
      </Modal>
      <Modal centered visible={state.showEditMembers} closable={false} footer={null} bodyStyle={{borderRadius: 8, padding: 16, ...state.menuStyle}}>
        <EditMembers members={state.editMembers} setMember={setMember} clearMember={clearMember} onClose={actions.clearEditMembers} strings={state.strings} />
      </Modal>
    </DetailsWrapper>
  );
}

