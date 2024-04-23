import { List } from 'antd';
import { CardSelectWrapper } from './CardSelect.styled';
import { SelectItem } from './selectItem/SelectItem';
import { useCardSelect } from './useCardSelect.hook';
import { Logo } from 'logo/Logo';
interface Props {filter?: any;
unknown?: any;
select?: any;
selected?: any;
markup?: any;
emptyMessage?: any;
setItem?: any;
clearItem?: any;}
export function CardSelect({ filter, unknown, select, selected, markup, emptyMessage, setItem, clearItem }:Props) {

  const { state } = useCardSelect(filter);

  return (
    <CardSelectWrapper>
      { state.cards?.length > 0 && (
        <List locale={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.cards}
        // gutter="0"
          renderItem={item => (
            <SelectItem item={item} select={select} selected={selected} markup={markup} setItem={setItem} clearItem={clearItem} />
          )}
        />
      )}
      { !state.cards?.length && (
        <div className="empty">{ emptyMessage }</div>
      )}
      { unknown > 0 && (
        <div className="unknown">
          <Logo img="avatar" width={32} height={32} radius={8} />
          <div className="message">
            <span>+ { unknown } unknown</span>
          </div>
        </div>
      )}
    </CardSelectWrapper>
  );
}

