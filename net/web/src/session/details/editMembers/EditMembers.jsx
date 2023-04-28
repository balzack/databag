import { EditMembersWrapper } from './EditMembers.styled';
import { CardSelect } from '../../cardSelect/CardSelect';

export function EditMembers({ members, setMember, clearMember }) {

  return (
    <EditMembersWrapper>
      <div class="list">
        <CardSelect
          setItem={setMember}
          clearItem={clearMember}
          selected={members}
          filter={(card) => card?.data?.cardDetail?.status === 'connected'}
        />
      </div>
    </EditMembersWrapper>
  );
}

