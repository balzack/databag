import { Input } from 'antd';
import { EditSubjectWrapper } from './EditSubject.styled';

export function EditSubject({ state, actions }) {

  return (
    <EditSubjectWrapper>
      <Input placeholder="Subject (optional)" spellCheck="false" autocapitalize="word"
          value={state.subjectUpdate} onChange={(e) => actions.setSubjectUpdate(e.target.value)} />
    </EditSubjectWrapper>
  );
}

