import { EditMembersWrapper } from './EditMembers.styled';
import { CardSelect } from '../../cardSelect/CardSelect';
import { Button } from 'antd';

export function EditMembers({ members, setMember, clearMember, onClose, strings }) {

  return (
    <EditMembersWrapper>
      <div className="title">Edit Membership</div>

      <div className="list">
        <CardSelect
          setItem={setMember}
          clearItem={clearMember}
          selected={members}
          filter={(card) => card?.data?.cardDetail?.status === 'connected'}
        />
      </div>
      <div className="controls">
        <Button key="back" onClick={onClose}>{strings.close}</Button>
      </div>
    </EditMembersWrapper>
  );
}

