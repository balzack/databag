import React, { useState, useEffect, useRef } from 'react';
import { CarouselWrapper } from './Carousel.styled';
import { CloseOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';

export function Carousel({ pad, items, itemRenderer, itemRemove }) {
  const [slots, setSlots] = useState([]);

  let carousel = useRef();

  const RemoveItem = ({ index }) => {
    if (itemRemove) {
      return <div class="delitem" onClick={() => itemRemove(index)}><CloseOutlined /></div>
    }
    return <></>
  }

  useEffect(() => {
    let assets = [];
    for (let i = 0; i < items.length; i++) {
      assets.push((
        <ReactResizeDetector handleWidth={true} handleHeight={false}>
          {({ width, height }) => {
            return (
              <div class="item">
                <div class="asset">{ itemRenderer(items[i], i) }</div>
                <RemoveItem index={i} />
              </div>
            );
          }}
        </ReactResizeDetector>
      ));
    }
    if (items.length > 0) {
      assets.push(<div class="space"></div>)
    }
    setSlots(assets);
  }, [items, itemRenderer]);

  return (
    <CarouselWrapper>
      <div class="carousel" style={{ paddingLeft: pad + 32 }} ref={carousel}>
        {slots}
      </div>
    </CarouselWrapper>
  );
}
 
