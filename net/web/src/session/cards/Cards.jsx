import { Input, Modal, List, Button } from 'antd';
import { CardsWrapper } from './Cards.styled';
import { SortAscendingOutlined, UpOutlined, DoubleRightOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useCards } from './useCards.hook';
import { CardItem } from './cardItem/CardItem';

export function Cards({ closeCards, openContact, openChannel, openListing }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useCards(openChannel);

  const message = async (cardId) => {
    try {
      const id = await actions.message(cardId);
      openChannel(id);
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: 'Failed to Create Topic',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    };
  };

  const call = async (contact) => {
    try {
      const id = await actions.call(contact);
    }
    catch (err) {
      console.log(err);
      modal.error({
        title: 'Failed to Start Call',
        content: 'Please try again.',
        bodyStyle: { padding: 16 },
      });
    };
  };

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
            <Button type="primary" icon={<UserOutlined />} onClick={openListing}>Add</Button>
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
              <CardItem item={item} enableIce={state.enableIce} tooltip={state.tooltip} resync={() => actions.resync(item.cardId)}
                  open={() => openContact(item.guid)} message={() => message(item.cardId)} 
                  call={() => call(item)} />
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

