export interface Admin {
}

export class AdminModule implements Admin {

  private token: string;
  private url: string;

  constructor(token: string, url: string) {
    this.token = token;
    this.url = url;
  }

}
