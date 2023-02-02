import { useChannelHeader } from './useChannelHeader.hook';
import { ChannelHeaderWrapper, StatusError } from './ChannelHeader.styled';
import { ExclamationCircleOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Logo } from 'logo/Logo';

export function ChannelHeader({ closeConversation, openDetails, contentKey }) {

  const { state, actions } = useChannelHeader(contentKey);

  return (
    <ChannelHeaderWrapper>
      <div class="title">
        <div class="logo">
          <Logo img={state.img} url={state.logo} width={32} height={32} radius={4} />
        </div>
        { state.title && (
          <div class="label">{ state.title }</div>
        )}
        { !state.title && (
          <div class="label">{ state.label }</div>
        )}
        { state.error && state.display === 'small' && (
          <StatusError onClick={actions.resync}>
            <ExclamationCircleOutlined />
          </StatusError>
        )}
        { state.error && state.display !== 'small' && (
          <Tooltip placement="bottom" title="sync error">
            <StatusError onClick={actions.resync}>
              <ExclamationCircleOutlined />
            </StatusError>
          </Tooltip>
        )}
        { state.display !== 'xlarge' && (
          <div class="button" onClick={openDetails}>
            <SettingOutlined />
          </div>
        )}
      </div>
      { state.display !== 'xlarge' && (
        <div class="button" onClick={closeConversation}>
          <CloseOutlined />
        </div>
      )}
    </ChannelHeaderWrapper>
  );
}
