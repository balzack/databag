import { ListingItemWrapper } from './ListingItem.styled';
import { Logo } from 'logo/Logo';

export function ListingItem({ item, open }) {

  return (
    <ListingItemWrapper onClick={open}>
      <Logo url={item.logo} width={32} height={32} radius={4} />
      <div className="details">
        <div className="name">{ item.name }</div>
        <div className="handle">{ item.handle }</div>
      </div>
    </ListingItemWrapper>
  );
}
