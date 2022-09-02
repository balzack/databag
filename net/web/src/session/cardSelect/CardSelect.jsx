import { List } from 'antd';
import { CardSelectWrapper } from './CardSelect.styled';
import { SelectItem } from './selectItem/SelectItem';
import { useCardSelect } from './useCardSelect.hook';
import { Logo } from 'logo/Logo';

export function CardSelect({ filter, unknown, select, selected, markup }) {

  const { state } = useCardSelect(filter);

  return (
    <CardSelectWrapper>
      { state.cards?.length > 0 && (
        <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.cards} gutter="0"
          renderItem={item => (
            <SelectItem item={item} select={select} selected={selected} markup={markup} />
          )}
        />
      )}
      { unknown > 0 && (
        <div class="unknown">
          <Logo img="avatar" width={32} height={32} radius={8} />
          <div class="message">
            <span>+ { unknown } unknown</span>
          </div>
        </div>
      )}
    </CardSelectWrapper>
  );
}

