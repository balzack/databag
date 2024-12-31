import { Media } from 'databag-client-sdk'
import RNFS from 'react-native-fs';

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
    const path = RNFS.DocumentDirectoryPath + `/${Date.now()}.dat`
    const setData = async (data: string) => {
      await RNFS.appendFile(path, data, 'base64');
    }
    const getUrl = async () => {
      return `${path}`
    }
    const close = async () => {
      await RNFS.unlink(path);
    }
    return { setData, getUrl, close };
  }
}  

