import { Tooltip } from 'antd';
import { ChannelItemWrapper, Markup } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { UnlockOutlined, LockFilled } from '@ant-design/icons';

export function ChannelItem({ item, openChannel, active, tip }) {

  return (
    <ChannelItemWrapper onClick={() => openChannel(item.channelId, item.cardId)}>
      <div className={active ? 'active' : 'idle'}>
        <div className="item">
          <div className="avatar">
            <Logo url={item.logo} img={item.img} width={32} height={32} radius={4} />
          </div>
          <div className="details">
            <div className="subject">
              { item.locked && !item.unlocked && (
                <LockFilled style={{ paddingRight: 8 }}/>
              )}
              { item.locked && item.unlocked && (
                <UnlockOutlined style={{ paddingRight: 8 }}/>
              )}
              <span>{ item.subject }</span>
            </div>
            <div className="message">{ item.message }</div>
          </div>
          { item.updatedFlag && (
            <Tooltip placement="topRight" title={tip}>
              <Markup />
            </Tooltip>
          )}
        </div>
      </div>
    </ChannelItemWrapper>
  )
}

