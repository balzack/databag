import React, { useState, useEffect, useRef } from 'react';
import { CarouselWrapper } from './Carousel.styled';
import { CloseOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';
interface Props {
  pad?:any
   items?:any
   itemRenderer?:any
   itemRemove?:any

}
export function Carousel({ pad, items, itemRenderer, itemRemove }:Props) {
  const [slots, setSlots] = useState([]);

  let carousel = useRef<any>();

  const RemoveItem = ({ index }) => {
    if (itemRemove) {
      return <div className="delitem" onClick={() => itemRemove(index)}><CloseOutlined /></div>
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
              <div className="item noselect">
                <div className="asset">{ itemRenderer(items[i], i) }</div>
                <RemoveItem index={i} />
              </div>
            );
          }}
        </ReactResizeDetector>
      ));
    }
    if (items.length > 0) {
      assets.push(<div className="space"></div>)
    }
    setSlots(assets);
  }, [items, itemRenderer]);

  return (
    <CarouselWrapper>
      <div className="carousel" style={{ paddingLeft: pad + 32 }} ref={carousel}>
        {slots}
      </div>
    </CarouselWrapper>
  );
}
 
