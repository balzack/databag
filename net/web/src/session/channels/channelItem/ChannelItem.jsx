import { Tooltip } from 'antd';
import { ChannelItemWrapper, Markup } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { UnlockOutlined, LockFilled } from '@ant-design/icons';

export function ChannelItem({ item, openChannel, active }) {

  return (
    <ChannelItemWrapper onClick={() => openChannel(item.channelId, item.cardId)}>
      <div class={active ? 'active' : 'idle'}>
        <div class="item">
          <div class="avatar">
            <Logo url={item.logo} img={item.img} width={32} height={32} radius={8} />
          </div>
          <div class="details">
            <div class="subject">
              { item.locked && !item.unlocked && (
                <LockFilled style={{ paddingRight: 8 }}/>
              )}
              { item.locked && item.unlocked && (
                <UnlockOutlined style={{ paddingRight: 8 }}/>
              )}
              <span>{ item.subject }</span>
            </div>
            <div class="message">{ item.message }</div>
          </div>
          { item.updatedFlag && (
            <Tooltip placement="topRight" title="New Message">
              <Markup />
            </Tooltip>
          )}
        </div>
      </div>
    </ChannelItemWrapper>
  )
}

