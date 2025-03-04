import { Staging } from 'databag-client-sdk'
import RNFS from 'react-native-fs';
import fileType from 'react-native-file-type'

export class StagingFiles implements Staging {

  public async clear(): Promise<void> {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    for (const entry of files) {
      if (entry.name.startsWith('dbTmp_')) {
        await RNFS.unlink(entry.path);
      }
    };
  }

  public async read(source: any): Promise<{ size: number, getData: (position: number, length: number)=>Promise<string>, close: ()=>Promise<void> }> {
    const path = source;
    const stat = await RNFS.stat(path);
    const size = stat.size;
    const getData = async (position: number, length: number) => {
      return await RNFS.read(path, length, position, 'base64');
    }
    const close = async ()=>{}
    return { size, getData, close };
  }

  public async write(): Promise<{ setData: (data: string)=>Promise<void>, getUrl: ()=>Promise<string>, close: ()=>Promise<void> }> {
    let set = false;
    let extension = '';
    const path = RNFS.DocumentDirectoryPath + `/dbTmp_${Date.now()}`
    const setData = async (data: string) => {
      set = true;
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
      if (set) {
        try {
          await RNFS.unlink(`${path}${extension}`);
        } catch (err) {
          console.log(err);
        }
      }
    }
    return { setData, getUrl, close };
  }
}  

