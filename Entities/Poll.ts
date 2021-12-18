import {PollEntry} from "~/Entities/PollEntry";

export class Poll {
  title: string;
  entries: Array<PollEntry>

  constructor(title: string, entries: PollEntry[]) {
    this.title = title;
    this.entries = entries;
  }
}
