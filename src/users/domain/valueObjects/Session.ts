import { ValueObject } from "../../../shared/domain/ValueObject";

export interface DeviceProps {
  id: string;
}

export class Device extends ValueObject<DeviceProps> {
  get id(): string {
    return this.props.id;
  }

  public static create(props: DeviceProps): Device {
    return new Device(props);
  }
}

export interface SessionProps {
  device: Device;
  lastLogin?: Date;
}

export class Session extends ValueObject<SessionProps> {
  get device() {
    return this.props.device;
  }

  get lastLogin(): Date {
    return this.props.lastLogin;
  }

  public static create(props: SessionProps): Session {
    return new Session({ ...props, lastLogin: props.lastLogin || new Date() });
  }
}