import { Input, Space, Modal, Switch, Button } from 'antd';
import { AddChannelWrapper, AddFooter } from './AddChannel.styled';
import { CardSelect } from '../../cardSelect/CardSelect';
import { useAddChannel } from './useAddChannel.hook';

export function AddChannel({ added, cancelled }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useAddChannel();

  const addChannel = async () => {
    try {
      const id = await actions.addChannel();
      added(id);
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: 'Failed to Create Topic',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  }

  return (
    <AddChannelWrapper>
      { modalContext }
      <Input placeholder="Subject (optional)" spellCheck="false" autocapitalize="word"
          value={state.subject} onChange={(e) => actions.setSubject(e.target.value)} />
      <div class="members">
        <span>Channel Members: </span>
        { state.members.size !== 0 && (
          <span>{ state.members.size }</span>
        )}
      </div>
      <div class="list">
        <CardSelect
          select={actions.onMember}
          selected={state.members}
          emptyMessage={'No Connected Contacts'}
          filter={actions.cardFilter} 
          unknown={0}
        />
      </div>
        <AddFooter>
        <div class="seal">
          { state.sealable && state.allowUnsealed && (
            <>
              <Switch checked={state.seal} onChange={actions.setSeal} size="small" />
              <span class="sealText">Sealed Channel</span>
            </>
          )}
        </div>
        <Space>
          <Button key="back" onClick={cancelled}>Cancel</Button>
          <Button key="save" type="primary" loading={state.busy} onClick={addChannel}>Save</Button>
        </Space>
      </AddFooter>
    </AddChannelWrapper>
  );
}

