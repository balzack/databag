import React, { useRef, useState, useEffect } from 'react';
import { VirtualListWrapper, VirtualItem } from './VirtualList.styled';
import ReactResizeDetector from 'react-resize-detector';

export function VirtualList({ id, items, itemRenderer }) {

  const REDZONE = 1024; // recenter on canvas if in canvas edge redzone
  const HOLDZONE = 2048; // drop slots outside of holdzone of view
  const OVERSCAN = 1024; // add slots in overscan of view
  const DEFAULT_ITEM_HEIGHT = 256;
  const DEFAULT_LIST_HEIGHT = 4096;
  const GUTTER = 6;

  const [ canvasHeight, setCanvasHeight ] = useState(DEFAULT_LIST_HEIGHT*3);
  const [ slots, setSlots ] = useState(new Map());
  const [ scroll, setScroll ] = useState('hidden');

  let update = useRef(0);
  let viewHeight = useRef(DEFAULT_LIST_HEIGHT);
  let latch = useRef(true);
  let scrollTop = useRef(0);
  let containers = useRef([]);
  let listRef = useRef();
  let key = useRef(null);

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

  const growCanvasHeight = (val) => {
    setCanvasHeight((h) => {
      if (val > h) {
        return val;
      }
      return h;
    });
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
    setItems();
  }, [items, id]);

  const onScrollWheel = (e) => {
    if (e.deltaY < 0 && latch.current) {
      latch.current = false;
    }
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
    if (view && containers.current[containers.current.length - 1].index == items.length - 1) {
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
      }
    }
  }

  const loadNextSlot = () => {
    let view = getPlacement();
    if (view) {
      if (view.overscan.top < OVERSCAN) {
        if (containers.current[0].index > 0 && containers.current[0].index < items.length) {
          let below = containers.current[0];
          let container = {
            top: below.top - (DEFAULT_ITEM_HEIGHT + 2 * GUTTER),
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[0].index - 1,
            id: items[containers.current[0].index - 1].id,
            revision: items[containers.current[0].index - 1].revision,
          }
          containers.current.unshift(container);
          addSlot(container.id, getSlot(container))
          loadNextSlot();  
        }
      }
      if (view.overscan.bottom < OVERSCAN) {
        if (containers.current[containers.current.length - 1].index + 1 < items.length) {
          let above = containers.current[containers.current.length - 1];
          let container = {
            top: above.top + above.height + 2 * GUTTER,
            height: DEFAULT_ITEM_HEIGHT,
            index: containers.current[containers.current.length - 1].index + 1,
            id: items[containers.current[containers.current.length - 1].index + 1].id,
            revision: items[containers.current[containers.current.length - 1].index + 1].revision,
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
      let resize = view.position.height * 3 + (2 * REDZONE) + (2 * HOLDZONE);
      if (resize > canvasHeight) {
        height = 2 * resize;
        growCanvasHeight(height);
      }
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

    for (let i = 0; i < containers.current.length; i++) {
      let container = containers.current[i];
      if (items.length <= container.index || items[container.index].id != container.id) {
        for (let j = i; j < containers.current.length; j++) {
          let popped = containers.current.pop();
          removeSlot(popped.id);
        }
        break;
      }
      else if (items[container.index].revision != container.revision) {
        updateSlot(container.id, getSlot(containers.current[i]));
        containers.revision = items[container.index].revision; 
      }
    }

    // place first slot
    if (items.length > 0 && canvasHeight > 0) {
      let view = getPlacement();
      if (!view) {
        let pos = canvasHeight / 2;
        listRef.current.scrollTo({ top: pos, left: 0 });
        scrollTop.current = pos;

        let container = {
          top: pos - DEFAULT_ITEM_HEIGHT,
          height: DEFAULT_ITEM_HEIGHT,
          index: items.length - 1,
          id: items[items.length - 1].id,
          revision: items[items.length - 1].revision,
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
            return itemRenderer(items[container.index]);
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
    <ReactResizeDetector handleHeight={true}>
      {({ height }) => {
        if (height) {
          growCanvasHeight(height * 3);
          viewHeight.current = height;
          updateCanvas();
        }
        return (
          <VirtualListWrapper onScroll={onScrollView} onWheel={onScrollWheel}>
            <div class="rollview" style={{ overflowY: 'auto' }} ref={listRef} onScroll={onScrollView}>
              <div class="roll" style={{ height: canvasHeight }}>
                { slots.values() }
              </div>
            </div>
          </VirtualListWrapper>
        )
      }}
    </ReactResizeDetector>
  )
}
