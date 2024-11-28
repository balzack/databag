export interface Files {
  read(source: any): Promise<{ size: number, getData: (position: number, length: number)=>Promise<string> }>;
  write(): Promise<{ setData: (data: string)=>Promise<void>, getPath: ()=>Promise<string> }>;
}
