import { Switch, Tooltip } from 'antd';
import { SelectItemWrapper, Markup } from './SelectItem.styled';
import { useSelectItem } from './useSelectItem.hook';
import { Logo } from 'logo/Logo';

export function SelectItem({ item, select, selected, markup, setItem, clearItem }) {

  const { state } = useSelectItem(item, selected, markup);
  const profile = item?.data?.cardProfile;

  const handle = () => {
    if (profile?.node) {
      return profile.handle + '@' + profile.node;
    }
    return profile?.handle;
  }

  const onSelect = (ev) => {
    if (select) {
      select(item.id);
    }
    if (setItem && !state.selected) {
      setItem(item.id);
    }
    if (clearItem && state.selected) {
      clearItem(item.id);
    }
    ev.stopPropagation()
  }

  return (
    <SelectItemWrapper onClick={onSelect}>
      { state.logoSet && (
        <div className={ state.className }>
          <Logo url={state.logo} width={32} height={32} radius={8} />
          <div className="details">
            <div className="name">{ profile?.name }</div>
            <div className="handle">{ handle() }</div>
          </div>
          { (select || setItem || clearItem) && (
            <div className="switch">
              <Switch checked={state.selected} onChange={(flag, ev) => onSelect(ev)} size="small" />
            </div>
          )}
          { state.markup && (
            <Tooltip placement="left" title="channel host">
              <Markup />
            </Tooltip>
          )}
        </div>
      )}
    </SelectItemWrapper>
  );
}

