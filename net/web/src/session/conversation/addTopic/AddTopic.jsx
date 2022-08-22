import { AddTopicWrapper } from './AddTopic.styled';
import { useAddTopic } from './useAddTopic.hook';
import { Input, Menu, Dropdown } from 'antd';
import { useRef, useState } from 'react';
import { FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';
import { SketchPicker } from "react-color";

export function AddTopic() {

  const { state, actions } = useAddTopic();

  const msg = useRef();
  const keyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      msg.current.blur();
    }
  }

  const picker = (
    <Menu style={{ backgroundColor: 'unset', boxShadow: 'unset' }}>
      <SketchPicker disableAlpha={true}
        color={state.textColor}
        onChange={(color) => {
          actions.setTextColor(color.hex);
        }} />
    </Menu>
  );

  const sizer = (
    <Menu>
      <Menu.Item key={8}><div onClick={() => actions.setTextSize(8)}>Small</div></Menu.Item>
      <Menu.Item key={14}><div onClick={() => actions.setTextSize(14)}>Medium</div></Menu.Item>
      <Menu.Item key={20}><div onClick={() => actions.setTextSize(20)}>Large</div></Menu.Item>
    </Menu>
  );

  const attacher = (
    <Menu>
      <Menu.Item key="0">
        <div>Add Image</div>
      </Menu.Item>
      <Menu.Item key="1">
        <div>Add Video</div>
      </Menu.Item>
      <Menu.Item key="2">
        <div>Add Audio</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <AddTopicWrapper>
      <div class="carousel"></div>
      <div class="message">
        <Input.TextArea ref={msg} placeholder="New Message" spellCheck="true" autoSize={{ minRows: 2, maxRows: 6 }}
            autocapitalize="none" enterkeyhint="send" onKeyDown={(e) => keyDown(e)} />
      </div>
      <div class="buttons">
        <div class="button space">
          <Dropdown overlay={attacher} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topLeft">
            <PaperClipOutlined />
          </Dropdown>
        </div> 
        <div class="button space">
          <Dropdown overlay={sizer} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topLeft">
            <FontSizeOutlined />
          </Dropdown>
        </div>
        <div class="button space">
          <Dropdown overlay={picker} overlayStyle={{ minWidth: 0 }} trigger={['click']} placement="topLeft">
            <FontColorsOutlined />
          </Dropdown>
        </div>
        <div class="end">
          <div class="button"><SendOutlined /></div>
        </div>
      </div>
    </AddTopicWrapper>
  );
}

