import { Modal, Button, Input, List } from 'antd';
import { ListingWrapper } from './Listing.styled';
import { UserOutlined, FilterOutlined, CloseOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { useListing } from './useListing.hook';
import { ListingItem } from './listingItem/ListingItem';

export function Listing({ closeListing, openContact }) {

  const [ modal, modalContext ] = Modal.useModal();
  const { state, actions } = useListing();

  const getListing = async () => {
    try {
      await actions.getListing();
    }
    catch(err) {
      console.log(err);
      modal.error({
        title: <span style={state.menuStyle}>{state.strings.operationFailed}</span>,
        content: <span style={state.menuStyle}>{state.strings.tryAgain}</span>,
        bodyStyle: { borderRadius: 8, padding: 16, ...state.menuStyle },
      });
    }
  }
    
  return (
    <ListingWrapper>
      { modalContext }
      <div className={ state.display === 'small' ? 'frame' : 'drawer' }>
        <div className="search">
          { !state.showFilter && (
            <div className="showfilter" onClick={actions.showFilter}>
              <FilterOutlined />
            </div> 
          )}
          { state.showFilter && (
            <div className="hidefilter" onClick={actions.hideFilter}>
              <FilterOutlined />
            </div> 
          )}
          <div className="params">
            <div className="node">
              <Input className="nodeControl" bordered={false} placeholder="Server" 
                  prefix={<DatabaseOutlined />} value={state.node} spellCheck="false" 
                  disabled={state.disabled} onChange={(e) => actions.onNode(e.target.value)} />
            </div>
            { state.showFilter && (
              <div className="node">
                <Input className="nodeControl" bordered={false} placeholder="Username" 
                    prefix={<UserOutlined />} value={state.username} spellCheck="false" 
                    onChange={(e) => actions.setUsername(e.target.value)} />
              </div>
            )}
          </div>
          <div className="inline">
            <Button type="text" icon={<SearchOutlined />} loading={state.busy} onClick={getListing}></Button>
          </div>
          { state.display === 'small' && (
            <div className="inline">
              <Button type="text" icon={<CloseOutlined />} onClick={closeListing}></Button>
            </div>
          )}
        </div>
        <div className="view">
          { state.contacts.length > 0 && (
            <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.contacts} gutter="0"
              renderItem={item => (
                <ListingItem item={item} open={() => openContact(item.guid, item)} />
              )} />
          )}
          { state.contacts.length === 0 && (
            <div className="empty">{ state.strings.noContacts }</div>
          )}
        </div>
      </div>
    </ListingWrapper>
  );
}

