import { TopicItemWrapper } from './TopicItem.styled';
import { VideoAsset } from './videoAsset/VideoAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { ImageAsset } from './imageAsset/ImageAsset';
import { BinaryAsset } from './binaryAsset/BinaryAsset';
import { Logo } from 'logo/Logo';
import { Space, Skeleton, Button, Modal, Input } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined, FireOutlined, PictureOutlined } from '@ant-design/icons';
import { Carousel } from 'carousel/Carousel';
import { useTopicItem } from './useTopicItem.hook';

export function TopicItem({ host, contentKey, sealed, topic, update, remove, strings, colors, menuStyle }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useTopicItem(topic, contentKey);

  const removeTopic = () => {
    modal.confirm({
      title: <span style={menuStyle}>{strings.deleteMessage}</span>,
      content: <span style={menuStyle}>{strings.messageHint}</span>,
      bodyStyle: { borderRadius: 8, padding: 16, ...menuStyle },
      icon: <ExclamationCircleOutlined />,
      okText: strings.remove,
      cancelText: strings.cancel,
      onOk:  async () => {
        try {
          await remove();
        }
        catch(err) {
          console.log(err);
          modal.error({
            title: <span style={menuStyle}>{strings.operationFailed}</span>,
            content: <span style={menuStyle}>{strings.tryAgain}</span>,
            bodyStyle: { borderRadius: 8, padding: 16, ...menuStyle },
          });
        }
      },
    });
  }

  const updateTopic = async () => {
    try {
      await update(state.message);
      actions.clearEditing();
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: <span style={menuStyle}>{strings.operationFailed}</span>,
        content: <span style={menuStyle}>{strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...menuStyle },
      });
    }
  };

  const renderAsset = (asset, idx) => {
    if (asset.type === 'image') {
      return <ImageAsset asset={asset} />
    }
    if (asset.type === 'video') {
      return <VideoAsset asset={asset} />
    }
    if (asset.type === 'audio') {
      return <AudioAsset asset={asset} />
    }
    if (asset.type === 'binary') {
      return <BinaryAsset asset={asset} />
    }
    return <></>
  }

  return (
    <TopicItemWrapper>
      { modalContext }
      <div className="topic-header">
        <div className="avatar">
          <Logo width={32} height={32} radius={4} url={topic.imageUrl} />
        </div>
        <div className="info">
          <div className={ topic.nameSet ? 'set' : 'unset' }>{ topic.name }</div>
          <div>{ topic.createdStr }</div>
        </div>
        <div className="topic-options">
          <div className="buttons">
            { !sealed && topic.creator && (
              <div className="button edit" onClick={() => actions.setEditing(topic.text)}>
                <EditOutlined />
              </div>
            )}
            { (host || topic.creator) && (
              <div className="button remove" onClick={removeTopic}>
                <DeleteOutlined />
              </div>
            )}
          </div>
        </div>
      </div>
      { topic.status !== 'confirmed' && (
        <div className="skeleton">
          <Skeleton size={'small'} active={true} title={false} />
        </div>
      )}
      { topic.status === 'confirmed' && (
        <>
          { topic.assets?.length && (
            <>
              { topic.transform === 'error' && (
                <div className="asset-placeholder">
                  <FireOutlined style={{ fontSize: 32, color: colors.alertText }} />
                </div>
              )}
              { topic.transform === 'incomplete' && (
                <div className="asset-placeholder">
                  <PictureOutlined style={{ fontSize: 32 }} />
                </div>
              )}
              { topic.transform === 'complete' && (
                <div className="topic-assets">
                  <Carousel pad={40} items={state.assets} itemRenderer={renderAsset} />
                </div>
              )}
            </>
          )}
          { sealed && (
            <div className="sealed-message">{ strings.sealedMessage }</div>
          )}
          { !sealed && !state.editing && (
            <div className="message">
              <div style={{ color: topic.textColor ? topic.textColor : colors.mainText, fontSize: topic.textSize }}>{ topic.clickable }</div>
            </div>
          )}
          { state.editing && (
            <div className="editing">
              <Input.TextArea defaultValue={state.message} placeholder={strings.message}
                style={{ resize: 'none', color: state.textColor, fontSize: state.textSize }}
                onChange={(e) => actions.setMessage(e.target.value)} rows={3} bordered={false}/>
              <div className="controls">
                <Space>
                  <Button onClick={actions.clearEditing}>{ strings.cancel }</Button>
                  <Button type="primary" onClick={updateTopic}>{ strings.save }</Button>
                </Space>
              </div>
            </div>
          )}
        </>
      )}
    </TopicItemWrapper>
  )
}

