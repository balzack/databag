import React, { useState, useEffect, useRef } from 'react'
import { CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useConversation } from './useConversation.hook';
import { Button, Checkbox, Modal } from 'antd'
import { ConversationWrapper, CloseButton, ListItem } from './Conversation.styled';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List } from 'react-virtualized';

export function Conversation() {

  const [ scrollIndex, setScrollIndex ] = useState(null);
  const { state, actions } = useConversation();

  const cache = new CellMeasurerCache({
    defaultHeight: 50,
    fixedWidth: true
  });

  useEffect(() => {
  })

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
        <div ref={registerChild} style={style}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/XX4VTIOtkPQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

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
      <div class="container">
    <div style={{ flex: '1 1 auto' }}>
    <AutoSizer>
      {({height, width}) => (
        <List
          width={width}
          height={height}
      deferredMeasurementCache={cache}
      rowHeight={cache.rowHeight}
          rowRenderer={renderRow}
          rowCount={999}
        overscanRowCount={16}
        scrollToIndex={scrollIndex}
        />
      )}
    </AutoSizer>
    </div>
      </div>
    </ConversationWrapper>
  )
}

