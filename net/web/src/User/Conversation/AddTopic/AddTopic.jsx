import React, { useState } from 'react';
import { Button, Dropdown, Input, Tooltip, Menu } from 'antd';
import { AddTopicWrapper, BusySpin } from './AddTopic.styled';
import { Carousel } from '../../../Carousel/Carousel';
import { useAddTopic } from './useAddTopic.hook';
import { BgColorsOutlined, FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

import login from '../../../login.png';
import test from '../../../test.png';


export function AddTopic() {

  let [ items, setItems] = useState([]);
  const { state, actions } = useAddTopic();

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <div onClick={() => setItems([test, login, login, test, test, login])}>Attach Image</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={() => setItems([test, login, login, test, test, login])}>Attach Video</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => setItems([test, login, login, test, test, login])}>Attach Audio</div>
      </Menu.Item>
    </Menu>
  );

  const onSend = () => {
    actions.addTopic();
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (state.messageText) {
        actions.addTopic();
      }
    }
  }

  return (
    <AddTopicWrapper>
      <div class="container noselect">
        <Carousel items={items} itemRenderer={(item) => {
          return <img style={{ height: '100%', objectFit: 'contain' }} src={item} alt="" />
        }} />
        <div class="input">
          <Input.TextArea placeholder="Message" autoSize={{ minRows: 2, maxRows: 6 }} onKeyPress={onKey}
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
 
