import { ChannelItemWrapper } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { AppstoreFilled, SolutionOutlined } from '@ant-design/icons';

export function ChannelItem({ item }) {

  return (
    <ChannelItemWrapper>
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
          <Logo url={item.logo} width={32} height={32} radius={8} />
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
            <div class="markup"></div>
          )}
        </div>
      )}
    </ChannelItemWrapper>
  )
}

