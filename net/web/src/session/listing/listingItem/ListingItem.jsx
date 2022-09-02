import { ListingItemWrapper } from './ListingItem.styled';
import { useListingItem } from './useListingItem.hook';
import { Logo } from 'logo/Logo';

export function ListingItem({ item, node, open }) {

  const { state } = useListingItem(node, item);  

  return (
    <ListingItemWrapper onClick={() => open(item.guid, item)}>
      <Logo url={state.logo} width={32} height={32} radius={8} />
      <div class="details">
        <div class="name">{ state.name }</div>
        <div class="handle">{ state.handle }</div>
      </div>
    </ListingItemWrapper>
  );
}
