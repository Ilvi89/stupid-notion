import { Email } from "./valueObjects/Email";
import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Password } from "./valueObjects/Password";
import { Device, Session } from "./valueObjects/Session";


export interface UserProps {
  email: Email;
  password: Password;
  // Todo: move email verification props in EmailVO
  isEmailVerified?: boolean;
  username?: string;
  // Todo: convert to value object
  sessions?: Session[];
  deviceHistory?: Device[];
}


export class UserAggregate extends AggregateRoot<UserProps> {

  get email(): Email {
    return this.props.email;
  }

  get currentlyInUseDevices(): Device[] {
    return this.props.sessions.map(s => s.device);
  }

  get username(): string {
    return this.props.username;
  }

  get password(): Password {
    return this.props.password;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  private constructor(id: UniqueEntityID, props: UserProps) {
    super(id, props);
  }

  public static create(id: UniqueEntityID, props: UserProps): UserAggregate {
    // TODO: Add validation
    return new UserAggregate(id, {
      ...props,
      isEmailVerified: props.isEmailVerified || false,
      sessions: props.sessions || [],
      username: props.username || props.email.value
    });
  }

  confirmEmail(email: Email) {
    this.props.email = email;
    this.props.isEmailVerified = true;
  }


  createNewSession(device: Device) {
    if (!this.isEmailVerified)
      throw new Error("Email is not verified");

    this.props.deviceHistory.push(device)
    const session = Session.create({ device: device, lastLogin: new Date() });

    const existedIndex = this.props.sessions.findIndex(s => s.device == device);
    if (existedIndex > -1) {
      this.props.sessions[existedIndex] = session;
      return;
    } else if (this.props.sessions.length >= 5) {
      const oldestSession = this.props.sessions.indexOf(this.props.sessions.reduce((p, c) => p.lastLogin < c.lastLogin ? p : c));
      this.props.sessions[oldestSession] = session;
      return;
    }

    this.props.sessions.push(session);
  }

  dropSession(session: Session) {
    this.props.sessions = this.props.sessions.filter(s => s != session);
  }

  hasUsedDeviceInPast(device: Device): boolean {
    return !!this.props.deviceHistory.find(s => s == device);
  }
}
