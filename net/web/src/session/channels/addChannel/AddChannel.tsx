import { Input, Space, Modal, Switch, Button } from 'antd';
import { AddChannelWrapper, AddFooter } from './AddChannel.styled';
import { CardSelect } from '../../cardSelect/CardSelect';
import { useAddChannel } from './useAddChannel.hook';

export function AddChannel({ added, cancelled }) {
  const [modal, modalContext] = Modal.useModal();
  const { state, actions } = useAddChannel();

  const addChannel = async () => {
    try {
      const id = await actions.addChannel();
      added(id);
    } catch (err) {
      console.log(err);
      modal.error({
        title: 'Failed to Create Topic',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    }
  };

  return (
    <AddChannelWrapper>
      {modalContext}
      <div className="subject">
        <Input
          placeholder={state.strings.subjectOptional}
          spellCheck="false"
          autocapitalize="word"
          value={state.subject}
          onChange={(e) => actions.setSubject(e.target.value)}
        />
      </div>
      <div className="members">
        <span>{state.strings.members}:</span>
        {state.members.size !== 0 && <span className="count">{state.members.size}</span>}
      </div>
      <div className="list">
        <CardSelect
          select={actions.onMember}
          selected={state.members}
          emptyMessage={state.strings.noConnected}
          filter={actions.cardFilter}
          unknown={0}
        />
      </div>
      <AddFooter>
        <div className="seal">
          {state.sealable && state.allowUnsealed && (
            <>
              <Switch
                checked={state.seal}
                onChange={actions.setSeal}
                size="small"
              />
              <span className="sealText">{state.strings.sealedTopic}</span>
            </>
          )}
        </div>
        <Space>
          <Button
            key="back"
            onClick={cancelled}
          >
            {state.strings.cancel}
          </Button>
          <Button
            key="save"
            type="primary"
            loading={state.busy}
            onClick={addChannel}
          >
            {state.strings.start}
          </Button>
        </Space>
      </AddFooter>
    </AddChannelWrapper>
  );
}
