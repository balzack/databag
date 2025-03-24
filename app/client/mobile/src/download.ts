import { Platform, Share } from 'react-native';
import fileType from 'react-native-file-type';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

export async function Download(uri: string, name: string, extension?: string) {

  if (Platform.OS === 'ios') {
    const options = { fileCache: true, filename: name };
    const download = await RNFetchBlob.config(options).fetch('GET', uri);
    const downloadPath = download.path();

    const type = extension ? extension : (await fileType(downloadPath))?.ext;

    const sharePath = `${RNFS.DocumentDirectoryPath}/${name}.${type}`;
    if (await RNFS.exists(sharePath)) {
      await RNFS.unlink(sharePath);
    }
    await RNFS.moveFile(downloadPath, sharePath);

    await Share.share({ url: sharePath });
    await RNFS.unlink(sharePath);
  } else {
    if (uri.startsWith('file:')) {
      const type = extension ? extension : (await fileType(uri))?.ext;
      const sharePath = `${RNFS.DownloadDirectoryPath}/${name}.${type}`;
      if (await RNFS.exists(sharePath)) {
        await RNFS.unlink(sharePath);
      }
      await RNFS.copyFile(uri, sharePath);
      await RNFS.scanFile(sharePath);
    } else {
      const options = { fileCache: true, filename: name };
      const download = await RNFetchBlob.config(options).fetch('GET', uri);
      const downloadPath = download.path();

      const type = extension ? extension : (await fileType(downloadPath))?.ext;
      const sharePath = `${RNFS.DownloadDirectoryPath}/${name}.${type}`;
      if (await RNFS.exists(sharePath)) {
        await RNFS.unlink(sharePath);
      }
      await RNFS.moveFile(downloadPath, sharePath);
      await RNFS.scanFile(sharePath);
    }
  }
}
