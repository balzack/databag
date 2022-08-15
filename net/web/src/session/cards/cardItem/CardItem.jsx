import { CardItemWrapper, StatusError,
        StatusConnected, StatusConnecting, 
        StatusRequested, StatusPending, 
        StatusConfirmed} from './CardItem.styled';
import { useCardItem } from './useCardItem.hook';
import { Logo } from 'logo/Logo';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export function CardItem({ item }) {

  const { state, actions } = useCardItem(item);  
  const profile = item?.data?.cardProfile;
  const detail = item?.data?.cardDetail;

  const handle = () => {
    if (profile?.node) {
      return profile.handle + '@' + profile.node;
    }
    return profile?.handle;
  }

  return (
    <CardItemWrapper>
      <Logo url={state.logo} width={32} height={32} radius={8} />
      <div class="details">
        <div class="name">{ profile?.name }</div>
        <div class="handle">{ handle() }</div>
      </div>
      <div class="markup">
        { !state.resync && item.error && (
          <Tooltip placement="left" title="sync error">
            <StatusError onClick={actions.resync}>
              <ExclamationCircleOutlined />
            </StatusError>
          </Tooltip>
        )}
        { detail?.status === 'connected' && (
          <Tooltip placement="left" title="connected contact">
            <StatusConnected />
          </Tooltip>
        )}
        { detail?.status === 'requested' && (
          <Tooltip placement="left" title="connection requested by contact">
            <StatusRequested />
          </Tooltip>
        )}
        { detail?.status === 'connecting' && (
          <Tooltip placement="left" title="requested contact connection">
            <StatusConnecting />
          </Tooltip>
        )}
        { detail?.status === 'pending' && (
          <Tooltip placement="left" title="unknwon contact connection request">
            <StatusPending />
          </Tooltip>
        )}
        { detail?.status === 'confirmed' && (
          <Tooltip placement="left" title="disconnected contact">
            <StatusConfirmed />
          </Tooltip>
        )}
      </div>
    </CardItemWrapper>
  );
}
