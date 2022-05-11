import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from 'antd';
import { CarouselWrapper } from './Carousel.styled';
import { RightOutlined, LeftOutlined, CloseOutlined } from '@ant-design/icons';
import ReactResizeDetector from 'react-resize-detector';

import login from '../login.png';
import test from '../test.png';

export function Carousel({ ready, items, itemRenderer, itemRemove }) {
  const [slots, setSlots] = useState([]);
  const [carouselRef, setCarouselRef] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const [scrollLeft, setScrollLeft] = useState('hidden');
  const [scrollRight, setScrollRight] = useState('hidden');
  const FUDGE = 1;

  let carousel = useRef();
  let itemWidth = useRef(new Map());

  useEffect(() => {
    setScroll('smooth');
    setArrows();
  }, [itemIndex, items]);

  useEffect(() => {
    setScroll('auto');
  }, [carouselRef]);

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

  const setScroll = (behavior) => {
    let pos = FUDGE;
    for (let i = 0; i < itemIndex; i++) {
      pos += itemWidth.current.get(i) + 32;
    }
    if (carousel.current) {
      carousel.current.scrollTo({ top: 0, left: pos, behavior });
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

  const RemoveItem = ({ index }) => {
    if (itemRemove) {
      return <div class="delitem" onClick={() => itemRemove(index)}><CloseOutlined /></div>
    }
    return <></>
  }

  useEffect(() => {
    let assets = [];
    if (ready) {
      for (let i = 0; i < items.length; i++) {
        assets.push((
          <ReactResizeDetector handleWidth={true} handleHeight={false}>
            {({ width, height }) => {
              itemWidth.current.set(i, width);
              return (
                <div class="item noselect">
                  <div class="asset">{ itemRenderer(items[i], i) }</div>
                  <RemoveItem index={i} />
                </div>
              );
            }}
          </ReactResizeDetector>
        ));
      }
      if (items.length > 0) {
        assets.push(<div class="space">&nbsp;</div>)
      }
      if (itemIndex >= items.length) {
        if (items.length > 0) {
          setItemIndex(items.length - 1);
        }
        else {
          setItemIndex(0);
        }
      }
    }
    
    setSlots(assets);
    setScroll();
    setArrows();
  }, [ready, items]);

  const onRefSet = (r) => {
    if (r != null) {
      carousel.current = r;
      setCarouselRef(true);
    }
  }

  if (!ready) {
    return (
      <CarouselWrapper>
        <div class="carousel">
          <Skeleton.Image style={{ height: 128 }} />
        </div>
        <div class="arrows">
          <div class="arrow" onClick={onRight}><LeftOutlined style={{ visibility: 'hidden' }} /></div>
          <div class="arrow" onClick={onLeft}><RightOutlined style={{ visibility: 'hidden' }} /></div>
        </div>
      </CarouselWrapper>
    )
  }

  if (slots.length != 0) {
    return (
      <CarouselWrapper>
        <div class="carousel" ref={onRefSet}>
          {slots}
        </div>
        <div class="arrows">
          <div class="arrow" onClick={onRight}><LeftOutlined style={{ visibility: scrollRight }} /></div>
          <div class="arrow" onClick={onLeft}><RightOutlined style={{ visibility: scrollLeft }} /></div>
        </div>
      </CarouselWrapper>
    );
  }
  return <></>

}
 
