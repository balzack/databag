import React, { useRef, useState, useEffect } from 'react';
import { VirtualListWrapper, VirtualItem } from './VirtualList.styled';
import ReactResizeDetector from 'react-resize-detector';

export function VirtualList({ id, items, itemRenderer, onMore }) {

  const REDZONE = 1024; // recenter on canvas if in canvas edge redzone
  const HOLDZONE = 2048; // drop slots outside of holdzone of view
  const OVERSCAN = 1024; // add slots in overscan of view
  const DEFAULT_ITEM_HEIGHT = 256;
  const DEFAULT_LIST_HEIGHT = 4096;
  const GUTTER = 1;

  const [ msg, setMsg ] = useState("YO");

  const [ canvasHeight, setCanvasHeight ] = useState(16384);
  const [ slots, setSlots ] = useState(new Map());
  const [ scroll, setScroll ] = useState('hidden');

  let update = useRef(0);
  let viewHeight = useRef(DEFAULT_LIST_HEIGHT);
  let latch = useRef(true);
  let scrollTop = useRef(0);
  let containers = useRef([]);
  let listRef = useRef();
  let key = useRef(null);
  let itemView = useRef([]);
  let nomore = useRef(false);

  const addSlot = (id, slot) => {
    setSlots((m) => { m.set(id, slot); return new Map(m); })
  }

  const updateSlot = (id, slot) => {
    setSlots((m) => { m.set(id, slot); return new Map(m); })
  }

  const removeSlot = (id) => {
    setSlots((m) => { m.delete(id); return new Map(m); });
  }

  const clearSlots = () => {
    setSlots((m) => { return new Map() })
  }

  useEffect(() => {
    updateCanvas();
  }, [canvasHeight]);

  useEffect(() => {
    if (key.current != id) {
      key.current = id;
      latch.current = true;
      containers.current = [];
      clearSlots();
    }
    itemView.current = items;
    setItems();
  }, [items, id]);

  const onScrollWheel = (e) => {
    latch.current = false;
  }

  const onScrollView = (e) => {
    scrollTop.current = e.target.scrollTop;
    loadNextSlot();
    dropSlots();
    centerCanvas();
    limitScroll();
  }

  const updateCanvas = () => {
    alignSlots();
    loadNextSlot();
    dropSlots();
    centerCanvas();
    limitScroll();
    latchScroll();
  }

  const limitScroll = () => {
    let view = getPlacement();
    if (view && containers.current[containers.current.length - 1].index == itemView.current.length - 1) {
      if (view?.overscan?.bottom <= 0) {
        if (view.position.height < viewHeight.current) {
          if (scrollTop.current != view.position.top) {
            scrollTop.current = view.position.top;
            listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
          }
        }
        else {
          if (scrollTop.current != view.position.bottom - viewHeight.current) {
            scrollTop.current = view.position.bottom - viewHeight.current;
            listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
          }
        }
        latch.current = true;
      }
    }
    if (view && containers.current[0].index == 0) {
      if (view?.overscan?.top <= 0) {
        scrollTop.current = containers.current[0].top;
        listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
        if (!nomore.current) {
          nomore.current = true;
          onMore();
          setTimeout(() => {
            nomore.current = false;
          }, 2500);
        }
      }
    }
  }

  const loadNextSlot = () => {
    let view = getPlacement();
    if (view) {
      if (view.overscan.top < OVERSCAN) {
        if (containers.current[0].index > 0 && containers.current[0].index < itemView.current.length) {
          let below = containers.current[0];
          let container = {
            top: below.top - (DEFAULT_ITEM_HEIGHT + 2 * GUTTER),
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[0].index - 1,
            id: itemView.current[containers.current[0].index - 1].id,
            revision: itemView.current[containers.current[0].index - 1].revision,
          }
          containers.current.unshift(container);
          addSlot(container.id, getSlot(container))
          loadNextSlot();  
        }
      }
      if (view.overscan.bottom < OVERSCAN) {
        if (containers.current[containers.current.length - 1].index + 1 < itemView.current.length) {
          let above = containers.current[containers.current.length - 1];
          let container = {
            top: above.top + above.height + 2 * GUTTER,
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[containers.current.length - 1].index + 1,
            id: itemView.current[containers.current[containers.current.length - 1].index + 1].id,
            revision: itemView.current[containers.current[containers.current.length - 1].index + 1].revision,
          }
          containers.current.push(container);
          addSlot(container.id, getSlot(container))
          loadNextSlot();
        }
      }
    }
  }

  const dropSlots = () => {
    while (containers.current.length > 0 &&
        containers.current[0].top + containers.current[0].height + 2 * GUTTER + HOLDZONE < scrollTop.current) {
      removeSlot(containers.current[0].id);
      containers.current.shift();
    }
    while (containers.current.length > 0 &&
        containers.current[containers.current.length - 1].top > scrollTop.current + viewHeight.current + HOLDZONE) {
      removeSlot(containers.current[containers.current.length - 1].id);
      containers.current.pop();
    }
  }

  const alignSlots = () => {
    if (containers.current.length > 1) {
      let mid = Math.floor(containers.current.length / 2);

      let alignTop = containers.current[mid].top + containers.current[mid].height + 2 * GUTTER;
      for (let i = mid + 1; i < containers.current.length; i++) {
        if (containers.current[i].top != alignTop) {
          containers.current[i].top = alignTop;
          updateSlot(containers.current[i].id, getSlot(containers.current[i]));
        }
        alignTop += containers.current[i].height + 2 * GUTTER;
      }

      let alignBottom = containers.current[mid].top;
      for (let i = mid - 1; i >= 0; i--) {
        alignBottom -= (containers.current[i].height + 2 * GUTTER);
        if (containers.current[i].top != alignBottom) {
          containers.current[i].top = alignBottom;
          updateSlot(containers.current[i].id, getSlot(containers.current[i]));
        }
      }
    }
  };

  const centerCanvas = () => {
    let view = getPlacement();
    if (view) {
      let height = canvasHeight;
      if (view.position.top < REDZONE) {
        let shift = height / 2;
        for (let i = 0; i < containers.current.length; i++) {
          containers.current[i].top += shift;
          updateSlot(containers.current[i].id, getSlot(containers.current[i]));
        }
        scrollTop.current += shift;
        listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
      }
      else if (view.position.bottom + REDZONE > height) {
        let shift = height / 2;
        for (let i = 0; i < containers.current.length; i++) {
          containers.current[i].top -= shift;
          updateSlot(containers.current[i].id, getSlot(containers.current[i]));
        }
        scrollTop.current -= shift;
        listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
      }
    }
  }

  const latchScroll = () => {
    if (latch.current) {
      let view = getPlacement();
      if (view) {
        if (view.position.height < viewHeight.current) {
          if (scrollTop.current != view.position.top) {
            scrollTop.current = view.position.top;
            listRef.current.scrollTo({ top: scrollTop.current, left: 0, behavior: 'smooth' });
          }
        }
        else {
          if (scrollTop.current != view.position.bottom - viewHeight.current) {
            scrollTop.current = view.position.bottom - viewHeight.current;
            listRef.current.scrollTo({ top: scrollTop.current, left: 0, behavior: 'smooth' });
          }
        }
      }
    }
  }

  const setItems = () => {

    // align containers in case history was loaded
    if (containers.current.length > 0) {
      let container = containers.current[0];
      for (let j = 0; j < itemView.current.length; j++) {
        if (itemView.current[j].id == container.id) {
          for(let i = 0; i < containers.current.length; i++) {
            containers.current[i].index = i + j;
          }
          break;
        }
      }
    } 

    // remove containers following any removed item
    for (let i = 0; i < containers.current.length; i++) {
      let container = containers.current[i];
      if (itemView.current.length <= container.index || itemView.current[container.index].id != container.id) {
        while (containers.current.length > i) {
          let popped = containers.current.pop();
          removeSlot(popped.id);
        }
        break;
      }
      else if (itemView.current[container.index].revision != container.revision) {
        updateSlot(container.id, getSlot(containers.current[i]));
        containers.revision = itemView.current[container.index].revision; 
      }
    }

    // place first slot
    if (itemView.current.length > 0 && canvasHeight > 0) {
      let view = getPlacement();
      if (!view) {
        let pos = canvasHeight / 2;
        listRef.current.scrollTo({ top: pos, left: 0 });
        scrollTop.current = pos;

        let container = {
          top: pos - DEFAULT_ITEM_HEIGHT,
          height: DEFAULT_ITEM_HEIGHT,
          index: itemView.current.length - 1,
          id: itemView.current[itemView.current.length - 1].id,
          revision: itemView.current[itemView.current.length - 1].revision,
        }

        containers.current.push(container);
        addSlot(container.id, getSlot(container));
      }
    }

    updateCanvas();
  }

  const onItemHeight = (container, height) => {
    container.height = height;
    updateCanvas();
  }

  const getSlot = (container) => {
    return (
      <VirtualItem style={{ top: container.top, paddingTop: GUTTER, paddingBottom: GUTTER }}>
        <ReactResizeDetector handleHeight={true}>
          {({ height }) => {
            if (typeof height !== 'undefined') {
              onItemHeight(container, height);
            }
            return itemRenderer(itemView.current[container.index]);
          }}
        </ReactResizeDetector> 
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
    let overBottom = bottom - (scrollTop.current + viewHeight.current);
    return { 
      position: { top, bottom, height: bottom - top }, 
      overscan: { top: overTop, bottom: overBottom }
    };
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ReactResizeDetector handleHeight={true} handleWidth={true}>
        {({ height }) => {
          if (height) {
            viewHeight.current = height;
            updateCanvas();
          }
          return (
            <VirtualListWrapper onScroll={onScrollView} onWheel={onScrollWheel} onTouchStart={onScrollWheel} >
              <div class="rollview" style={{ overflowY: 'auto' }} ref={listRef} onScroll={onScrollView}>
                <div class="roll" style={{ height: canvasHeight }}>
                  { slots.values() }
                </div>
              </div>
            </VirtualListWrapper>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
