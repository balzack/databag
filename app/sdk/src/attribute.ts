import { EventEmitter } from "eventemitter3";
import type { Attribute, Settings, Logging } from "./api";
import type { Article } from "./types";
import { Store } from "./store";

export class AttributeModule implements Attribute {
  private log: Logging;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private settings: Settings;
  private emitter: EventEmitter;

  constructor(log: Logging, settings: Settings, store: Store, guid: string, token: string, node: string, secure: boolean) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.settings = settings;
    this.emitter = new EventEmitter();
  }

  public addCardListener(ev: (articles: Article[]) => void): void {
    this.emitter.on("artcile", ev);
  }

  public removeCardListener(ev: (articles: Article[]) => void): void {
    this.emitter.off("article", ev);
  }

  public async close(): void {}

  public async setRevision(rev: number): Promise<void> {
    console.log("set attribute revision:", rev);
  }

  public async addArticle(sealed: boolean, type: string, subject: string, cardIds: string[], groupIds: string[]): Promise<string> {
    return "";
  }

  public async removeArticle(articleId: string): Promise<void> {}

  public async setArticleSubject(articleId: string, subject: string): Promise<void> {}

  public async setArticleCard(articleId: string, cardId: string): Promise<void> {}

  public async clearArticleCard(articleId: string, cardId: string): Promise<void> {}

  public async setArticleGroup(articleId: string, groupId: string): Promise<void> {}

  public async clearArticleGroup(articleId: string, groupId: string): Promise<void> {}

  public addArticleListener(ev: (articles: Article[]) => void): void {}

  public removeArticleListener(ev: (articles: Article[]) => void): void {}
}
