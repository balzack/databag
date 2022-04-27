import React, { useRef, useState, useEffect } from 'react';
import { VirtualListWrapper, VirtualItem } from './VirtualList.styled';
import ReactResizeDetector from 'react-resize-detector';

export function VirtualList({ id, items, itemRenderer }) {

  const REDZONE = 256; // recenter on canvas if in canvas edge redzone
  const HOLDZONE = 1024; // drop slots outside of holdzone of view
  const OVERSCAN = 256; // add slots in overscan of view
  const DEFAULT_ITEM_HEIGHT = 64;
  const DEFAULT_LIST_HEIGHT = 4096;
  const GUTTER = 8;

  const [ viewHeight, setViewHeight ] = useState(DEFAULT_LIST_HEIGHT); 
  const [ canvasHeight, setCanvasHeight ] = useState(DEFAULT_LIST_HEIGHT*3);
  const [ slots, setSlots ] = useState(new Map());
  const [ scroll, setScroll ] = useState('hidden');

  let latch = useRef(true);
  let scrollTop = useRef(0);
  let containers = useRef([]);
  let anchorBottom = useRef(true);
  let listRef = useRef();
  let view = useRef(null);

  const addSlot = (id, slot) => {
    setSlots((m) => { m.set(id, slot); return new Map(m); })
  }

  const updateSlot = (id, slot) => {
    setSlots((m) => { m.set(id, slot); return new Map(m); })
  }

  const removeSlot = (id) => {
    setSlots((m) => { m.delete(id); return new Map(m); })
  }

  const clearSlots = () => {
    setSlots((m) => { new Map() })
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
    if (viewHeight * 3 > canvasHeight) {
      growCanvasHeight(viewHeight * 3);
    }
    setItems();
  }, [viewHeight]);

  useEffect(() => {
    if (view.current != id) {
      view.current = id;
      latch.current = true;
      containers.current = [];
      anchorBottom.current = true;
      scrollTop.current = 0;
      listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
      clearSlots();
    }
    setItems();
  }, [items, id]);

  useEffect(() => {
    if (latch.current) {
      alignSlots();
    }
  }, [viewHeight, canvasHeight]);

  const onScrollWheel = (e) => {
    if (e.deltaY < 0 && latch.current) {
      scrollTop.current -= 32;
      listRef.current.scrollTo({ top: scrollTop.current, left: 0, behavior: 'smooth' });
      setScroll('auto');
      latch.current = false;
    }
  }

  const onScrollView = (e) => {

    scrollTop.current = e.target.scrollTop;

    if (!latch.current) {
      let view = getPlacement();
      if (view?.overscan?.top <= 0) {
        scrollTop.current = containers.current[0].top;
        listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
      }
      if (view?.overscan?.bottom <= 0) {
        setScroll('hidden');
        latch.current = true;
        alignSlots();
        listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
      }
    }

    loadNextSlot();
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
          anchorBottom.current = true;

          if (containers.current[containers.current.length - 1].top > scrollTop.current + viewHeight + HOLDZONE) {
            removeSlot(containers.current[containers.current.length - 1].id);
            containers.current.pop();
          }
          
          alignSlots();
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
          anchorBottom.current = false;

          if (containers.current[0].top + containers.current[0].height + 2 * GUTTER + HOLDZONE < scrollTop.current) {
            removeSlot(containers.current[0].id);
            containers.current.shift();
          }

          alignSlots();
        }
      }
    }
  }

  const alignSlots = () => {
    if (containers.current.length > 0) {

      if (anchorBottom.current) {
        let pos = containers.current[containers.current.length - 1].top;
        for (let i = containers.current.length - 2; i >= 0; i--) {
          pos -= (containers.current[i].height + 2 * GUTTER);
          if (containers.current[i].top != pos) {
            containers.current[i].top = pos;
            updateSlot(containers.current[i].id, getSlot(containers.current[i]));
          }
        }

        if (pos < REDZONE) {
          let shift = canvasHeight / 2;
          for (let i = 0; i < containers.current.length; i++) {
            containers.current[i].top += shift;
            updateSlot(containers.current[i].id, getSlot(containers.current[i]));
          }
          scrollTop.current += shift;
          listRef.current.scrollTo({ top: scrollTop.current, left: 0 });

          let view = getPlacement();
          if (view.position.bottom + REDZONE > canvasHeight) {
            growCanvasHeight(view.position.bottom + REDZONE);
          }
        }
      }
      else {
        let pos = containers.current[0].top + containers.current[0].height + 2 * GUTTER;
        for (let i = 1; i < containers.current.length; i++) {
          if (containers.current[i].top != pos) {
            containers.current[i].top = pos;
            updateSlot(containers.current[i].id, getSlot(containers.current[i]));
          }
          pos += containers.current[i].height + 2 * GUTTER;
        }

        if (pos + REDZONE > canvasHeight) {
          let shift = canvasHeight / 2;
          let view = getPlacement();
          if (view.position.top < shift + REDZONE) {
            growCanvasHeight(view.position.bottom + REDZONE);
          }
          else {
            for (let i = 0; i < containers.current.length; i++) {
              containers.current[i].top -= shift;
              updateSlot(containers.current[i].id, getSlot(containers.current[i]));
            }
            scrollTop.current -= shift;
            listRef.current.scrollTo({ top: scrollTop.current, left: 0 });
          }
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

    loadNextSlot();
  }

  const setItems = () => {

    // update or removed any affected slots
    if (anchorBottom.current) {
      for (let i = containers.current.length - 1; i >= 0; i--) {
        let container = containers.current[i];
        if (items.length <= container.index || items[container.index].id != container.id) {
          for (let j = 0; j <= i; j++) {
            let shifted = containers.current.shift();
            removeSlot(shifted.id);
          }
          break;
        }
        else if (items[container.index].revision != container.revision) {
          updateSlot(container.id, getSlot(containers.current[i]));
          containers.revision = items[container.index].revision; 
        }
      }
    }
    else {
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

        anchorBottom.current = true;
        containers.current.push(container);
        addSlot(container.id, getSlot(container));

        listRef.current.scrollTo({ top: container.top, left: 0, behavior: 'smooth' });
      }
      else {
        loadNextSlot();
      }
    }
  }

  const onItemHeight = (container, height) => {
    container.height = height;
    alignSlots();
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
                { slots.values() }
              </div>
            </div>
          </VirtualListWrapper>
        )
      }}
    </ReactResizeDetector>
  )
}
