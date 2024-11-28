import { Media } from 'databag-client-sdk'

export class MediaFiles implements Media {
  public async read(source: any): Promise<{ size: number, getData: (position: number, length: number)=>Promise<string> }> {
    return { size: 0, getData: async (position: number, length: number)=>('') };
  }

  public async write(): Promise<{ setData: (data: string)=>Promise<void>, getPath: ()=>Promise<string> }> {
    return { setData: async (data: string)=>{}, getPath: async ()=>('') };
  }
}

