import { TopicItemWrapper } from './TopicItem.styled';
import { useTopicItem } from './useTopicItem.hook';
import { VideoAsset } from './videoAsset/VideoAsset';
import { AudioAsset } from './audioAsset/AudioAsset';
import { ImageAsset } from './imageAsset/ImageAsset';
import { Logo } from 'logo/Logo';
import { Space, Skeleton, Button, Modal, Input } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined, FireOutlined, PictureOutlined } from '@ant-design/icons';
import { Carousel } from 'carousel/Carousel';

export function TopicItem({ host, topic }) {

  return (
    <TopicItemWrapper>
      <div class="topic-header">
        <div class="avatar">
          <Logo width={32} height={32} radius={4} url={topic.imageUrl} />
        </div>
        <div class="info">
          <div class={ topic.nameSet ? 'set' : 'unset' }>{ topic.name }</div>
          <div>{ topic.createdStr }</div>
        </div>
      </div>
      <div class="message">
        <div style={{ color: topic.textColor, fontSize: topic.textSize }}>{ topic.text }</div>
      </div>
    </TopicItemWrapper>
  )
}

