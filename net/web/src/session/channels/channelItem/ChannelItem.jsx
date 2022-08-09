import { ChannelItemWrapper } from './ChannelItem.styled';
import { useChannelItem } from './useChannelItem.hook';
import { SolutionOutlined } from '@ant-design/icons';

export function ChannelItem({ item }) {

  const { state, actions } = useChannelItem(item);

  return (
    <ChannelItemWrapper>
      { state.contacts.length === 0 && (
        <div class="notes">
          <div class="logo">
            <SolutionOutlined />
          </div>
          <div class="subject">
          </div>
          <div class="markup">
          </div>
        </div>
      )}
      { state.contacts.length === 1 && (
        <div>PERSONAL</div>
      )}
      { state.contacts.length > 1 && (
        <div>GROUP</div>
      )}
    </ChannelItemWrapper>
  )
}

