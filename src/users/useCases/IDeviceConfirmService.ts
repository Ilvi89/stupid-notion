import { Device } from "../domain/valueObjects/Session";

export interface IDeviceConfirmService {
  requestConfirm(devicesToRequest: Device[]): void;
  getConfirmCode(device: Device): Promise<string>;
}