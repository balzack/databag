import { Input, List } from 'antd';
import { CardsWrapper } from './Cards.styled';
import { SortAscendingOutlined, UpOutlined, DoubleRightOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useCards } from './useCards.hook';
import { CardItem } from './cardItem/CardItem';

export function Cards({ closeCards, openContact, openListing }) {

  const { state, actions } = useCards();

  return (
    <CardsWrapper>
      <div className="search">
        { !state.sorted && (
          <div className="unsorted" onClick={() => actions.setSort(true)}>
            <SortAscendingOutlined />
          </div>
        )}
        { state.sorted && (
          <div className="sorted" onClick={() => actions.setSort(false)}>
            <SortAscendingOutlined />
          </div>
        )}
        <div className="filter">
          <Input bordered={false} allowClear={true} placeholder="Contacts" prefix={<SearchOutlined />}
              spellCheck="false" onChange={(e) => actions.onFilter(e.target.value)} />
        </div>
        { state.display === 'small' && (
          <div className="inline">
            <div className="add" onClick={openListing}>
              <UserOutlined />
              <div className="label">New</div>
            </div>
          </div>
        )}
        { state.display !== 'small' && (
          <div className="inline">
            <div className="dismiss" onClick={closeCards} >
              <DoubleRightOutlined />
            </div>
          </div>
        )}
      </div>
      <div className="view">
        { state.cards.length > 0 && (
          <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.cards} gutter="0"
            renderItem={item => (
              <CardItem item={item} tooltip={state.tooltip} resync={() => actions.resync(item.cardId)}
                  open={() => openContact(item.guid)} />
            )} />
        )}
        { state.cards.length === 0 && (
          <div className="empty">No Contacts</div>
        )}
      </div>
      { state.display !== 'small' && (
        <div className="bar">
          <div className="add" onClick={openListing}>
            <UpOutlined />
            <div className="label">Find New Contact</div>
          </div>
        </div>
      )}
      </CardsWrapper>
  );
}

