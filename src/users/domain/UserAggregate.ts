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
  //  deviceHistory rename to trustedDevices
  sessions?: Session[];
  trustedDevices?: Device[];
}


export class UserAggregate extends AggregateRoot<UserProps> {
  private constructor(id: UniqueEntityID, props: UserProps) {
    super(id, props);
  }

  get trustedDevices(): Device[] {
    return this.props.trustedDevices;
  }

  get sessions(): Session[] {
    return this.props.sessions;
  };

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

  public static create(id: UniqueEntityID, props: UserProps): UserAggregate {
    // TODO: Add validation
    return new UserAggregate(id, {
      ...props,
      isEmailVerified: props.isEmailVerified || false,
      sessions: props.sessions || [],
      username: props.username || props.email.value,
      trustedDevices: props.trustedDevices || []
    });
  }

  confirmEmail(email: Email) {
    this.props.email = email;
    this.props.isEmailVerified = true;
  }

  addTrustedDevice(device: Device) {
    if (this.isTrusted(device))
      return;
    this.props.trustedDevices.push(device);
  }

  createNewSession(device: Device) {
    if (!this.isEmailVerified)
      throw new Error("Email is not verified");
    if (!this.isTrusted(device))
      throw new Error("Device is not verified");

    const session = Session.create({ device: device, lastLogin: new Date() });

    const existedIndex = this.props.sessions.findIndex(s => s.device.equals(device));
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

  dropSessionOnDevice(device: Device) {
    this.props.sessions = this.props.sessions.filter(s => s.device != device);
  }


  isTrusted(device: Device): boolean {
    return !!this.props.trustedDevices.find(s => s.equals(device));
  }

  dropAllSessions() {
    this.props.sessions = [];
  }
}
