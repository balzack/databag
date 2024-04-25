import { Input, Modal, List, Button } from 'antd';
import { CardsWrapper } from './Cards.styled';
import { SortAscendingOutlined, CloseOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useCards } from './useCards.hook';
import { CardItem } from './cardItem/CardItem';
interface Props {
  closeCards?: any;
  openContact: any;
  openChannel: any;
  openListing: any;
}
export function Cards({ closeCards, openContact, openChannel, openListing }: Props) {
  const [modal, modalContext] = Modal.useModal();
  const { state, actions } = useCards();

  const message = async (cardId) => {
    try {
      const id = await actions.message(cardId);
      openChannel(id);
    } catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  };

  const call = async (contact) => {
    try {
      await actions.call(contact);
    } catch (err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  };

  return (
    <CardsWrapper>
      {modalContext}
      <div className="search">
        {!state.sorted && (
          <div
            className="unsorted"
            onClick={() => actions.setSort(true)}
          >
            <SortAscendingOutlined />
          </div>
        )}
        {state.sorted && (
          <div
            className="sorted"
            onClick={() => actions.setSort(false)}
          >
            <SortAscendingOutlined />
          </div>
        )}
        <div className="filter">
          <Input
            className="filterControl"
            bordered={false}
            placeholder={state.strings.contacts}
            prefix={<SearchOutlined />}
            spellCheck="false"
            onChange={(e) => actions.onFilter(e.target.value)}
          />
        </div>
        <div className="inline">
          <Button
            type="primary"
            icon={<UserOutlined />}
            onClick={openListing}
          >
            {state.strings.add}
          </Button>
        </div>
        {state.display === 'xlarge' && (
          <div className="inline">
            <div
              className="dismiss"
              onClick={closeCards}
            >
              <CloseOutlined />
            </div>
          </div>
        )}
      </div>
      <div className="view">
        {state.cards.length > 0 && (
          <List
            locale={{ emptyText: '' }}
            itemLayout="horizontal"
            dataSource={state.cards}
            //  gutter={0}
            renderItem={(item) => (
              <CardItem
                item={item}
                enableIce={state.enableIce}
                tooltip={state.tooltip}
                resync={() => actions.resync(item.cardId)}
                open={() => openContact(item.guid)}
                message={() => message(item.cardId)}
                strings={state.strings}
                call={() => call(item)}
                display={state.display}
                canMessage={state.allowUnsealed || (item.seal && state.sealable)}
              />
            )}
          />
        )}
        {state.cards.length === 0 && <div className="empty">{state.strings.noContacts}</div>}
      </div>
    </CardsWrapper>
  );
}
