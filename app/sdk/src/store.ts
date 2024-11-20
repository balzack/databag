import { Login, ProfileEntity, defaultProfileEntity, ConfigEntity, defaultConfigEntity } from './entities';
import type { ArticleDetail, ArticleItem, ChannelItem, CardItem, CardProfile, CardDetail, ChannelSummary, ChannelDetail, TopicItem } from './items';
import type { Logging } from './logging';

export interface Store {
  init(): Promise<Login | null>;
  setLogin(login: Login): Promise<void>;
  clearLogin(): Promise<void>;

  getSeal(guid: string): Promise<{ publicKey: string; privateKey: string } | null>;
  setSeal(guid: string, seal: { publicKey: string; privateKey: string }): Promise<void>;
  clearSeal(guid: string): Promise<void>;

  setMarker(guid: string, value: string): Promise<void>;
  clearMarker(guid: string, value: string): Promise<void>;
  getMarkers(guid: string): Promise<string[]>;

  getProfileRevision(guid: string): Promise<number>;
  setProfileRevision(guid: string, revision: number): Promise<void>;
  getProfileData(guid: string): Promise<ProfileEntity>;
  setProfileData(guid: string, data: ProfileEntity): Promise<void>;

  getSettingsRevision(guid: string): Promise<number>;
  setSettingsRevision(guid: string, revision: number): Promise<void>;
  getSettingsData(guid: string): Promise<ConfigEntity>;
  setSettingsData(guid: string, data: ConfigEntity): Promise<void>;

  getContactRevision(guid: string): Promise<number>;
  setContactRevision(guid: string, revision: number): Promise<void>;

  getContacts(guid: string): Promise<{ cardId: string; item: CardItem }[]>;
  addContactCard(guid: string, cardId: string, item: CardItem): Promise<void>;
  removeContactCard(guid: string, cardId: string): Promise<void>;

  setContactCardRevision(guid: string, cardId: string, revision: number): Promise<void>;
  setContactCardProfile(guid: string, cardId: string, profile: CardProfile): Promise<void>;
  setContactCardDetail(guid: string, cardId: string, detail: CardDetail): Promise<void>;

  setContactCardOffsyncProfile(guid: string, cardId: string, revision: number): Promise<void>;
  clearContactCardOffsyncProfile(guid: string, cardId: string): Promise<void>;
  setContactCardOffsyncArticle(guid: string, cardId: string, revision: number): Promise<void>;
  clearContactCardOffsyncArticle(guid: string, cardId: string): Promise<void>;
  setContactCardOffsyncChannel(guid: string, cardId: string, revision: number): Promise<void>;
  clearContactCardOffsyncChannel(guid: string, cardId: string): Promise<void>;

  setContactCardProfileRevision(guid: string, cardId: string, revision: number): Promise<void>;
  setContactCardArticleRevision(guid: string, cardId: string, revision: number): Promise<void>;
  setContactCardChannelRevision(guid: string, cardId: string, revision: number): Promise<void>;

  getContactCardArticles(guid: string): Promise<{ cardId: string; articleId: string; item: ArticleItem }[]>;
  addContactCardArticle(guid: string, cardId: string, articleId: string, item: ArticleItem): Promise<void>;
  removeContactCardArticle(guid: string, cardId: string, articleId: string): Promise<void>;

  setContactCardArticleDetail(guid: string, cardId: string, articleId: string, detail: ChannelDetail, unsealedData: string | null): Promise<void>;
  setContactCardArticleUnsealed(guid: string, cardId: string, articleId: string, unsealedData: string | null): Promise<void>;
  getContactCardChannels(guid: string): Promise<{ cardId: string; channelId: string; item: ChannelItem }[]>;
  addContactCardChannel(guid: string, cardId: string, channelId: string, item: ChannelItem): Promise<void>;
  removeContactCardChannel(guid: string, cardId: string, channelId: string): Promise<void>;

  setContactCardChannelDetail(guid: string, cardId: string, channelId: string, detail: ChannelDetail, unsealedData: string): Promise<void>;
  setContactCardChannelSummary(guid: string, cardId: string, channelId: string, summary: ChannelSummary, unsealedData: string): Promise<void>;
  setContactCardChannelUnsealedDetail(guid: string, cardId: string, channelId: string, data: string | null): Promise<void>;
  setContactCardChannelUnsealedSummary(guid: string, cardId: string, channelId: string, data: string | null): Promise<void>;

  getContentRevision(guid: string): Promise<number>;
  setContentRevision(guid: string, revision: number): Promise<void>;

  addContentChannel(guid: string, channelId: string, item: ChannelItem): Promise<void>;
  removeContentChannel(guid: string, channelId: string): Promise<void>;
  getContentChannels(guid: string): Promise<{ channelId: string; item: ChannelItem }[]>;

  setContentChannelDetail(guid: string, channelId: string, detail: ChannelDetail, unsealedData: string): Promise<void>;
  setContentChannelSummary(guid: string, channelId: string, summary: ChannelSummary, unsealedData: string): Promise<void>;
  setContentChannelUnsealedDetail(guid: string, channelId: string, data: string | null): Promise<void>;
  setContentChannelUnsealedSummary(guid: string, channelId: string, data: string | null): Promise<void>;

  getContentChannelTopicRevision(guid: string, channelId: string): Promise<{ revision: number, marker: number } | null>;
  setContentChannelTopicRevision(guid: string, channelId: string, sync: { revision: number, marker: number }): Promise<void>;
  getContentChannelTopics(guid: string, channelId: string, count: number, position: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]>;
  addContentChannelTopic(guid: string, channelId: string, topicId: string, item: TopicItem): Promise<void>;
  removeContentChannelTopic(guid: string, channelId: string, topicId: string): Promise<void>;

  getContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string): Promise<{ revision: number, marker: number } | null>;
  setContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string, sync: { revision: number, marker: number }): Promise<void>;
  getContactCardChannelTopics(guid: string, cardId: string, channelId: string, count: number, position: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]>;
  addContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string, item: TopicItem): Promise<void>;
  removeContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string): Promise<void>;
}

export interface SqlStore {
  set(stmt: string, params?: (string | number | null)[]): Promise<void>;
  get(stmt: string, params?: (string | number | null)[]): Promise<any[]>;
}

export interface WebStore {
  getValue(key: string): Promise<string>;
  setValue(key: string, value: string): Promise<void>;
  clearValue(key: string): Promise<void>;
  clearAll(): Promise<void>;
}

export class OfflineStore implements Store {
  private sql: SqlStore;
  private log: Logging;

  constructor(log: Logging, sql: SqlStore) {
    this.sql = sql;
    this.log = log;
  }

  private async getValues(guid: string, table: string, fields: string[]): Promise<any[]> {
    return await this.sql.get(`SELECT ${fields.join(', ')} FROM ${table}_${guid}`);
  }
  private async getFilteredOrderedValues(guid: string, table: string, fields: string[], where: {field: string, value: string}[], order: string[], limit: number): Promise<any[]> {
    const sort = order.map(field => (field + ' DESC')).join(', ')
    const condition = `${where.map(({field}) => (field + '=?')).join(' AND ')}`;
    const params = where.map(({value}) => value);
    return await this.sql.get(`SELECT ${fields.join(', ')} FROM ${table}_${guid} WHERE ${condition} ORDER BY ${sort} LIMIT ${limit}`, params);
  }

  private async getFilteredOrderedOffsetValues(guid: string, table: string, fields: string[], where: {field: string, value: string}[], order: string[], primaryOffset: {field: string, value: number}, secondaryOffset: {field: string, value: string}, limit: number): Promise<any[]> {
    const sort = order.map(field => (field + ' DESC')).join(', ')
    const condition = `${where.map(({field}) => (field + '=?')).join(' AND ')} AND (${primaryOffset.field}<? OR (${primaryOffset.field}=? AND ${secondaryOffset.field}<?))`
    const params = [...where.map(({value}) => value), primaryOffset.value, primaryOffset.value, secondaryOffset.value];
    return await this.sql.get(`SELECT ${fields.join(', ')} FROM ${table}_${guid} WHERE ${condition} ORDER BY ${sort} LIMIT ${limit}`, params);
  }

  private async addValue(guid: string, table: string, fields: string[], value: (string | number | null)[]): Promise<void> {
    return await this.sql.set(`INSERT INTO ${table}_${guid} (${fields.join(', ')}) VALUES (${fields.map((field) => '?').join(', ')})`, value);
  }

  private async setValue(guid: string, table: string, idFields: string[], fields: string[], idValues: string[], values: (string | number | null)[]): Promise<void> {
    return await this.sql.set(`UPDATE ${table}_${guid} SET ${fields.map((field) => `${field}=?`).join(',')} WHERE ${idFields.map((idField) => `${idField}=?`).join(' AND ')}`, [
      ...values,
      ...idValues,
    ]);
  }

  private async removeValue(guid: string, table: string, idFields: string[], idValues: (string | number)[]): Promise<void> {
    return await this.sql.set(`DELETE FROM ${table}_${guid} WHERE ${idFields.map((idField) => `${idField}=?`).join(' AND ')}`, idValues);
  }

  private parse(value: string): any {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.log(err);
    }
    return {};
  }

  private async getAppValue(guid: string, id: string, unset: any): Promise<any> {
    try {
      const params = [`${guid}::${id}`];
      const rows = await this.sql.get(`SELECT * FROM app WHERE key=?`, params);
      if (rows.length == 1 && rows[0].value != null) {
        return JSON.parse(rows[0].value);
      }
    } catch (err) {
      console.log(err);
    }
    return unset;
  }

  private async setAppValue(guid: string, id: string, value: any): Promise<void> {
    await this.sql.set('INSERT OR REPLACE INTO app (key, value) values (?, ?)', [`${guid}::${id}`, JSON.stringify(value)]);
  }

  private async clearAppValue(guid: string, id: string): Promise<void> {
    await this.sql.set('INSERT OR REPLACE INTO app (key, value) values (?, null)', [`${guid}::${id}`]);
  }

  private async getTableValue(guid: string, table: string, field: string, where: {field: string, value: string}[], unset: any): Promise<any> {
    try {
      const params = where.map(({value}) => value);
      const rows = await this.sql.get(`SELECT ${field} FROM ${table} WHERE ${where.map(column => (column.field + '=?')).join(' AND ')}`, params)
      if (rows.length == 1 && rows[0].value != null) {
        return this.parse(rows[0].value);
      }
    } catch (err) {
      console.log(err);
    }
    return unset;
  }

  private async setTableValue(guid: string, table: string, record: {field: string, value: string}[], where: {field: string, value: string}[]): Promise<void> {
    const params = [...record.map(({value}) => JSON.stringify(value)), ...where.map(({value}) => value)]
    await this.sql.set(`UPDATE ${table}_${guid} SET ${record.map(({field}) => (field + '=?')).join(', ')} WHERE ${where.map(({field}) => (field + '=?')).join(' AND ')}`, params);
  }

  private async clearTableValue(guid: string, table: string, field: string, where: {field: string, value: string}[]): Promise<void> {
    const params = where.map(({value}) => (value));
    await this.sql.set(`UPDATE ${table}_${guid} SET ${field}=null WHERE ${where.map(column => (column.field + '=?' + column.value)).join(' AND ')}`, params);
  }

  private async initLogin(guid: string): Promise<void> {
    await this.sql.set(
      `CREATE TABLE IF NOT EXISTS channel_${guid} (channel_id text, detail text, unsealed_detail text, summary text, unsealed_summary text, sync text, unique(channel_id))`,
    );
    await this.sql.set(
      `CREATE TABLE IF NOT EXISTS channel_topic_${guid} (channel_id text, topic_id text, position real, detail text, unsealed_detail text, unique(channel_id, topic_id))`,
    );
    await this.sql.set(
      `CREATE TABLE IF NOT EXISTS card_${guid} (card_id text, revision integer, detail text, profile text, offsync_profile integer, offsync_article integer, offsync_channel integer, profile_revision, article_revision, channel_revision, unique(card_id))`,
    );
    await this.sql.set(
      `CREATE TABLE IF NOT EXISTS card_channel_${guid} (card_id text, channel_id text, detail text, unsealed_detail text, summary text, unsealed_summary text, sync text, unique(card_id, channel_id))`,
    );
    await this.sql.set(
      `CREATE TABLE IF NOT EXISTS card_channel_topic_${guid} (card_id text, channel_id text, topic_id text, position real, detail text, unsealed_detail text, unique(card_id, channel_id, topic_id))`,
    );
    await this.sql.set(`CREATE TABLE IF NOT EXISTS marker_${guid} (value text)`);


    await this.sql.set(
      `CREATE INDEX IF NOT EXISTS card_channel_topic_sort_${guid} ON card_channel_topic_${guid} (card_id, channel_id, topic_id, position)`,
    );
    await this.sql.set(
      `CREATE INDEX IF NOT EXISTS channel_topic_sort_${guid} ON channel_topic_${guid} (channel_id, topic_id, position)`,
    );
  }

  public async init(): Promise<Login | null> {
    await this.sql.set('CREATE TABLE IF NOT EXISTS app (key text, value text, unique(key));');
    return (await this.getAppValue('', 'login', null)) as Login | null;
  }

  public async setMarker(guid: string, value: string) {
    await this.addValue(guid, 'marker', ['value'], [value]);
  }

  public async clearMarker(guid: string, value: string) {
    await this.removeValue(guid, 'marker', ['value'], [value]);
  }

  public async getMarkers(guid: string): Promise<string[]> {
    return (await this.getValues(guid, 'marker', ['value'])).map((marker) => marker.value);
  }

  public async setLogin(login: Login): Promise<void> {
    await this.initLogin(login.guid);
    await this.setAppValue('', 'login', login);
  }

  public async clearLogin(): Promise<void> {
    await this.clearAppValue('', 'login');
  }

  public async getSeal(guid: string): Promise<{ publicKey: string; privateKey: string } | null> {
    return (await this.getAppValue(guid, 'seal', null)) as {
      publicKey: string;
      privateKey: string;
    } | null;
  }

  public async setSeal(guid: string, seal: { publicKey: string; privateKey: string }): Promise<void> {
    await this.setAppValue(guid, 'seal', seal);
  }

  public async clearSeal(guid: string): Promise<void> {
    await this.clearAppValue(guid, 'seal');
  }

  public async getProfileRevision(guid: string): Promise<number> {
    return (await this.getAppValue(guid, 'profile_revision', 0)) as number;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {
    await this.setAppValue(guid, 'profile_revision', revision);
  }

  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return (await this.getAppValue(guid, 'profile_data', defaultProfileEntity)) as ProfileEntity;
  }

  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {
    await this.setAppValue(guid, 'profile_data', data);
  }

  public async getSettingsRevision(guid: string): Promise<number> {
    return (await this.getAppValue(guid, 'account_revision', 0)) as number;
  }

  public async setSettingsRevision(guid: string, revision: number): Promise<void> {
    await this.setAppValue(guid, 'account_revision', revision);
  }

  public async getSettingsData(guid: string): Promise<ConfigEntity> {
    return (await this.getAppValue(guid, 'account_data', defaultConfigEntity)) as ConfigEntity;
  }

  public async setSettingsData(guid: string, data: ConfigEntity): Promise<void> {
    await this.setAppValue(guid, 'account_data', data);
  }

  public async getContactRevision(guid: string): Promise<number> {
    return (await this.getAppValue(guid, 'contact_revision', 0)) as number;
  }

  public async setContactRevision(guid: string, revision: number): Promise<void> {
    await this.setAppValue(guid, 'contact_revision', revision);
  }

  public async getContacts(guid: string): Promise<{ cardId: string; item: CardItem }[]> {
    const cards = await this.getValues(guid, 'card', [
      'offsync_profile',
      'offsync_article',
      'offsync_channel',
      'revision',
      'card_id',
      'profile',
      'detail',
      'profile_revision',
      'article_revision',
      'channel_revision',
    ]);
    return cards.map((card) => ({
      cardId: card.card_id,
      item: {
        offsyncProfile: card.offsync_profile,
        offsyncArticle: card.offsync_article,
        offsyncChannel: card.offsync_channel,
        revision: card.revision,
        profile: this.parse(card.profile),
        detail: this.parse(card.detail),
        profileRevision: card.profile_revision,
        articleRevision: card.article_revision,
        channelRevision: card.channel_revision,
      },
    }));
  }

  public async addContactCard(guid: string, cardId: string, item: CardItem): Promise<void> {
    const fields = ['card_id', 'offsync_profile', 'offsync_article', 'offsync_channel', 'revision', 'profile', 'detail', 'profile_revision', 'article_revision', 'channel_revision'];
    const { offsyncProfile, offsyncArticle, offsyncChannel, revision, profile, detail, profileRevision, articleRevision, channelRevision } = item;
    const value = [cardId, offsyncProfile, offsyncArticle, offsyncChannel, revision, JSON.stringify(profile), JSON.stringify(detail), profileRevision, articleRevision, channelRevision];
    await this.addValue(guid, 'card', fields, value);
  }

  public async removeContactCard(guid: string, cardId: string): Promise<void> {
    await this.removeValue(guid, 'card', ['card_id'], [cardId]);
    await this.removeValue(guid, 'card_channel', ['card_id'], [cardId]);
    await this.removeValue(guid, 'card_channel_topic', ['card_id'], [cardId]);
  }

  public async setContactCardRevision(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['revision'], [cardId], [revision]);
  }

  public async setContactCardProfile(guid: string, cardId: string, profile: CardProfile): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['profile'], [cardId], [JSON.stringify(profile)]);
  }

  public async setContactCardDetail(guid: string, cardId: string, detail: CardDetail): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['detail'], [cardId], [JSON.stringify(detail)]);
  }

  public async setContactCardOffsyncProfile(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['offsync_profile'], [cardId], [revision]);
  }

  public async clearContactCardOffsyncProfile(guid: string, cardId: string): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['offsync_profile'], [cardId], [null]);
  }

  public async setContactCardOffsyncArticle(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['offsync_article'], [cardId], [revision]);
  }

  public async clearContactCardOffsyncArticle(guid: string, cardId: string): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['offsync_article'], [cardId], [null]);
  }

  public async setContactCardOffsyncChannel(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['offsync_channel'], [cardId], [revision]);
  }

  public async clearContactCardOffsyncChannel(guid: string, cardId: string): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['offsync_channel'], [cardId], [null]);
  }

  public async setContactCardProfileRevision(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['profile_revision'], [cardId], [revision]);
  }

  public async setContactCardArticleRevision(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['article_revision'], [cardId], [revision]);
  }

  public async setContactCardChannelRevision(guid: string, cardId: string, revision: number): Promise<void> {
    await this.setValue(guid, 'card', ['card_id'], ['channel_revision'], [cardId], [revision]);
  }

  public async getContactCardChannels(guid: string): Promise<{ cardId: string; channelId: string; item: ChannelItem }[]> {
    const channels = await this.getValues(guid, 'card_channel', ['card_id', 'channel_id', 'detail', 'unsealed_detail', 'summary', 'unsealed_summary']);
    return channels.map((channel) => ({
      cardId: channel.card_id,
      channelId: channel.channel_id,
      item: {
        detail: this.parse(channel.detail),
        summary: this.parse(channel.summary),
        unsealedDetail: this.parse(channel.unsealed_detail),
        unsealedSummary: this.parse(channel.unsealed_summary),
        channelKey: null,
      },
    }));
  }

  public async addContactCardChannel(guid: string, cardId: string, channelId: string, item: ChannelItem): Promise<void> {
    const fields = ['card_id', 'channel_id', 'detail', 'unsealed_detail', 'summary', 'unsealed_summary'];
    const { detail, unsealedDetail, summary, unsealedSummary } = item;
    const value = [cardId, channelId, JSON.stringify(detail), JSON.stringify(unsealedDetail), JSON.stringify(summary), JSON.stringify(unsealedSummary)];
    await this.addValue(guid, 'card_channel', fields, value);
  }

  public async removeContactCardChannel(guid: string, cardId: string, channelId: string): Promise<void> {
    await this.removeValue(guid, 'card_channel', ['card_id', 'channel_id'], [cardId, channelId]);
    await this.removeValue(guid, 'card_channel_topic', ['card_id', 'channel_id'], [cardId, channelId]);
  }

  public async setContactCardChannelDetail(guid: string, cardId: string, channelId: string, detail: ChannelDetail, unsealedDetail: any): Promise<void> {
    await this.setValue(guid, 'card_channel', ['card_id', 'channel_id'], ['detail', 'unsealed_detail'], [cardId, channelId], [JSON.stringify(detail), JSON.stringify(unsealedDetail)]);
  }

  public async setContactCardChannelSummary(guid: string, cardId: string, channelId: string, summary: ChannelSummary, unsealedSummary: any): Promise<void> {
    await this.setValue(guid, 'card_channel', ['card_id', 'channel_id'], ['summary', 'unsealed_summary'], [cardId, channelId], [JSON.stringify(summary), JSON.stringify(unsealedSummary)]);
  }

  public async setContactCardChannelUnsealedDetail(guid: string, cardId: string, channelId: string, unsealedDetail: any): Promise<void> {
    await this.setValue(guid, 'card_channel', ['card_id', 'channel_id'], ['unsealed_detail'], [cardId, channelId], [JSON.stringify(unsealedDetail)]);
  }

  public async setContactCardChannelUnsealedSummary(guid: string, cardId: string, channelId: string, unsealedSummary: any): Promise<void> {
    await this.setValue(guid, 'card_channel', ['card_id', 'channel_id'], ['unsealed_summary'], [cardId, channelId], [JSON.stringify(unsealedSummary)]);
  }

  public async getContactCardArticles(guid: string): Promise<{ cardId: string; articleId: string; item: ArticleItem }[]> {
    return [];
  }
  public async addContactCardArticle(guid: string, cardId: string, articleId: string, item: ArticleItem): Promise<void> {}
  public async removeContactCardArticle(guid: string, cardId: string, articleId: string): Promise<void> {}
  public async setContactCardArticleDetail(guid: string, cardId: string, articleId: string, detail: ChannelDetail, unsealedData: string | null): Promise<void> {}
  public async setContactCardArticleUnsealed(guid: string, cardId: string, articleId: string, unsealedData: string | null): Promise<void> {}

  public async getContentRevision(guid: string): Promise<number> {
    return (await this.getAppValue(guid, 'content_revision', 0)) as number;
  }

  public async setContentRevision(guid: string, revision: number): Promise<void> {
    await this.setAppValue(guid, 'content_revision', revision);
  }

  public async getContentChannels(guid: string): Promise<{ channelId: string; item: ChannelItem }[]> {
    const channels = await this.getValues(guid, 'channel', ['channel_id', 'detail', 'unsealed_detail', 'summary', 'unsealed_summary']);
    return channels.map((channel) => ({
      channelId: channel.channel_id,
      item: {
        detail: this.parse(channel.detail),
        summary: this.parse(channel.summary),
        unsealedDetail: this.parse(channel.unsealed_detail),
        unsealedSummary: this.parse(channel.unsealed_summary),
        channelKey: null,
      },
    }));
  }

  public async addContentChannel(guid: string, channelId: string, item: ChannelItem): Promise<void> {
    const fields = ['channel_id', 'detail', 'unsealed_detail', 'summary', 'unsealed_summary'];
    const { detail, unsealedDetail, summary, unsealedSummary } = item;
    const value = [channelId, JSON.stringify(detail), JSON.stringify(unsealedDetail), JSON.stringify(summary), JSON.stringify(unsealedSummary)];
    await this.addValue(guid, 'channel', fields, value);
  }

  public async removeContentChannel(guid: string, channelId: string): Promise<void> {
    await this.removeValue(guid, 'channel', ['channel_id'], [channelId]);
    await this.removeValue(guid, 'channel_topic', ['channel_id'], [channelId]);
  }

  public async setContentChannelDetail(guid: string, channelId: string, detail: ChannelDetail, unsealedDetail: any): Promise<void> {
    await this.setValue(guid, 'channel', ['channel_id'], ['detail', 'unsealed_detail'], [channelId], [JSON.stringify(detail), JSON.stringify(unsealedDetail)]);
  }

  public async setContentChannelSummary(guid: string, channelId: string, summary: ChannelSummary, unsealedSummary: any): Promise<void> {
    await this.setValue(guid, 'channel', ['channel_id'], ['summary', 'unsealed_summary'], [channelId], [JSON.stringify(summary), JSON.stringify(unsealedSummary)]);
  }

  public async setContentChannelUnsealedDetail(guid: string, channelId: string, unsealedDetail: any): Promise<void> {
    await this.setValue(guid, 'channel', ['channel_id'], ['unsealed_detail'], [channelId], [JSON.stringify(unsealedDetail)]);
  }

  public async setContentChannelUnsealedSummary(guid: string, channelId: string, unsealedSummary: any): Promise<void> {
    await this.setValue(guid, 'channel', ['channel_id'], ['unsealed_summary'], [channelId], [JSON.stringify(unsealedSummary)]);
  }

  public async getContentChannelTopicRevision(guid: string, channelId: string): Promise<{ revision: number, marker: number } | null> {
    return await this.getTableValue(guid, 'channel', 'sync', [{field: 'channel_id', value: channelId}], null);
  }
  public async setContentChannelTopicRevision(guid: string, channelId: string, sync: { revision: number, marker: number }): Promise<void> {
    await this.setTableValue(guid, 'channel', [{field: 'sync', value: JSON.stringify(sync)}], [{field: 'channel_id', value: channelId}]);
  }
  public async getContentChannelTopics(guid: string, channelId: string, count: number, offset: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]> {
    const fields = ['topic_id', 'detail', 'unsealed_detail', 'position'];
    const where = [{field: 'channel_id', value: channelId}];
    const order = ['position', 'topic_id'];
    const topics = offset ?
      await this.getFilteredOrderedOffsetValues(guid, 'channel_topic', fields, where, order, {field: 'position', value: offset.position}, {field: 'topic_id', value: offset.topicId}, count) :
      await this.getFilteredOrderedValues(guid, 'channel_topic', fields, where, order, count); 
    return topics.map((topic) => ({
      topicId: topic.topic_id,
      item: {
        detail: this.parse(topic.detail),
        unsealedDetail: this.parse(topic.unsealed_detail),
        position: topic.position,
      },
    })); 
  }
  public async addContentChannelTopic(guid: string, channelId: string, topicId: string, item: TopicItem): Promise<void> { 
    const fields = ['channel_id', 'topic_id', 'detail', 'unsealed_detail', 'position'];
    const { detail, unsealedDetail, position } = item;
    const value = [channelId, topicId, JSON.stringify(detail), JSON.stringify(unsealedDetail), position];
    await this.addValue(guid, 'channel_topic', fields, value);
  }
  public async removeContentChannelTopic(guid: string, channelId: string, topicId: string): Promise<void> {
    await this.removeValue(guid, 'channel_topic', ['channel_id', 'topic_id'], [channelId, topicId]);
  }
  public async getContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string): Promise<{ revision: number, marker: number } | null> {
    return await this.getTableValue(guid, 'card_channel', 'sync', [{field: 'card_id', value: cardId},{field: 'channel_id', value: channelId}], null);
  }
  public async setContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string, sync: { revision: number, marker: number }): Promise<void> {
    return await this.setTableValue(guid, 'card_channel', [{field: 'sync', value: JSON.stringify(sync)}], [{field: 'card_id', value: cardId}, {field: 'channel_id', value: channelId}]);
  }
  public async getContactCardChannelTopics(guid: string, cardId: string, channelId: string, count: number, offset: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]> {
    const fields = ['topic_id', 'detail', 'unsealed_detail', 'position'];
    const where = [{field: 'card_id', value: cardId}, {field: 'channel_id', value: channelId}];
    const order = ['position', 'topic_id'];
    const topics = offset ? 
      await this.getFilteredOrderedOffsetValues(guid, 'card_channel_topic', fields, where, order, {field: 'position', value: offset.position}, {field: 'topic_id', value: offset.topicId}, count) :
      await this.getFilteredOrderedValues(guid, 'card_channel_topic', fields, where, order, count);
    return topics.map((topic) => ({
      topicId: topic.topic_id,
      item: {
        detail: this.parse(topic.detail),
        unsealedDetail: this.parse(topic.unsealed_detail),
        position: topic.position,
      },
    })); 
  }
  public async addContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string, item: TopicItem): Promise<void> {
    const fields = ['card_id', 'channel_id', 'topic_id', 'detail', 'unsealed_detail', 'position'];
    const { detail, unsealedDetail, position } = item;
    const value = [cardId, channelId, topicId, JSON.stringify(detail), JSON.stringify(unsealedDetail), position];
    await this.addValue(guid, 'channel_topic', fields, value);
  }
  public async removeContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string): Promise<void> {
    await this.removeValue(guid, 'channel_topic', ['card_id', 'channel_id', 'topic_id'], [cardId, channelId, topicId]);
  }
}

export class OnlineStore implements Store {
  private web: WebStore;
  private log: Logging;

  constructor(log: Logging, web: WebStore) {
    this.web = web;
    this.log = log;
  }

  private async getAppValue(guid: string, id: string, unset: any): Promise<any> {
    const value = await this.web.getValue(`${guid}::${id}`);
    if (value != null) {
      return JSON.parse(value);
    }
    return unset;
  }

  private async setAppValue(guid: string, id: string, value: any): Promise<void> {
    await this.web.setValue(`${guid}::${id}`, JSON.stringify(value));
  }

  private async clearAppValue(guid: string, id: string): Promise<void> {
    await this.web.clearValue(`${guid}::${id}`);
  }

  public async init(): Promise<Login | null> {
    return (await this.getAppValue('', 'login', null)) as Login | null;
  }

  public async setMarker(guid: string, value: string) {
    const markers = await this.getAppValue(guid, 'marker', []);
    markers.push(value);
    this.setAppValue(guid, 'marker', markers);
  }

  public async clearMarker(guid: string, value: string) {
    const markers = (await this.getAppValue(guid, 'marker', [])) as string[];
    this.setAppValue(
      guid,
      'marker',
      markers.filter((marker) => value != marker),
    );
  }

  public async getMarkers(guid: string): Promise<string[]> {
    return (await this.getAppValue(guid, 'marker', [])) as string[];
  }

  public async setLogin(login: Login): Promise<void> {
    await this.setAppValue('', 'login', login);
  }

  public async clearLogin(): Promise<void> {
    await this.clearAppValue('', 'login');
  }

  public async getSeal(guid: string): Promise<{ publicKey: string; privateKey: string } | null> {
    return (await this.getAppValue(guid, 'seal', null)) as {
      publicKey: string;
      privateKey: string;
    } | null;
  }

  public async setSeal(guid: string, seal: { publicKey: string; privateKey: string }): Promise<void> {
    await this.setAppValue(guid, 'seal', seal);
  }

  public async clearSeal(guid: string): Promise<void> {
    await this.clearAppValue(guid, 'seal');
  }

  public async getProfileRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {}

  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return defaultProfileEntity;
  }

  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {}

  public async getSettingsRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setSettingsRevision(guid: string, revision: number): Promise<void> {}

  public async getSettingsData(guid: string): Promise<ConfigEntity> {
    return defaultConfigEntity;
  }

  public async setSettingsData(guid: string, data: ConfigEntity): Promise<void> {}

  public async getContactRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setContactRevision(guid: string, revision: number): Promise<void> {}

  public async getContacts(guid: string): Promise<{ cardId: string; item: CardItem }[]> {
    return [];
  }

  public async addContactCard(guid: string, cardId: string, item: CardItem): Promise<void> {}

  public async removeContactCard(guid: string, cardId: string): Promise<void> {}

  public async setContactCardRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async setContactCardProfile(guid: string, cardId: string, profile: CardProfile): Promise<void> {}

  public async setContactCardDetail(guid: string, cardId: string, detail: CardDetail): Promise<void> {}

  public async setContactCardOffsyncProfile(guid: string, cardId: string, revision: number): Promise<void> {}

  public async clearContactCardOffsyncProfile(guid: string, cardId: string): Promise<void> {}

  public async setContactCardOffsyncArticle(guid: string, cardId: string, revision: number): Promise<void> {}

  public async clearContactCardOffsyncArticle(guid: string, cardId: string): Promise<void> {}

  public async setContactCardOffsyncChannel(guid: string, cardId: string, revision: number): Promise<void> {}

  public async clearContactCardOffsyncChannel(guid: string, cardId: string): Promise<void> {}

  public async setContactCardProfileRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async setContactCardArticleRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async setContactCardChannelRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async getContactCardArticles(guid: string): Promise<{ cardId: string; articleId: string; item: ArticleItem }[]> {
    return [];
  }

  public async addContactCardArticle(guid: string, cardId: string, articleId: string, item: ArticleItem): Promise<void> {}

  public async removeContactCardArticle(guid: string, cardId: string, articleId: string): Promise<void> {}

  public async setContactCardArticleDetail(guid: string, cardId: string, articleId: string, detail: ChannelDetail, unsealedData: string | null): Promise<void> {}

  public async setContactCardArticleUnsealed(guid: string, cardId: string, articleId: string, unsealedData: string | null): Promise<void> {}

  public async getContactCardChannels(guid: string): Promise<{ cardId: string; channelId: string; item: ChannelItem }[]> {
    return [];
  }

  public async addContactCardChannel(guid: string, cardId: string, channelId: string, item: ChannelItem): Promise<void> {}

  public async removeContactCardChannel(guid: string, cardId: string, channelId: string): Promise<void> {}

  public async setContactCardChannelDetail(guid: string, cardId: string, channelId: string, detail: ChannelDetail, unsealedDetail: any): Promise<void> {}

  public async setContactCardChannelSummary(guid: string, cardId: string, channelId: string, summary: ChannelSummary, unsealedSummary: any): Promise<void> {}

  public async setContactCardChannelUnsealedDetail(guid: string, cardId: string, channelId: string, unsealedDetail: any): Promise<void> {}

  public async setContactCardChannelUnsealedSummary(guid: string, cardId: string, channelId: string, unsealedSummary: any): Promise<void> {}

  public async getContentRevision(guid: string): Promise<number> {
    return 0;
  }
  public async setContentRevision(guid: string, revision: number): Promise<void> {}

  public async addContentChannel(guid: string, channelId: string, item: ChannelItem): Promise<void> {}
  public async removeContentChannel(guid: string, channelId: string): Promise<void> {}
  public async getContentChannels(guid: string): Promise<{ channelId: string; item: ChannelItem }[]> {
    return [];
  }

  public async setContentChannelDetail(guid: string, channelId: string, detail: ChannelDetail, unsealedDetail: any): Promise<void> {}
  public async setContentChannelSummary(guid: string, channelId: string, summary: ChannelSummary, unsealedSummary: any): Promise<void> {}
  public async setContentChannelUnsealedDetail(guid: string, channelId: string, unsealedDetail: any): Promise<void> {}
  public async setContentChannelUnsealedSummary(guid: string, channelId: string, unsealedSummary: any): Promise<void> {}

  public async getContentChannelTopicRevision(guid: string, channelId: string): Promise<{ revision: number, marker: number } | null> {
    return null;
  }
  public async setContentChannelTopicRevision(guid: string, channelId: string, sync: { revision: number, marker: number }): Promise<void> {
  }
  public async getContentChannelTopics(guid: string, channelId: string, count: number, position: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]> {
    return [];
  }
  public async addContentChannelTopic(guid: string, channelId: string, topicId: string, item: TopicItem): Promise<void> { }
  public async removeContentChannelTopic(guid: string, channelId: string, topicId: string): Promise<void> { }
  
  public async getContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string): Promise<{ revision: number, marker: number } | null> {
    return null;
  }
  public async setContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string, sync: { revision: number, marker: number }): Promise<void> {
  }
  public async getContactCardChannelTopics(guid: string, cardId: string, channelId: string, count: number, position: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]> {
    return [];
  }
  public async addContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string, item: TopicItem): Promise<void> { }
  public async removeContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string): Promise<void> { }
}

export class NoStore implements Store {
  constructor() {}

  public async init(): Promise<Login | null> {
    return null;
  }

  public async setMarker(guid: string, marker: string): Promise<void> {}

  public async clearMarker(guid: string, marker: string): Promise<void> {}

  public async getMarkers(guid: string): Promise<string[]> {
    return [];
  }

  public async setLogin(login: Login): Promise<void> {}

  public async clearLogin(): Promise<void> {}

  public async getSeal(guid: string): Promise<{ publicKey: string; privateKey: string } | null> {
    return null;
  }

  public async setSeal(guid: string, seal: { publicKey: string; privateKey: string }): Promise<void> {}

  public async clearSeal(guid: string): Promise<void> {}

  public async getProfileRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setProfileRevision(guid: string, revision: number): Promise<void> {}

  public async getProfileData(guid: string): Promise<ProfileEntity> {
    return defaultProfileEntity;
  }

  public async setProfileData(guid: string, data: ProfileEntity): Promise<void> {}

  public async getSettingsRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setSettingsRevision(guid: string, revision: number): Promise<void> {}

  public async getSettingsData(guid: string): Promise<ConfigEntity> {
    return defaultConfigEntity;
  }

  public async setSettingsData(guid: string, data: ConfigEntity): Promise<void> {}

  public async getContactRevision(guid: string): Promise<number> {
    return 0;
  }

  public async setContactRevision(guid: string, revision: number): Promise<void> {}

  public async getContacts(guid: string): Promise<{ cardId: string; item: CardItem }[]> {
    return [];
  }

  public async addContactCard(guid: string, cardId: string, item: CardItem): Promise<void> {}

  public async removeContactCard(guid: string, cardId: string): Promise<void> {}

  public async setContactCardRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async setContactCardProfile(guid: string, cardId: string, profile: CardProfile): Promise<void> {}

  public async setContactCardDetail(guid: string, cardId: string, detail: CardDetail): Promise<void> {}

  public async setContactCardOffsyncProfile(guid: string, cardId: string, revision: number): Promise<void> {}

  public async clearContactCardOffsyncProfile(guid: string, cardId: string): Promise<void> {}

  public async setContactCardOffsyncArticle(guid: string, cardId: string, revision: number): Promise<void> {}

  public async clearContactCardOffsyncArticle(guid: string, cardId: string): Promise<void> {}

  public async setContactCardOffsyncChannel(guid: string, cardId: string, revision: number): Promise<void> {}

  public async clearContactCardOffsyncChannel(guid: string, cardId: string): Promise<void> {}

  public async setContactCardProfileRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async setContactCardArticleRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async setContactCardChannelRevision(guid: string, cardId: string, revision: number): Promise<void> {}

  public async getContactCardArticles(guid: string): Promise<{ cardId: string; articleId: string; item: ArticleItem }[]> {
    return [];
  }

  public async addContactCardArticle(guid: string, cardId: string, articleId: string, item: ArticleItem): Promise<void> {}

  public async removeContactCardArticle(guid: string, cardId: string, articleId: string): Promise<void> {}

  public async setContactCardArticleDetail(guid: string, cardId: string, articleId: string, detail: ChannelDetail, unsealedData: string | null): Promise<void> {}

  public async setContactCardArticleUnsealed(guid: string, cardId: string, articleId: string, unsealedData: string | null): Promise<void> {}

  public async getContactCardChannels(guid: string): Promise<{ cardId: string; channelId: string; item: ChannelItem }[]> {
    return [];
  }

  public async addContactCardChannel(guid: string, cardId: string, channelId: string, item: ChannelItem): Promise<void> {}

  public async removeContactCardChannel(guid: string, cardId: string, channelId: string): Promise<void> {}

  public async setContactCardChannelDetail(guid: string, cardId: string, channelId: string, detail: ChannelDetail, unsealedDetail: any): Promise<void> {}

  public async setContactCardChannelSummary(guid: string, cardId: string, channelId: string, summary: ChannelSummary, unsealedSummary: any): Promise<void> {}

  public async setContactCardChannelUnsealedDetail(guid: string, cardId: string, channelId: string, unsealedDetail: any): Promise<void> {}

  public async setContactCardChannelUnsealedSummary(guid: string, cardId: string, channelId: string, unsealedSummary: any): Promise<void> {}

  public async getContentRevision(guid: string): Promise<number> {
    return 0;
  }
  public async setContentRevision(guid: string, revision: number): Promise<void> {}

  public async addContentChannel(guid: string, channelId: string, item: ChannelItem): Promise<void> {}
  public async removeContentChannel(guid: string, channelId: string): Promise<void> {}
  public async getContentChannels(guid: string): Promise<{ channelId: string; item: ChannelItem }[]> {
    return [];
  }

  public async setContentChannelDetail(guid: string, channelId: string, detail: ChannelDetail, unsealedDetail: any): Promise<void> {}
  public async setContentChannelSummary(guid: string, channelId: string, summary: ChannelSummary, unsealedSummary: any): Promise<void> {}
  public async setContentChannelUnsealedDetail(guid: string, channelId: string, unsealedDetail: any): Promise<void> {}
  public async setContentChannelUnsealedSummary(guid: string, channelId: string, unsealedSummary: any): Promise<void> {}

  public async getContentChannelTopicRevision(guid: string, channelId: string): Promise<{ revision: number, marker: number } | null> {
    return null;
  }
  public async setContentChannelTopicRevision(guid: string, channelId: string, sync: { revision: number, marker: number }): Promise<void> {
  }
  public async getContentChannelTopics(guid: string, channelId: string, count: number, position: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]> {
    return [];
  }
  public async addContentChannelTopic(guid: string, channelId: string, topicId: string, item: TopicItem): Promise<void> { }
  public async removeContentChannelTopic(guid: string, channelId: string, topicId: string): Promise<void> { }
 
  public async getContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string): Promise<{ revision: number, marker: number } | null> {
    return null;
  } 
  public async setContactCardChannelTopicRevision(guid: string, cardId: string, channelId: string, sync: { revision: number, marker: number }): Promise<void> {
  }
  public async getContactCardChannelTopics(guid: string, cardId: string, channelId: string, count: number, position: { topicId: string, position: number } | null): Promise<{ topicId: string, item: TopicItem }[]> {
    return [];
  }
  public async addContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string, item: TopicItem): Promise<void> { }
  public async removeContactCardChannelTopic(guid: string, cardId: string, channelId: string, topicId: string): Promise<void> { }
}
