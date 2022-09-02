import { Input } from 'antd';
import { AddChannelWrapper } from './AddChannel.styled';
import { CardSelect } from '../../cardSelect/CardSelect';

export function AddChannel({ state, actions }) {

  return (
    <AddChannelWrapper>
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
          filter={(card) => card?.data?.cardDetail?.status === 'connected'} 
          unknown={0}
        />
      </div>
    </AddChannelWrapper>
  );
}

