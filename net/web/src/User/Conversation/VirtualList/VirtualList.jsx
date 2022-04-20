import React, { useRef, useState, useEffect } from 'react';
import { VirtualListWrapper, VirtualItem } from './VirtualList.styled';
import ReactResizeDetector from 'react-resize-detector';
import { TopicItem } from './TopicItem/TopicItem';

export function VirtualList({ topics }) {

  const OVERSCAN = 300
  const DEFAULT_ITEM_HEIGHT = 64;
  const DEFAULT_LIST_HEIGHT = 1024;
  const GUTTER = 8;

  const [ viewHeight, setViewHeight ] = useState(DEFAULT_LIST_HEIGHT); 
  const [ canvasHeight, setCanvasHeight ] = useState(DEFAULT_LIST_HEIGHT*3);
  const [ items, setItems ] = useState([]);
  const [ scroll, setScroll ] = useState('hidden');

  let latch = useRef(true);
  let scrollTop = useRef(0);
  let containers = useRef([]);
  let anchorBottom = useRef(true);
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

  const onScrollWheel = (e) => {
    if (e.deltaY < 0 && latch.current) {
      scrollTop.current -= 32;
      listRef.current.scrollTo({ top: scrollTop.current, left: 0, behavior: 'smooth' });
      setScroll('auto');
      latch.current = false;
    }
  }

  const onScrollView = (e) => {

    // add or remove from overscan

    // clip to top or bottom

    // set or clear latch

    scrollTop.current = e.target.scrollTop;

    if (!latch.current) {
      let view = getPlacement();
      if (view?.overscan?.bottom <= 0) {
        setScroll('hidden');
        latch.current = true;
        alignItems();
        listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
      }
    }

    loadNextItem();
  }

  const loadNextItem = () => {
    let view = getPlacement();
    if (view) {
      if (view.overscan.top < OVERSCAN) {
        if (containers.current[0].index > 0) {
          let below = containers.current[0];
          let container = {
            top: below.top - (DEFAULT_ITEM_HEIGHT + 2 * GUTTER),
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[0].index - 1,
          }
          containers.current.unshift(container);
console.log("ADD ITEM BEFORE", container);
          addItemTop(getItem(container))
          anchorBottom.current = true;
        }
      }
      if (view.overscan.bottom < OVERSCAN) {
        if (containers.current[containers.current.length - 1].index + 1 < topics.length) {
console.log("ADD ITEM AFTER");
          let above = containers.current[containers.current.length - 1];
          let container = {
            top: above.top + above.height + 2 * GUTTER,
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[containers.current.length - 1].index + 1,
          }
          containers.current.push(container);
          addItemBottom(getItem(container))
          anchorBottom.current = false;
        }
      }
    }
  }

  const alignItems = () => {
    if (containers.current.length > 0) {

      if (anchorBottom.current) {
        let pos = containers.current[containers.current.length - 1].top;
        for (let i = containers.current.length - 2; i >= 0; i--) {
          pos -= (containers.current[i].height + 2 * GUTTER);
          if (containers.current[i].top != pos) {
            containers.current[i].top = pos;
            updateItem(i, getItem(containers.current[i]));
          }
        }

        if (pos < 0) {
          // TODO reset canvas
          console.log("ALERT: reset convas");
        }
      }
      else {
        let pos = containers.current[0].top + containers.current[0].height;
        for (let i = 1; i < containers.current.length; i++) {
          if (containers.current[i].top != pos) {
            containers.current[i].top = pos;
            updateItem(i, getItem(containers.current[i]));
          }
          pos += containers.current[i].height + 2 * GUTTER;
        }

        if (pos > canvasHeight) {
          // TODO reset canvas
          console.log("ALERT: reset canvas");
        }
      }

      let view = getPlacement();
      if (latch.current) {
        if (view.position.height < viewHeight) {
          if (scrollTop.current != view.position.top) {
            listRef.current.scrollTo({ top: view.position.top, left: 0, behavior: 'smooth' });
            scrollTop.current = view.position.top;
          }
        }
        else {
          if (scrollTop.current != view.position.bottom - viewHeight) {
            listRef.current.scrollTo({ top: view.position.bottom - viewHeight, left: 0, behavior: 'smooth' });
            scrollTop.current = view.position.bottom - viewHeight;
          }
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

        anchorBottom.current = true;
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
      <VirtualItem style={{ top: container.top }}>
        <TopicItem topic={topics[container.index]} padding={GUTTER}
            onHeight={(height) => onTopicHeight(container, height)} />
      </VirtualItem>
    )
  }

  const getPlacement = () => {
    if (containers.current.length == 0) {
      return null;
    }
    let top = containers.current[0].top;
    let bottom = containers.current[containers.current.length-1].top + containers.current[containers.current.length-1].height + 2 * GUTTER;
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
          <VirtualListWrapper onScroll={onScrollView} onWheel={onScrollWheel}>
            <div class="rollview" style={{ overflowY: scroll }} ref={listRef} onScroll={onScrollView}>
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
