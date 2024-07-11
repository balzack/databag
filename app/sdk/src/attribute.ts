import { EventEmitter } from 'eventemitter3';
import type { Attribute, Account, Logging } from './api';
import type { Article } from './types';
import { Store } from './store';

export class AttributeModule implements Attribute {

  private log: Logging;
  private token: string;
  private url: string;
  private account: Account;
  private emitter: EventEmitter;

  constructor(log: Logging, account: Account, store: Store, token: string, url: string) {
    this.token = token;
    this.url = url;
    this.log = log;
    this.account = account;
    this.emitter = new EventEmitter();
  }

  public addCardListener(ev: (articles: Article[]) => void): void {
    this.emitter.on('artcile', ev);
  }

  public removeCardListener(ev: (articles: Article[]) => void): void {
    this.emitter.off('article', ev);
  }

  public close(): void {
  }

  public async setRevision(rev: number): Promise<void> {
    console.log('set attribute revision:', rev);
  }

  public async addArticle(sealed: boolean, type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string> {
    return '';
  }

  public async removeArticle(articleId: string): Promise<void> {
  }

  public async setArticleSubject(articleId: string, subject: string): Promise<void> {
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

