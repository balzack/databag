import { Staging } from 'databag-client-sdk'

export class StagingFiles implements Staging {

  public async clear(): Promise<void> {}

  private base64ToUint8Array(base64: string): Uint8Array {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    } 
    return window.btoa(binary);
  }

  private loadFileData(file: any): Promise<ArrayBuffer> {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onloadend = (res) => { resolve(reader.result as ArrayBuffer) }
      reader.readAsArrayBuffer(file)
    })
  };

  public async read(source: any): Promise<{ size: number, getData: (position: number, length: number)=>Promise<string>, close: ()=>Promise<void> }> {
    const data = await this.loadFileData(source);
    const size = data.byteLength;
    const getData = async (position: number, length: number) => {
      if (position + length > data.byteLength) {
        throw new Error('invalid read request');
      }
      const block = data.slice(position, position + length);
      return this.arrayBufferToBase64(block);
    }

    const close = async () => {}

    return { size, getData, close };
  }

  public async write(): Promise<{ setData: (data: string)=>Promise<void>, getUrl: ()=>Promise<string>, close: ()=>Promise<void> }> {
    const blocks = [] as Uint8Array[];
    let url = null as string | null;

    const setData = async (data: string) => {
      const block = this.base64ToUint8Array(data);
      blocks.push(block);
    }

    const getUrl = async () => {
      if (url) {
        return url;
      }
      const blob = new Blob(blocks);
      url = URL.createObjectURL(blob);
      return url;
    }

    const close = async () => {
      if (url) {
        URL.revokeObjectURL(url);
        url = null;
      }
    }
    
    return { setData, getUrl, close };
  }
}  

