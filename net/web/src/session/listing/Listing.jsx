import { Modal, Button, Input, List } from 'antd';
import { ListingWrapper } from './Listing.styled';
import { UserOutlined, FilterOutlined, DownOutlined, CloseOutlined, DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { useListing } from './useListing.hook';
import { ListingItem } from './listingItem/ListingItem';

export function Listing({ closeListing, openContact }) {

  const { state, actions } = useListing();

  const getListing = async () => {
    try {
      await actions.getListing();
    }
    catch(err) {
      console.log(err);
      Modal.error({
        title: 'Communication Error',
        content: 'Please confirm your server name.',
      });
    }
  }
    
  return (
    <ListingWrapper>
      <div class="search">
        { !state.showFilter && (
          <div class="showfilter" onClick={actions.showFilter}>
            <FilterOutlined />
          </div> 
        )}
        { state.showFilter && (
          <div class="hidefilter" onClick={actions.hideFilter}>
            <FilterOutlined />
          </div> 
        )}
        <div class="params">
          <div class="node">
            <Input bordered={false} allowClear={true} placeholder="Server" 
                prefix={<DatabaseOutlined />} value={state.node} spellCheck="false" 
                disabled={state.disabled} onChange={(e) => actions.onNode(e.target.value)} />
          </div>
          { state.showFilter && (
            <div class="username">
              <Input bordered={false} allowClear={true} placeholder="Username" 
                  prefix={<UserOutlined />} value={state.username} spellCheck="false" 
                  onChange={(e) => actions.setUsername(e.target.value)} />
            </div>
          )}
        </div>
        <div class="inline">
          <Button type="text" icon={<SearchOutlined />} loading={state.busy} onClick={getListing}></Button>
        </div>
        <div class="inline">
          { state.display !== 'small' && (
            <Button type="text" icon={<DownOutlined />} onClick={closeListing}></Button>
          )}
          { state.display === 'small' && (
            <Button type="text" icon={<CloseOutlined />} onClick={closeListing}></Button>
          )}
        </div>
      </div>
      <div class="view">
        { state.contacts.length > 0 && (
          <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.contacts} gutter="0"
            renderItem={item => (
              <ListingItem item={item} node={state.node} open={openContact} />
            )} />
        )}
        { state.contacts.length === 0 && (
          <div class="empty">No Contacts</div>
        )}
      </div>
    </ListingWrapper>
  );
}

