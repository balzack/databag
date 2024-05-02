import { MemberOptionWrapper } from './MemberOption.styled';
import { useMemberOption } from './useMemberOption.hook';
import { Logo } from 'logo/Logo';

export function MemberOption({ item, close }) {

  const { state, actions } = useMemberOption(item);
  const profile = item?.data?.cardProfile;
  const detail = item?.data?.cardDetail;

  const handle = () => {
    if (profile?.node) {
      return profile.handle + '@' + profile.node;
    }
    return profile?.handle;
  }

  return (
    <MemberOptionWrapper onClick={close}>
      <Logo url={state.logo} width={32} height={32} radius={8} />
      <div class="details">
        <div class="name">{ profile?.name }</div>
        <div class="handle">{ handle() }</div>
      </div>
    </MemberOptionWrapper>
  );
}

