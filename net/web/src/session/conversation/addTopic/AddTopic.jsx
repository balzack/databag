import { AddTopicWrapper } from './AddTopic.styled';
import { useAddTopic } from './useAddTopic.hook';
import { Input } from 'antd';
import { useRef, useState } from 'react';
import { FontColorsOutlined, FontSizeOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

export function AddTopic() {

  const [hint, setHint] = useState("send");
  const msg = useRef();

  const keyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      msg.current.blur();
      console.log("SEND");
    }
  }

  return (
    <AddTopicWrapper>
      <div class="carousel"></div>
      <div class="message">
        <Input.TextArea ref={msg} placeholder="New Message" spellCheck="true" autoSize={{ minRows: 2, maxRows: 6 }}
            autocapitalize="none" enterkeyhint="send" onKeyDown={(e) => keyDown(e)} />
      </div>
      <div class="buttons">
        <div class="button space"><PaperClipOutlined /></div>
        <div class="button space"><FontSizeOutlined /></div>
        <div class="button space"><FontColorsOutlined /></div>
        <div class="end">
          <div class="button"><SendOutlined /></div>
        </div>
      </div>
    </AddTopicWrapper>
  );
}

