import { EventEmitter } from "eventemitter3";
import type { Content, Settings, Logging } from "./api";
import type { Channel, Topic, Asset, Tag, Participant } from "./types";
import { Store } from "./store";

export class ContentModule implements Content {
  private log: Logging;
  private guid: string;
  private token: string;
  private node: string;
  private secure: boolean;
  private settings: Settings;
  private emitter: EventEmitter;

  constructor(
    log: Logging,
    settings: Settings,
    store: Store,
    guid: string,
    token: string,
    node: string,
    secure: boolean,
  ) {
    this.guid = guid;
    this.token = token;
    this.node = node;
    this.secure = secure;
    this.log = log;
    this.settings = settings;
    this.emitter = new EventEmitter();
  }

  public addChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.on("channel", ev);
  }

  public removeChannelListener(ev: (channels: Channel[]) => void): void {
    this.emitter.off("channel", ev);
  }

  public async close(): void {}

  public async setRevision(rev: number): Promise<void> {
    console.log("set content revision:", rev);
  }

  public async addChannel(
    sealed: boolean,
    type: string,
    subject: string,
    cardIds: string[],
    groupIds: string[],
  ): Promise<string> {
    return "";
  }

  public async removeChannel(channelId: string): Promise<void> {}

  public async setChannelSubject(
    channelId: string,
    subject: string,
  ): Promise<void> {}

  public async setChannelCard(
    channelId: string,
    cardId: string,
  ): Promise<void> {}

  public async clearChannelCard(
    channelId: string,
    cardId: string,
  ): Promise<void> {}

  public async setChannelGroup(
    channelId: string,
    groupId: string,
  ): Promise<void> {}

  public async clearChannelGroup(
    channelId: string,
    groupId: string,
  ): Promise<void> {}

  public async addTopic(
    channelId: string,
    type: string,
    subject: string,
    assets: Asset[],
  ): Promise<string> {
    return "";
  }

  public async removeTopic(channelId: string, topicId: string): Promise<void> {}

  public async flagTopic(channelId: string, topicId: string): Promise<void> {}

  public async setTopicSubject(
    channelId: string,
    topicId: string,
    subject: string,
  ): Promise<void> {}

  public async setTopicSort(
    channelId: string,
    topicId: string,
    sort: number,
  ): Promise<void> {}

  public async addTag(
    channelId: string,
    topicId: string,
    type: string,
    value: string,
  ): Promise<string> {
    return "";
  }

  public async removeTag(
    channelId: string,
    topicId: string,
    tagId: string,
  ): Promise<void> {}

  public async setTagSubject(
    channelId: string,
    topicId: string,
    tagId: string,
    subject: string,
  ): Promise<void> {}

  public async setTagSort(
    channelId: string,
    topicId: string,
    tagId: string,
    sort: number,
  ): Promise<void> {}

  public async flagTag(
    channelId: string,
    topicId: string,
    tagId: string,
  ): Promise<void> {}

  public async setBlockTopic(
    channelId: string,
    topicId: string,
  ): Promise<void> {}

  public async setBlockTag(
    channelId: string,
    topicId: string,
    tagId: string,
  ): Promise<void> {}

  public async clearBlockTopic(
    channelId: string,
    topicId: string,
  ): Promise<void> {}

  public async clearBlockTag(
    channelId: string,
    topicId: string,
    tagId: string,
  ): Promise<void> {}

  public async getBlockedTopics(): Promise<
    { channelId: string; topicId: string }[]
  > {
    return [];
  }

  public async getBlockedTags(): Promise<
    { channelId: string; topicId: string; tagId: string }[]
  > {
    return [];
  }

  public async enableNotifications(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableNotifications(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async enableSortTopic(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableSortTopic(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async enableSortTag(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableSortTag(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async enableAddTopic(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableAddTopic(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async enableAddTag(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableAddTag(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async enableAddAsset(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableAddAsset(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async enableAddParticipant(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public async disableAddParticipant(
    channelId: string,
    memberId: string,
  ): Promise<void> {}

  public getTopicAssetUrl(
    channelId: string,
    topicId: string,
    assetId: string,
  ): string {
    return "";
  }

  public async getTopics(channelId: string): Promise<Topic[]> {
    return [];
  }

  public async getMoreTopics(channelId: string): Promise<Topic[]> {
    return [];
  }

  public async getTags(channelId: string, topicId: string): Promise<Tag[]> {
    return [];
  }

  public async getMoreTags(channelId: string, topicId: string): Promise<Tag[]> {
    return [];
  }

  public async setUnreadChannel(channelId: string): Promise<void> {}

  public async clearUnreadChannel(channelId: string): Promise<void> {}

  public async addParticipantAccess(
    channelId: string,
    name: string,
  ): Promise<Participant> {
    return { id: "", guid: "", name: "", server: "", token: "" };
  }

  public async removeParticipantAccess(
    channelId: string,
    repeaterId: string,
  ): Promise<void> {}
}
