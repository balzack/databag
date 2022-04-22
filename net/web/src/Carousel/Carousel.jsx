import React, { useState, useEffect, useRef } from 'react';
import { CarouselWrapper } from './Carousel.styled';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';

import login from '../login.png';
import test from '../test.png';

export function Carousel({ items, itemRenderer }) {
  const [slots, setSlots] = useState([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [scrollLeft, setScrollLeft] = useState('hidden');
  const [scrollRight, setScrollRight] = useState('hidden');

  let carousel = useRef();
  let itemWidth = useRef(new Map());

  useEffect(() => {
    setScroll();
    setArrows();
  }, [itemIndex, items]);

  const updateItemIndex = (val) => {
    setItemIndex((i) => {
      if (i + val < 0) {
        return 0;
      }
      return i + val;
    })
  }

  const onLeft = () => {
    if (itemIndex > 0) {
      updateItemIndex(-1);
    }
  }

  const onRight = () => {
    if(itemIndex + 1 < items.length) {
      updateItemIndex(+1);
    }
  }

  const setScroll = () => {
    let pos = 0;
    for (let i = 0; i < itemIndex; i++) {
      pos += itemWidth.current.get(i) + 32;
    }
    if (carousel.current) {
      carousel.current.scrollTo({ top: 0, left: pos, behavior: 'smooth' });
    }
  }

  const setArrows = () => {
    if (itemIndex == 0) {
      setScrollLeft('hidden');
    }
    else {
      setScrollLeft('unset');
    }
    if (itemIndex + 1 >= items.length) {
      setScrollRight('hidden');
    }
    else {
      setScrollRight('unset');
    }
  }

  useEffect(() => {
    let assets = [];
    for (let i = 0; i < items.length; i++) {
      assets.push((
        <ReactResizeDetector handleWidth={true} handleHeight={false}>
          {({ width, height }) => {
            itemWidth.current.set(i, width);
            return <div class="item noselect">{ itemRenderer(items[i]) }</div>
          }}
        </ReactResizeDetector>
      ));
    }
    if (itemIndex >= items.length) {
      if (items.length > 0) {
        setItemIndex(items.length - 1);
      }
      else {
        setItemIndex(0);
      }
    }
    
    setSlots(assets);
    setScroll();
    setArrows();
  }, [items]);

  if (slots.length != 0) {
    return (
      <CarouselWrapper>
        <div class="carousel" ref={carousel}>
          {slots}
        </div>
        <div class="arrows">
          <div class="arrow" style={{ visibility: scrollLeft }} onClick={onLeft}><LeftOutlined /></div>
          <div class="arrow" style={{ visibility: scrollRight }} onClick={onRight}><RightOutlined /></div>
        </div>
      </CarouselWrapper>
    );
  }
  return <></>

}
 
