export interface MessageProps {
  id: string;
  senderId: string;
  receiverId?: string | null;
  content: string;
  createdAt: string;
}

export class Message {
  private props: MessageProps;

  constructor(props: MessageProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get receiverId(): string | null | undefined {
    return this.props.receiverId;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  public toObject(): MessageProps {
    return { ...this.props };
  }
}
