import { Tooltip } from 'antd';
import { ChannelItemWrapper, Markup } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { AppstoreFilled, SolutionOutlined } from '@ant-design/icons';

export function ChannelItem({ item, openChannel, active }) {

  const itemClass = () => {
    if (active.set && active.channel === item.id && active.card === item.cardId) {
      return "active"
    }
    return "idle"
  };

  return (
    <ChannelItemWrapper onClick={() => openChannel(item.id, item.cardId)}>
      <div class={itemClass()}>
        { item.contacts.length === 0 && (
          <div class="item">
            <div class="logo">
              <SolutionOutlined />
            </div>
            <div class="details">
              <div class="subject">{ item.subject }</div>
              <div class="message">{ item.message }</div>
            </div>
          </div>
        )}
        { item.contacts.length === 1 && (
          <div class="item">
            <div class="avatar">
              <Logo url={item.logo} width={32} height={32} radius={8} />
            </div>
            <div class="details">
              <div class="subject">{ item.subject }</div>
              <div class="message">{ item.message }</div>
            </div>
            { item.updated && (
              <Markup />
            )}
          </div>
        )}
        { item.contacts.length > 1 && (
          <div class="item">
            <div class="logo">
              <AppstoreFilled />
            </div>
            <div class="details">
              <div class="subject">{ item.subject }</div>
              <div class="message">{ item.message }</div>
            </div>
            { item.updated && (
              <Tooltip placement="right" title="new message">
                <Markup />
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </ChannelItemWrapper>
  )
}

