import { Tooltip } from 'antd';
import { ChannelItemWrapper, Markup } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { UnlockOutlined, LockFilled } from '@ant-design/icons';
import { useChannelItem } from './useChannelItem.hook';

export function ChannelItem({ cardId, channelId, filter, openChannel, active }) {

  const { state } = useChannelItem(cardId, channelId, filter, active);

  return (
    <ChannelItemWrapper style={{ display: (!state.set || !state.visible) ? 'none' : null }}
          onClick={() => openChannel(channelId, cardId)}>
      <div class={state.active ? 'active' : 'idle'}>
        <div class="item">
          <div class="avatar">
            <Logo url={state.logo} img={state.img} width={32} height={32} radius={8} />
          </div>
          <div class="details">
            <div class="subject">
              { state.locked && !state.unlocked && (
                <LockFilled style={{ paddingRight: 8 }}/>
              )}
              { state.locked && state.unlocked && (
                <UnlockOutlined style={{ paddingRight: 8 }}/>
              )}
              <span>{ state.subject }</span>
            </div>
            <div class="message">{ state.message }</div>
          </div>
          { state.updatedFlag && (
            <Tooltip placement="topRight" title="New Message">
              <Markup />
            </Tooltip>
          )}
        </div>
      </div>
    </ChannelItemWrapper>
  )
}

