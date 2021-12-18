export class PollEntry {
  title: string;
  votes: number;

  constructor(title: string) {
    this.title = title;
    this.votes = 0;
  }
}
