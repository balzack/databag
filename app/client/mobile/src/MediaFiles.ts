import { Media } from 'databag-client-sdk'
import RNFS from 'react-native-fs';
import fileType from 'react-native-file-type'

export class MediaFiles implements Media {

  public async read(source: any): Promise<{ size: number, getData: (position: number, length: number)=>Promise<string>, close: ()=>Promise<void> }> {
    const path = source;
    const stat = await RNFS.stat(path);
    const size = state.size;
    const getData = async (position: number, length: number) => {
      return await RNFS.read(path, length, position, 'base64');
    }
    const close = async ()=>{}
    return { size, getData, close };
  }

  public async write(): Promise<{ setData: (data: string)=>Promise<void>, getUrl: ()=>Promise<string>, close: ()=>Promise<void> }> {
    let extension = '';
    const path = RNFS.DocumentDirectoryPath + `/${Date.now()}`
    const setData = async (data: string) => {
      await RNFS.appendFile(path, data, 'base64');
    }
    const getUrl = async () => {
      if (!extension) {
        try {
          const type = await fileType(path);
          await RNFS.moveFile(path, `${path}.${type.ext}`);
          extension = `.${type.ext}`;
        } catch (err) {
          console.log(err);
          await RNFS.moveFile(path, `${path}.dat`);
          extension = '.dat';
        }
      }
      return `file://${path}${extension}`
    }
    const close = async () => {
      await RNFS.unlink(`${path}${extension}`);
    }
    return { setData, getUrl, close };
  }
}  

