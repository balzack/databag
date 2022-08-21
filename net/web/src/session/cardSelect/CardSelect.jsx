import { useState } from 'react';
import { List } from 'antd';
import { CardSelectWrapper } from './CardSelect.styled';
import { SelectItem } from './selectItem/SelectItem';
import { useCardSelect } from './useCardSelect.hook';

export function CardSelect({ filter, unknown, select, selected, markup }) {

  const { state, actions } = useCardSelect(filter);

  return (
    <CardSelectWrapper>
      <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.cards} gutter="0"
        renderItem={item => (
          <SelectItem item={item} select={select} selected={selected} markup={markup} />
        )}
      />
    </CardSelectWrapper>
  );
}

