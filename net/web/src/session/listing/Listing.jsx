import { Modal, Button, Drawer, Input, List } from 'antd';
import { ListingWrapper } from './Listing.styled';
import { DatabaseOutlined, SearchOutlined } from '@ant-design/icons';
import { useListing } from './useListing.hook';
import { ListingItem } from './listingItem/ListingItem';

export function Listing({ openContact }) {

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
        <div class="node">
          <Input bordered={false} allowClear={true} placeholder="Server" 
              prefix={<DatabaseOutlined />} value={state.node} spellCheck="false" 
              disabled={state.disabled} onChange={(e) => actions.onNode(e.target.value)} />
        </div>
        <div class="inline">
          <Button type="text" icon={<SearchOutlined />} loading={state.busy} onClick={getListing}></Button>
        </div>
      </div>
      <div class="view">
        <List local={{ emptyText: '' }} itemLayout="horizontal" dataSource={state.contacts} gutter="0"
          renderItem={item => (
            <ListingItem item={item} node={state.node} open={openContact} />
          )} />
      </div>
    </ListingWrapper>
  );
}

