import React, { useEffect } from 'react'
import { CardsWrapper } from './Cards.styled';
import { Drawer } from 'antd';
import { Registry } from './Registry/Registry';

export function Cards({ showRegistry }) {

  useEffect(() => {
  }, [showRegistry]);

  return (
    <CardsWrapper>
      <div>
        <Drawer
          placement="right"
          closable={false}
          visible={showRegistry}
          getContainer={false}
          contentWrapperStyle={{ width: '100%' }}
          bodyStyle={{ backgroundColor: '#f6f5ed', paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 0 }}
          style={{ position: 'absolute' }}
        >
          <Registry />
        </Drawer>
      </div>
    </CardsWrapper>
  )
}

