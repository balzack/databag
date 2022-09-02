import { TopicItemWrapper } from './TopicItem.styled';
import { useTopicItem } from './useTopicItem.hook';
import { VideoAsset } from './videoAsset/VideoAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { ImageAsset } from './imageAsset/ImageAsset';
import { Logo } from 'logo/Logo';
import { Space, Skeleton, Button, Modal, Input } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined, FireOutlined, PictureOutlined } from '@ant-design/icons';
import { Carousel } from 'carousel/Carousel';
import { useState, useEffect } from 'react';

export function TopicItem({ host, topic }) {

  const { state, actions } = useTopicItem(topic);

  // not sure why this helps, on mobile render updates not occuring without
  // eslint-disable-next-line
  const [render, setRender] = useState(false);
  useEffect(() => {
    if (state.ready && state.confirmed) {
      setRender(true);
    }
  }, [state.ready, state.confirmed]);

  let name = state.name ? state.name : state.handle;
  let nameClass = state.name ? 'set' : 'unset';
  if (name == null) {
    name = "unknown contact"
    nameClass = "unknown"
  }

  const renderAsset = (asset, idx, topicId) => {
    if (asset.image) {
      return <ImageAsset thumbUrl={actions.getAssetUrl(asset.image.thumb, topicId)}
          fullUrl={actions.getAssetUrl(asset.image.full, topicId)} />
    }
    if (asset.video) {
      return <VideoAsset thumbUrl={actions.getAssetUrl(asset.video.thumb, topicId)}
          lqUrl={actions.getAssetUrl(asset.video.lq, topicId)} hdUrl={actions.getAssetUrl(asset.video.hd, topicId)} />
    }
    if (asset.audio) {
      return <AudioAsset label={asset.audio.label} audioUrl={actions.getAssetUrl(asset.audio.full, topicId)} />
    }
    return <></>
  }

  const removeTopic = () => {
    Modal.confirm({
      title: 'Do you want to delete this message?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes, Delete',
      cancelText: 'No, Cancel',
      onOk() { actions.removeTopic() },
    });
  }

  const Options = () => {
    if (state.editing) {
      return <></>;
    }
    if (state.owner) {
      return (
        <div class="buttons">
          <div class="button" onClick={() => actions.setEditing(true)}>
            <EditOutlined />
          </div>
          <div class="button" onClick={() => removeTopic()}>
            <DeleteOutlined />
          </div>
        </div>
      );
    }
    if (host) {
      return (
        <div class="buttons">
          <div class="button" onClick={() => removeTopic()}>
            <DeleteOutlined />
          </div>
        </div>
      );
    }
    return <></>;
  }

  const Message = () => {
    if (state.editing) {
      return (
        <div class="editing">
          <Input.TextArea defaultValue={state.message?.text} placeholder="message"
            style={{ resize: 'none', color: state.textColor, fontSize: state.textSize }}
            onChange={(e) => actions.setEdit(e.target.value)} rows={3} bordered={false}/>
          <div class="controls">
          <Space>
            <Button onClick={() => actions.setEditing(false)}>Cancel</Button>
            <Button type="primary" onClick={() => actions.setMessage()} loading={state.body}>Save</Button>
          </Space>
          </div>
        </div>
      );
    }
    return <div style={{ color: state.textColor, fontSize: state.textSize }}>{ state.message?.text }</div>
  }

  return (
    <TopicItemWrapper>
      { state.init && (
        <>
          <div class="topic-header">
            <div class="avatar">
              <Logo width={32} height={32} radius={4} url={state.imageUrl} />
            </div>
            <div class="info">
              <div class={nameClass}>{ name }</div>
              <div>{ state.created }</div>
            </div>
            <div class="topic-options">
              <Options />
            </div>
          </div>
          { !state.confirmed && (
            <div>
              <div class="message">
                <Skeleton size={'small'} active={true} />
              </div>
            </div>
          )}
          { state.confirmed && (
            <div>
              { state.error && (
                <div class="asset-placeholder">
                  <FireOutlined style={{ fontSize: 32, color: '#ff8888' }} />
                </div>
              )}
              { !state.error && !state.ready && (
                <div class="asset-placeholder">
                  <PictureOutlined style={{ fontSize: 32 }} />
                </div>
              )}
              { !state.error && state.ready && state.assets.length > 0 && (
                <div class="topic-assets">
                  <Carousel pad={40} items={state.assets} itemRenderer={renderAsset} />
                </div>
              )}
              <div class="message">
                <Message />
              </div>
            </div>
          )}
        </>
      )}
    </TopicItemWrapper>
  )
}

