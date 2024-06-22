export interface Node {
}

export class NodeModule implements Node {

  private token: string;
  private url: string;

  constructor(token: string, url: string) {
    this.token = token;
    this.url = url;
  }

}
