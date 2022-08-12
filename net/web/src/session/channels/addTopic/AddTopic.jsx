import { AddTopicWrapper } from './AddTopic.styled';
import { CommentOutlined } from '@ant-design/icons';
import { useAddTopic } from './useAddTopic.hook';

export function AddTopic() {

  const { state, actions } = useAddTopic();

  return (
    <AddTopicWrapper>
      { state.mode === 'bar' && ( 
        <div class="bar">
          <div class="add">
            <CommentOutlined />
            <div class="label">New Channel</div>
          </div>
        </div>
      )}
      { state.mode === 'button' && (
        <div class="button">New Channel</div>
      )}
    </AddTopicWrapper>
  );
}

