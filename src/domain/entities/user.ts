export interface UserProps {
  id: string;
  nome: string;
  email: string;
  senha: string;
  idade: number;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<UserProps, 'senha'>;

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get nome(): string {
    return this.props.nome;
  }

  set nome(value: string) {
    this.props.nome = value;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }

  get senha(): string {
    return this.props.senha;
  }

  set senha(value: string) {
    this.props.senha = value;
    this.touch();
  }

  get idade(): number {
    return this.props.idade;
  }

  set idade(value: number) {
    this.props.idade = value;
    this.touch();
  }

  get endereco(): string {
    return this.props.endereco;
  }

  set endereco(value: string) {
    this.props.endereco = value;
    this.touch();
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  private touch(): void {
    this.props.updatedAt = new Date().toISOString();
  }

  public toSafeObject(): SafeUser {
    const { senha, ...safe } = this.props;
    return safe;
  }

  public toObject(): UserProps {
    return { ...this.props };
  }
}
