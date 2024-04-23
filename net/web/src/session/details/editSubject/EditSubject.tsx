import { Input, Button } from 'antd';
import { EditSubjectWrapper } from './EditSubject.styled';

export function EditSubject({ subject, setSubject, saveSubject, cancelSubject, strings }) {

  return (
    <EditSubjectWrapper>
      <div className="title">{strings.editSubject}</div>

      <Input placeholder={strings.subjectOptional} spellCheck="false" autoCapitalize="word"
          value={subject} onChange={(e) => setSubject(e.target.value)} />

      <div className="controls">
        <Button key="back" onClick={cancelSubject}>{strings.cancel}</Button>
        <Button key="save" type="primary" onClick={saveSubject}>{strings.save}</Button>
      </div>
    </EditSubjectWrapper>
  );
}

