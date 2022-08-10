import { ChannelItemWrapper } from './ChannelItem.styled';
import { Logo } from 'logo/Logo';
import { AppstoreFilled, SolutionOutlined } from '@ant-design/icons';

export function ChannelItem({ item }) {

console.log(item.contacts);

  return (
    <ChannelItemWrapper>
      { item.contacts.length === 0 && (
        <div class="item">
          <div class="logo">
            <SolutionOutlined />
          </div>
          <div class="subject">{ item.subject }</div>
        </div>
      )}
      { item.contacts.length === 1 && (
        <div class="item">
          <Logo url={item.logo} width={32} height={32} radius={8} />
          <div class="subject">{ item.subject }</div>
          <div class="markup"></div>
        </div>
      )}
      { item.contacts.length > 1 && (
        <div class="item">
          <div class="logo">
            <AppstoreFilled />
          </div>
          <div class="subject">{ item.subject }</div>
          <div class="markup"></div>
        </div>
      )}
    </ChannelItemWrapper>
  )
}

