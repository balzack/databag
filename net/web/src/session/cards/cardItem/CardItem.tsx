import { CardItemWrapper, StatusError,
        StatusConnected, StatusConnecting, 
        StatusRequested, StatusPending, 
        StatusConfirmed, ComOptions } from './CardItem.styled';
import { Logo } from 'logo/Logo';
import { Tooltip } from 'antd';
import { MessageOutlined, PhoneOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export function CardItem({ item, tooltip, enableIce, resync, open, call, message, display, canMessage, strings }) {

  const onResync = (e) => {
    e.stopPropagation();
    resync();
  };

  const onMessage = (e) => {
    e.stopPropagation();
    message();
  }

  const onCall = (e) => {
    e.stopPropagation();
    call();
  }

  return (
    <CardItemWrapper onClick={open}>
      <Logo url={item.logo} width={32} height={32} radius={4} />
      <div className="details">
        <div className="name">{ item.name }</div>
        <div className="handle">{ item.handle }</div>
      </div>
      <div className="markup">
        { item.offsync && (
          <Tooltip placement="left" title={strings.syncError}>
            <StatusError onClick={onResync}>
              <ExclamationCircleOutlined />
            </StatusError>
          </Tooltip>
        )}
        { item.status === 'connected' && display === 'small' && (
          <ComOptions>
            { canMessage && (
              <div className="option">
                <MessageOutlined onClick={onMessage} />
              </div>
            )}
            { enableIce && (
              <div className="option">
                <PhoneOutlined onClick={onCall} />
              </div>
            )}
          </ComOptions>
        )}
        { item.status === 'connected' && display !== 'small' && (
          <ComOptions>
            { canMessage && (
              <Tooltip className="option" placement="left" title={strings.messageTip}>
                <MessageOutlined onClick={onMessage} />
              </Tooltip>
            )}
            { enableIce && (
              <Tooltip className="option" placement="left" title={strings.callTip}>
                <PhoneOutlined onClick={onCall} />
              </Tooltip>
            )}
          </ComOptions>
        )}
        { item.status === 'connected' && (
          <Tooltip placement="left" title={strings.connectedTip}>
            <StatusConnected />
          </Tooltip>
        )}
        { item.status === 'requested' && (
          <Tooltip placement="left" title={strings.requestedTip}>
            <StatusRequested />
          </Tooltip>
        )}
        { item.status === 'connecting' && (
          <Tooltip placement="left" title={strings.connectingTip}>
            <StatusConnecting />
          </Tooltip>
        )}
        { item.status === 'pending' && (
          <Tooltip placement="left" title={strings.pendingTip}>
            <StatusPending />
          </Tooltip>
        )}
        { item.status === 'confirmed' && (
          <Tooltip placement="left" title={strings.confirmedTip}>
            <StatusConfirmed />
          </Tooltip>
        )}
      </div>
    </CardItemWrapper>
  );
}
