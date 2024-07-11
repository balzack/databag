import { Logging } from './api';

export class ConsoleLogging implements Logging {
  public error(m: any): void {
    console.log('error:', m);
  }
  public warn(m: any): void {
    console.log('warn:', m);
  }
  public info(m: any): void {
    console.log('info:', m);
  }
}

