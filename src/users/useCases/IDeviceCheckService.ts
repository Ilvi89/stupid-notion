import { Device } from "../domain/valueObjects/Session";

export interface IDeviceCheckService {
  requestConfirm(user: Device): void;

  async;

  isConfirmed(device: Device): Promise<Boolean>;
}