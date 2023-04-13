import { CardItemWrapper, StatusError,
        StatusConnected, StatusConnecting, 
        StatusRequested, StatusPending, 
        StatusConfirmed, ComOptions } from './CardItem.styled';
import { Logo } from 'logo/Logo';
import { Tooltip } from 'antd';
import { MessageOutlined, PhoneOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export function CardItem({ item, tooltip, enableIce, resync, open, call, message }) {

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
        { item.offsync && !item.tooltip && (
          <StatusError onClick={onResync}>
            <ExclamationCircleOutlined />
          </StatusError>
        )}
        { item.offsync && item.tooltip && (
          <Tooltip placement="left" title="sync error">
            <StatusError onClick={onResync}>
              <ExclamationCircleOutlined />
            </StatusError>
          </Tooltip>
        )}
        { item.status === 'connected' && (
          <ComOptions>
            <Tooltip className="option" placement="left" title="message contact">
              <MessageOutlined onClick={onMessage} />
            </Tooltip>
            { enableIce && (
              <Tooltip className="option" placement="left" title="call contact">
                <PhoneOutlined onClick={onCall} />
              </Tooltip>
            )}
          </ComOptions>
        )}
        { item.status === 'connected' && (
          <Tooltip placement="left" title="connected contact">
            <StatusConnected />
          </Tooltip>
        )}
        { item.status === 'requested' && (
          <Tooltip placement="left" title="connection requested by contact">
            <StatusRequested />
          </Tooltip>
        )}
        { item.status === 'connecting' && (
          <Tooltip placement="left" title="requested contact connection">
            <StatusConnecting />
          </Tooltip>
        )}
        { item.status === 'pending' && (
          <Tooltip placement="left" title="unknwon contact connection request">
            <StatusPending />
          </Tooltip>
        )}
        { item.status === 'confirmed' && (
          <Tooltip placement="left" title="disconnected contact">
            <StatusConfirmed />
          </Tooltip>
        )}
      </div>
    </CardItemWrapper>
  );
}
