import { EventEmitter } from 'events';
import { type Attribute, type Article } from './api';

export class AttributeModule implements Attribute {

  private token: string;
  private url: string;
  private sync: (flag: boolean) => void;
  private emitter: EventEmitter;

  constructor(token: string, url: string, sync: (flag: boolean) => void) {
    this.token = token;
    this.url = url;
    this.sync = sync;
    this.emitter = new EventEmitter();
  }

  public addCardListener(ev: (articles: Article[]) => void): void {
    this.emitter.on('artcile', ev);
  }

  public removeCardListener(ev: (articles: Article[]) => void): void {
    this.emitter.off('article', ev);
  }

  public async setRevision(rev: number): Promise<void> {
  }

  public async resync(): Promise<void> {
  }

  public async addArticle(type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string> {
    return '';
  }

  public async removeArticle(articleId: string): Promise<void> {
  }

  public async setArticleSubject(articleId: string, type: string, subject: string): Promise<void> {
  }

  public async setArticleCard(articleId: string, cardId: string): Promise<void> {
  }

  public async clearArticleCard(articleId: string, cardId: string): Promise<void> {
  }

  public async setArticleGroup(articleId: string, groupId: string): Promise<void> {
  }

  public async clearArticleGroup(articleId: string, groupId: string): Promise<void> {
  }

  public addArticleListener(ev: (articles: Article[]) => void): void {
  }

  public removeArticleListener(ev: (articles: Article[]) => void): void {
  }
}

