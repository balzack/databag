import React from 'react';
import { Button, Dropdown, Input, Tooltip, Menu } from 'antd';
import { AddTopicWrapper } from './AddTopic.styled';
import { AddCarousel } from './AddCarousel/AddCarousel';
import { useAddTopic } from './useAddTopic.hook';
import { BgColorsOutlined, FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

export function AddTopic() {

  const { state, actions } = useAddTopic();

  const onAttach = () => {
    console.log("ADD IMAGE");
    actions.addImage(null);
  }

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
      <Menu.Item key="3">
        <div onClick={() => actions.addIframe()}>Embed Link</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <AddTopicWrapper>
      <div class="container">
        <AddCarousel state={state} actions={actions} />
        <div class="input">
          <Input.TextArea placeholder="Message" autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={(e) => actions.setMessageText(e.target.value)} value={state.messageText} />
        </div>
        <div class="buttons">
          <div class="option">
            <Dropdown overlay={menu} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topRight">
              <Button icon={<PaperClipOutlined />} size="medium" />
            </Dropdown>
          </div>
          <div class="option">
            <Button icon={<FontSizeOutlined />} size="medium" />
          </div>
          <div class="option">
            <Button icon={<FontColorsOutlined />} size="medium" />
          </div>
          <div class="option">
            <Button icon={<BgColorsOutlined />} size="medium" />
          </div>
          <div class="send">
            <Button icon={<SendOutlined />} size="medium" />
          </div>
        </div>
      </div>
    </AddTopicWrapper>
  );

}
 
