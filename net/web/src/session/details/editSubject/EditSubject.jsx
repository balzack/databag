import { Input } from 'antd';
import { EditSubjectWrapper } from './EditSubject.styled';

export function EditSubject({ subject, setSubject }) {

  return (
    <EditSubjectWrapper>
      <Input placeholder="Subject (optional)" spellCheck="false" autocapitalize="word"
          value={subject} onChange={(e) => setSubject(e.target.value)} />
    </EditSubjectWrapper>
  );
}

