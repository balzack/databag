export interface Staging {
  clear(): Promise<void>;
  read(source: any): Promise<{ size: number, getData: (position: number, length: number)=>Promise<string>, close: ()=>Promise<void> }>;
  write(): Promise<{ setData: (data: string)=>Promise<void>, getUrl: ()=>Promise<string>, close: ()=>Promise<void> }>;
}
