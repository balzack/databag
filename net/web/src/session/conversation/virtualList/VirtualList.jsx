import React, { useRef, useState, useEffect } from 'react';
import { VirtualListWrapper, VirtualItem } from './VirtualList.styled';
import ReactResizeDetector from 'react-resize-detector';
import { useVirtualList } from './useVirtualList.hook';

export function VirtualList({ id, items, itemRenderer, loadMore }) {

  const redZone = 1024;
  const holdZone = 2048;
  const fillZone = 1024;

  const pushDelay = 250;
  const moreDelay = 2000;
  const latchDelay = 500;

  const defaultHeight = 32;

  const rollHeight = 16384;

  const { state, actions } = useVirtualList();
  const containers = useRef([]);
  const itemView = useRef([]);
  const debounce = useRef([]);
  const nomore = useRef(false);
  const nolatch = useRef(false);
  const list = useRef(null);
  const scrollTop = useRef(0);

  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    actions.clearSlots();
    scrollTop.current = 8192;
    list.current.scrollTo({ top: 8192, left: 0 });
  }, [id]);

  useEffect(() => {

    // reference copy
    itemView.current = items;

    // genearte set of active ids
    let ids = new Map();
    for (let i = 0; i < itemView.current.length; i++) {
      ids.set(getItemKey(itemView.current[i]), i);
    }

    // remove any deleted items
    let slots = [];
    containers.current.forEach((container) => {
      if (!ids.has(container.key)) {
        actions.removeSlot(container.key);
      }
      else {
        container.index = ids.get(container.key);
        container.item = itemView.current[container.index];
        slots.push(container);
      }
    });
    containers.current = slots;

    // sort by index
    containers.current.sort((a, b) => {
      if (a.index < b.index) {
        return -1;
      }
      return 1;
    });

    // rerender list
    layoutItems();
  }, [items]); 

  useEffect(() => {
    layoutItems();
  }, [scrollPos, state.listHeight, state.view]);

  const layoutItems = () => {
    alignSlots();
    loadSlots();
    releaseSlots();
    centerSlots();
    latchSlots();
    pushSlots();
  };

  const latchSlots = () => {
    if (containers.current.length > 0 && state.latched) {
      if (!nolatch.current) {
        const last = containers.current[containers.current.length - 1];
        const bottom = last.top + last.height;
        if (last.heightSet && scrollTop.current < bottom - state.listHeight) {
          list.current.scrollTo({ top: bottom - state.listHeight, left: 0, behavior: 'smooth' });
          nolatch.current = true;
          setTimeout(() => {
            nolatch.current = false;
            latchSlots();
          }, latchDelay);
        }
      }
    }
  }

  const pushSlots = () => {
    if (debounce.current != null) {
      clearTimeout(debounce.current);
    };
    debounce.current = setTimeout(() => {
      if (containers.current.length > 0) {
        const range = getContainerRange();
        if (range.bottom - range.top < state.listHeight) {
          if (scrollTop.current + state.listHeight != range.bottom) {
            list.current.scrollTo({ top: range.bottom - state.listHeight, left: 0 });
            actions.latch();
          }
        }
        else if (scrollTop.current + state.listHeight > range.bottom) {
          list.current.scrollTo({ top: range.bottom - state.listHeight, left: 0 });
          actions.latch();
        }
        else if (scrollTop.current < range.top) {
          list.current.scrollTo({ top: range.top, left: 0 });
        }
      }
    }, pushDelay);
  };

  const alignSlots = () => {
    if (containers.current.length > 1) {
      if (state.latched) {
        const index = containers.current.length - 1;
        const last = containers.current[index];
        let bottom = last.top + last.height;
        for (let i = index; i >= 0; i--) {
          let container = containers.current[i];
          if (container.top + container.height != bottom) {
            container.top = bottom - container.height;
            actions.updateSlot(container.key, getSlot(container));
          }
          bottom -= container.height;
        }
      }
      else {
        const index = Math.floor(containers.current.length / 2);
        const mid = containers.current[index];
        let top = mid.top;
        for (let i = index; i < containers.current.length; i++) {
          let container = containers.current[i];
          if (container.top != top) {
            container.top = top;
            actions.updateSlot(container.key, getSlot(container));
          }
          top += container.height;
        }
        let bottom = mid.top + mid.height;
        for (let i = index; i >= 0; i--) {
          let container = containers.current[i];
          if (container.top + container.height != bottom) {
            container.top = bottom - container.height;
            actions.updateSlot(container.key, getSlot(container));
          }
          bottom -= container.height;
        }
      }
    }
  }

  const loadSlots = () => {

    if (containers.current.length == 0) {
      // add the first slot
      if (itemView.current.length > 0) {
        let item = itemView.current[itemView.current.length - 1];
        let slot = {
          top: rollHeight / 2 + state.listHeight,
          height: defaultHeight,
          heightSet: false,
          key: getItemKey(item),
          index: itemView.current.length - 1,
          item: item,
        }
        containers.current.push(slot);
        actions.addSlot(slot.key, getSlot(slot));
        list.current.scrollTo({ top: rollHeight / 2, left: 0 });
      }
    }
    else {
      // fill in any missing slots
      let index = containers.current[0].index;
      for (let i = 1; i < containers.current.length; i++) {
        let container = containers.current[i];
        if (container.index != index + i) {
          const item = itemView.current[index + 1];
          let slot = {
            top: container.top - defaultHeight,
            height: defaultHeight,
            heightSet: false,
            index: index + i,
            item: item,
            key: getItemKey(item),
          }
          containers.current.splice(i, 0, slot);
          actions.addSlot(slot.key, getSlot(slot));
        }
      }
    }

    loadSlotAbove();
    loadSlotBelow();
  };

  const loadSlotAbove = () => {
    if (containers.current.length > 0) {
      const range = getContainerRange();
      if (scrollTop.current - fillZone < range.top) {
        const container = containers.current[0];
        if (container.index > 0) {
          const index = container.index - 1;
          const item = itemView.current[index];
          let slot = {
            top: container.top - defaultHeight,
            height: defaultHeight,
            heightSet: false,
            index: index,
            item: item,
            key: getItemKey(item),
          }
          containers.current.unshift(slot);
          actions.addSlot(slot.key, getSlot(slot));
          loadSlotAbove();
        }
      }
    }
  }

  const loadSlotBelow = () => {
    if (containers.current.length > 0) {
      const container = containers.current[containers.current.length - 1];
      if (container.index + 1 < itemView.current.length) {
        const range = getContainerRange();
        if (scrollTop.current + state.listHeight + fillZone > range.bottom) {
          const index = container.index + 1;
          const item = itemView.current[index];
          let slot = {
            top: container.top + container.height,
            height: defaultHeight,
            heightSet: false,
            index: index,
            item: item,
            key: getItemKey(item),
          }
          containers.current.push(slot);
          actions.addSlot(slot.key, getSlot(slot));
          loadSlotBelow();
        }
      }
    }
  }

  const releaseSlots = () => {
    releaseSlotAbove();
    releaseSlotBelow();
  };

  const releaseSlotAbove = () => {
    if (containers.current.length > 1) {
      const container = containers.current[0];
      if (container.top + container.height < scrollTop.current - holdZone) {
        actions.removeSlot(container.key);
        containers.current.shift();
        releaseSlotAbove();
      }
    }
  }

  const releaseSlotBelow = () => {
    if (containers.current.length > 1) {
      const container = containers.current[containers.current.length - 1];
      if (container.top > scrollTop.current + state.listHeight + holdZone) {
        actions.removeSlot(container.key);
        containers.current.pop();
        releaseSlotBelow();
      }
    }
  }

  const centerSlots = () => {
    if (containers.current.length > 0) {
      const top = containers.current[0];
      if (top.top < redZone) {
        containers.current.forEach(container => {
          container.top += rollHeight / 2;
          actions.updateSlot(container.key, getSlot(container));
        });
        list.current.scrollTo({ top: scrollTop.current + rollHeight / 2, left: 0 });
      }

      const bottom = containers.current[containers.current.length - 1];
      if (bottom.top + bottom.height > rollHeight - redZone) {
        containers.current.forEach(container => {
          container.top -= rollHeight / 2;
          actions.updateSlot(container.key, getSlot(container));
        });
        list.current.scrollTo({ top: scrollTop.current - rollHeight / 2, left: 0 });
      }
    }
  };

  const getItemKey = (item) => {
    return `${id}.${item.id}.${item.revision}`
  }

  const getSlot = (item) => {
    const container = item;
    return (
      <VirtualItem style={{ top: container.top, key: container.key }}>
        <ReactResizeDetector handleHeight={true}>
          {({ height }) => {
            if (typeof height !== 'undefined' && container.height != height) {
              container.height = height;
              container.heightSet = true;
              layoutItems();
            }
            return itemRenderer(container.item);
          }}
        </ReactResizeDetector>
      </VirtualItem>
    )
  }

  const getContainerRange = () => {
    let top = rollHeight;
    let bottom = 0;
    containers.current.forEach((c) => {
      if (c.top < top) {
        top = c.top;
      }
      if (c.top + c.height > bottom) {
        bottom = c.top + c.height;
      }
    });
    return { top, bottom };
  }

  const scrollView = (e) => {
    if (containers.current.length > 0 && containers.current[0].index == 0 && !nomore.current) {
      loadMore();
      nomore.current = true;
      setTimeout(() => {
        nomore.current = false;
      }, moreDelay);
    }
    scrollTop.current = e.target.scrollTop;
    setScrollPos(e.target.scrollTop);
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ReactResizeDetector handleHeight={true} handleWidth={false}>
        {({ height }) => {
          if (height && state.listHeight != height) {
            actions.setListHeight(height);
          }
          return (
            <VirtualListWrapper onScroll={scrollView}
                onWheel={actions.unlatch} onTouchStart={actions.unlatch} >
              <div class="rollview" ref={list} onScroll={scrollView}>
                <div class="roll" style={{ height: rollHeight }}>
                  { state.slots }
                </div>
              </div>
            </VirtualListWrapper>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
