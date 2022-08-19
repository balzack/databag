import avatar from 'images/avatar.png';
import appstore from 'images/appstore.png';
import solution from 'images/solution.png';

export function Logo({ url, width, height, radius, img }) {
  return (
    <div style={{ borderRadius: radius, overflow: 'hidden' }}>
      { img === 'appstore' && (
        <img src={appstore} alt="group logo" width={width} height={height} />
      )}
      { img === 'solution' && (
        <img src={solution} alt="notes logo" width={width} height={height} />
      )}
      { url && !img && (
        <img src={url} alt="logo" width={width} height={height} />
      )}
      { !url && !img && (
        <img src={avatar} alt="default logo" width={width} height={height} />
      )}
    </div>
  );
}
