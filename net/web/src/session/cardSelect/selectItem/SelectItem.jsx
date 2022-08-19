import { Switch } from 'antd';
import { SelectItemWrapper } from './SelectItem.styled';
import { useSelectItem } from './useSelectItem.hook';
import { Logo } from 'logo/Logo';

export function SelectItem({ item, select, selected }) {

  const { state, actions } = useSelectItem(item, selected);
  const profile = item?.data?.cardProfile;
  const detail = item?.data?.cardDetail;

  const handle = () => {
    if (profile?.node) {
      return profile.handle + '@' + profile.node;
    }
    return profile?.handle;
  }

  return (
    <SelectItemWrapper onClick={() => select(item.id)}>
      <Logo url={state.logo} width={32} height={32} radius={8} />
      <div class="details">
        <div class="name">{ profile?.name }</div>
        <div class="handle">{ handle() }</div>
      </div>
      { select && (
        <div class="switch">
          <Switch checked={state.selected} onChange={() => select(item.id)} size="small" />
        </div>
      )}
    </SelectItemWrapper>
  );
}

