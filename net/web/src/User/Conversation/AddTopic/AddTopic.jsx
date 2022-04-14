import React from 'react';
import { Button, Dropdown, Input, Tooltip, Menu } from 'antd';
import { AddTopicWrapper, BusySpin } from './AddTopic.styled';
import { AddCarousel } from './AddCarousel/AddCarousel';
import { useAddTopic } from './useAddTopic.hook';
import { BgColorsOutlined, FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

export function AddTopic() {

  const { state, actions } = useAddTopic();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div onClick={() => actions.addImage()}>Attach Image</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={() => actions.addVideo()}>Attach Video</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => actions.addAudio()}>Attach Audio</div>
      </Menu.Item>
    </Menu>
  );

  const onSend = () => {
    actions.addTopic();
  }

  return (
    <AddTopicWrapper>
      <div class="container noselect">
        <AddCarousel state={state} actions={actions} />
        <div class="input">
          <Input.TextArea placeholder="Message" autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={(e) => actions.setMessageText(e.target.value)} value={state.messageText} />
        </div>
        <div class="buttons">
          <div class="option">
            <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topRight">
              <Button icon={<PaperClipOutlined />} size="large" />
            </Dropdown>
          </div>
          <div class="option">
            <Button icon={<FontSizeOutlined />} size="large" />
          </div>
          <div class="option">
            <Button icon={<FontColorsOutlined />} size="large" />
          </div>
          <div class="option">
            <Button icon={<BgColorsOutlined />} size="large" />
          </div>
          <div class="send">
            <Button icon={<SendOutlined />} onClick={onSend} size="large" />
            <BusySpin spinning={state.busy} />
          </div>
        </div>
      </div>
    </AddTopicWrapper>
  );

}
 
