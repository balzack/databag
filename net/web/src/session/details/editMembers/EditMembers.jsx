import { EditMembersWrapper } from './EditMembers.styled';
import { CardSelect } from '../../cardSelect/CardSelect';

export function EditMembers({ state, actions }) {

  return (
    <EditMembersWrapper>
      <div class="list">
        <CardSelect
          select={actions.onMember}
          selected={state.members}
          filter={(card) => card?.data?.cardDetail?.status === 'connected'}
        />
      </div>
    </EditMembersWrapper>
  );
}

