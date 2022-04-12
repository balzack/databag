import React, { useState, useEffect, useRef } from 'react';
import { AddCarouselWrapper } from './AddCarousel.styled';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';

import login from '../../../../login.png';
import test from '../../../../test.png';

export function AddCarousel({ state, actions }) {
  const [items, setItems] = useState([]);

  let carousel = useRef();
  let itemWidth = useRef(new Map());
  let itemIndex = useRef(0);
  let itemCount = useRef(0);
  const [scrollLeft, setScrollLeft] = useState('hidden');
  const [scrollRight, setScrollRight] = useState('hidden');

  const onLeft = () => {
    console.log(itemIndex.current);
    if (itemIndex.current > 0) {
      itemIndex.current -= 1;
      setScroll();
    }
  }

  const onRight = () => {
    console.log(itemIndex.current);
    if(itemIndex.current + 1 < itemCount.current) {
      itemIndex.current += 1;
      setScroll();
    }
  }

  const setScroll = () => {
    console.log(">>", itemIndex.current);
    let pos = 0;
    for (let i = 0; i < itemIndex.current; i++) {
      pos += itemWidth.current.get(i) + 32;
    }
    carousel.current.scrollTo({ top: 0, left: pos, behavior: 'smooth' });
    setArrows();
  }

  const setArrows = () => {
    if (itemIndex.current == 0) {
      setScrollLeft('hidden');
    }
    else {
      setScrollLeft('unset');
    }
    if (itemIndex.current + 1 >= itemCount.current) {
      setScrollRight('hidden');
    }
    else {
      setScrollRight('unset');
    }
  }

  useEffect(() => {
    if (state.assets == null || state.assets.length == 0) {
      setItems([]);
      return;
    }
    let assets = [];
    for (let i = 0; i < 10; i++) {
      assets.push((
        <ReactResizeDetector handleWidth={true} handleHeight={false}>
          {({ width, height }) => {
            itemWidth.current.set(i, width);
            if (i % 2 == 0) {
              return <div class="item"><img class="object" src={login} alt="" /></div>
            }
            return <div class="item"><img class="object" src={test} alt="" /></div>
          }}
        </ReactResizeDetector>
      ));
    }
    itemCount.current = assets.length;
    if (itemIndex.current >= itemCount.current) {
      itemIndex.current = itemCount.current - 1;
    }
    setItems(assets);
    setArrows();
  }, [state]);

  if (items.length != 0) {
    return (
      <AddCarouselWrapper>
        <div class="carousel" ref={carousel}>
          {items}
        </div>
        <div class="arrows">
          <div class="arrow" style={{ visibility: scrollLeft }} onClick={onLeft}><LeftOutlined /></div>
          <div class="arrow" style={{ visibility: scrollRight }} onClick={onRight}><RightOutlined /></div>
        </div>
      </AddCarouselWrapper>
    );
  }
  return <></>

}
 
