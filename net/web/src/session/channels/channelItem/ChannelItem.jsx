import { Tooltip } from 'antd';
import { ChannelItemWrapper, Markup } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { AppstoreFilled, SolutionOutlined } from '@ant-design/icons';

export function ChannelItem({ item, openChannel }) {

  return (
    <ChannelItemWrapper onClick={() => openChannel(item.id, item.cardId)}>
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
            <div class="markup"></div>
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
    </ChannelItemWrapper>
  )
}

