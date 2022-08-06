import avatar from 'images/avatar.png';

export function Logo({ url, width, height, radius }) {
  return (
    <div style={{ borderRadius: radius, overflow: 'hidden' }}>
      { url && (
        <img src={url} alt="logo" width={width} height={height} />
      )}
      { !url && (
        <img src={avatar} alt="default logo" width={width} height={height} />
      )}
    </div>
  );
}
