import React, { useRef, useState, useEffect } from 'react';
import { VirtualListWrapper } from './VirtualList.styled';
import ReactResizeDetector from 'react-resize-detector';
import { TopicItem } from './TopicItem/TopicItem';

export function VirtualList({ topics }) {

  const OVERSCAN = 300
  const DEFAULT_ITEM_HEIGHT = 64;
  const DEFAULT_LIST_HEIGHT = 1024;

  const [ viewHeight, setViewHeight ] = useState(DEFAULT_LIST_HEIGHT); 
  const [ canvasHeight, setCanvasHeight ] = useState(DEFAULT_LIST_HEIGHT*3);
  const [ scrolling, setScrolling ] = useState(false);
  const [ items, setItems ] = useState([]);

  let scrollTop = useRef(0);
  let containers = useRef([]);
  let anchor = useRef(null);
  let listRef = useRef();

  const addItemTop = (item) => {
    setItems((i) => { i.unshift(item); return [...i] });
  }

  const addItemBottom = (item) => {
    setItems((i) => { i.push(item); return [...i] });
  }

  const updateItem = (idx, item) => {
    setItems((i) => { i[idx] = item; return [...i] });
  }

  useEffect(() => {
    if (viewHeight * 3 > canvasHeight) {
      setCanvasHeight(viewHeight*3);
    }
    setTopics();
  }, [viewHeight]);

  useEffect(() => {
    setTopics();
  }, [topics]);

  const onScrollView = (e) => {

    // add or remove from overscan

    // clip to top or bottom

    // set or clear latch

    scrollTop.current = e.target.scrollTop;
  }

  const loadNextItem = () => {
    let view = getPlacement();
    if (view) {
      if (view.overscan.top < OVERSCAN) {
        if (containers.current[0].index > 0) {
          let container = {
            top: containers.current[0].top - DEFAULT_ITEM_HEIGHT,
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[0].index - 1,
          }
          anchor.current += 1;
          containers.current.unshift(container);
console.log("ADD ITEM BEFORE", container);
          addItemTop(getItem(container))
        }
      }
      if (view.overscan.bottom < OVERSCAN) {
        if (containers.current[containers.current.length - 1].index + 1 < topics.length) {
console.log("ADD ITEM AFTER");
          let container = {
            top: containers.current[containers.current.length - 1].top + containers.current[containers.current.length - 1].height,
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[containers.current.length - 1].index + 1,
          }
          containers.current.push(container);
          addItemBottom(getItem(container))
        }
      }
    }
  }

  const alignItems = () => {
    if (containers.current.length > 0) {
      let pos = null;

      pos = containers.current[anchor.current].top;
      for (let i = anchor.current - 1; i >= 0; i--) {
        pos -= containers.current[i].height;
        if (containers.current[i].top != pos) {
          containers.current[i].top = pos;
          updateItem(i, getItem(containers.current[i]));
        }
      }

      if (pos < 0) {
        // TODO reset canvas
        console.log("ALERT: reset convas");
      }

      pos = containers.current[anchor.current].top + containers.current[anchor.current].height;
      for (let i = anchor.current + 1; i < containers.current.length; i++) {
        if (containers.current[i].top != pos) {
          containers.current[i].top = pos;
          updateItem(i, getItem(containers.current[i]));
        }
        pos += containers.current[i].height;
      }

      if (pos > canvasHeight) {
        // TODO reset canvas
        console.log("ALERT: reset canvas");
      }

      let view = getPlacement();
      if (!scrolling) {
        if (view.position.height < viewHeight) {
          listRef.current.scrollTo({ top: view.position.top, left: 0, behavior: 'smooth' });
        }
        else {
          listRef.current.scrollTo({ top: view.position.bottom - viewHeight, left: 0, behavior: 'smooth' });
        }
      }
    }

    loadNextItem();
  }

  const setTopics = () => {
    // validate items

    if (topics.length > 0 && canvasHeight > 0) {
      let view = getPlacement();
      if (!view) {
        let pos = canvasHeight / 2;
        listRef.current.scrollTo({ top: pos, left: 0 });
        scrollTop.current = pos;

        let container = {
          top: pos - DEFAULT_ITEM_HEIGHT,
          height: DEFAULT_ITEM_HEIGHT,
          index: topics.length - 1,
        }

        anchor.current = 0;
        containers.current.push(container);
        addItemBottom(getItem(container));

        listRef.current.scrollTo({ top: container.top, left: 0, behavior: 'smooth' });
      }
      else {
        loadNextItem();
      }
    }
  }

  const onTopicHeight = (container, height) => {
    container.height = height;
    alignItems();
  }

  const getItem = (container) => {

    return (
      <div style={{ position: 'absolute', top: container.top }}>
      <TopicItem topic={topics[container.index]} onHeight={(height) => onTopicHeight(container, height)} />
      </div>
    )
  }

  const getPlacement = () => {
    if (containers.current.length == 0) {
      return null;
    }
    let top = containers.current[0].top;
    let bottom = containers.current[containers.current.length-1].top + containers.current[containers.current.length-1].height;
    let overTop = scrollTop.current - top;
    let overBottom = bottom - (scrollTop.current + viewHeight);
    return { 
      position: { top, bottom, height: bottom - top }, 
      overscan: { top: overTop, bottom: overBottom }
    };
  }

  return (
    <ReactResizeDetector handleHeight={true}>
      {({ height }) => {
        setViewHeight(height);
        return (
          <VirtualListWrapper onScroll={onScrollView}>
            <div class="rollview" ref={listRef} onScroll={onScrollView}>
              <div class="roll" style={{ height: canvasHeight }}>
                { items }
              </div>
            </div>
          </VirtualListWrapper>
        )
      }}
    </ReactResizeDetector>
  )
}
