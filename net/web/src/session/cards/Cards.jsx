import { Input, List } from 'antd';
import { CardsWrapper } from './Cards.styled';
import { SearchOutlined } from '@ant-design/icons';
import { useCards } from './useCards.hook';
import { CardItem } from './cardItem/CardItem';

export function Cards() {

  const { state, actions } = useCards();

  return (
    <CardsWrapper>
      <div class="view">
        <div class="search">
          <div class="filter">
            <Input bordered={false} allowClear={true} placeholder="Contacts" prefix={<SearchOutlined />}
                size="large" spellCheck="false" onChange={(e) => actions.onFilter(e.target.value)} />
          </div>
        </div>
        <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.cards} gutter="0"
          renderItem={item => (
            <CardItem item={item} />
          )} />
      </div>
    </CardsWrapper>
  );
}

