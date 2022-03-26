import React, { useEffect } from 'react'
import { CardsWrapper } from './Cards.styled';
import { Drawer } from 'antd';
import { Registry } from './Registry/Registry';

export function Cards({ showRegistry }) {

  useEffect(() => {
    console.log("HERE", showRegistry);
  }, [showRegistry]);

  return (
    <CardsWrapper>

        <Drawer
          placement="right"
          closable={false}
          visible={showRegistry}
          getContainer={false}
          contentWrapperStyle={{ width: '100%' }}
          bodyStyle={{ padding: 0, backgroundColor: '#f6f5ed' }}
          style={{ position: 'absolute' }}
        >
          <Registry />
        </Drawer>

    </CardsWrapper>
  )
}

