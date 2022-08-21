import { Switch, Tooltip } from 'antd';
import { SelectItemWrapper, Markup } from './SelectItem.styled';
import { useSelectItem } from './useSelectItem.hook';
import { Logo } from 'logo/Logo';

export function SelectItem({ item, select, selected, markup }) {

  const { state, actions } = useSelectItem(item, selected, markup);
  const profile = item?.data?.cardProfile;
  const detail = item?.data?.cardDetail;

  const handle = () => {
    if (profile?.node) {
      return profile.handle + '@' + profile.node;
    }
    return profile?.handle;
  }

  const onSelect = () => {
    if (select) {
      select(item.id);
    }
  }

  return (
    <SelectItemWrapper onClick={onSelect}>
      <div class={ state.className }>
        <Logo url={state.logo} width={32} height={32} radius={8} />
        <div class="details">
          <div class="name">{ profile?.name }</div>
          <div class="handle">{ handle() }</div>
        </div>
        { select && (
          <div class="switch">
            <Switch checked={state.selected} onChange={onSelect} size="small" />
          </div>
        )}
        { state.markup && (
          <Tooltip placement="left" title="channel host">
            <Markup />
          </Tooltip>
        )}
      </div>
    </SelectItemWrapper>
  );
}

