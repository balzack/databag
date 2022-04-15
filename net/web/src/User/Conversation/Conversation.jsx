import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ConversationWrapper, CloseButton, ListItem } from './Conversation.styled';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';
import { AddTopic } from './AddTopic/AddTopic';

export function Conversation() {

  const [ scrollIndex, setScrollIndex ] = useState(null);
  const { state, actions } = useConversation();

  const cache = new CellMeasurerCache({
    defaultHeight: 256,
    fixedWidth: true
  });

  useEffect(() => {
    setScrollIndex(state.topics.length);
  }, [state])

  const renderRow = ({ index, isScrolling, key, parent, style }) => {

    return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure, registerChild }) => (
        // 'style' attribute required to position cell (within parent List)
        <div class="noselect" ref={registerChild} style={style}>
          { state.topics[index].data.topicDetail.data }
        </div>
      )}
    </CellMeasurer>
  );
  }

  return (
    <ConversationWrapper>
      <div class="header">
        <div class="title">{ state.handle }</div>
        <CloseButton type="text" class="close" size={'large'} onClick={() => actions.close()} icon={<CloseOutlined />} />
      </div>
      <div class="thread">
        <div style={{ flex: '1 1 auto' }}>
          <AutoSizer>
            {({height, width}) => (
              <List
                width={width}
                height={height}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowRenderer={renderRow}
                rowCount={state.topics.length}
                overscanRowCount={16}
                scrollToIndex={scrollIndex}
              />
            )}
          </AutoSizer>
        </div>
      </div>
      <AddTopic />
    </ConversationWrapper>
  )
}

