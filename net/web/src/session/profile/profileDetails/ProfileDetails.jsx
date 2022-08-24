import { Input } from 'antd';
import { ProfileDetailsWrapper } from './ProfileDetails.styled';

export function ProfileDetails({ state, actions }) {
  return (
    <ProfileDetailsWrapper>
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
    </ProfileDetailsWrapper>
  );
}

