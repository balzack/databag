import { ListingItemWrapper } from './ListingItem.styled';
import { Logo } from 'logo/Logo';

export function ListingItem({ item, open }) {

  return (
    <ListingItemWrapper onClick={open}>
      <Logo url={item.logo} width={32} height={32} radius={4} />
      <div class="details">
        <div class="name">{ item.name }</div>
        <div class="handle">{ item.handle }</div>
      </div>
    </ListingItemWrapper>
  );
}
