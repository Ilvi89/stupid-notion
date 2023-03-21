import { Device } from "../domain/valueObjects/Session";

export interface IDeviceConfirmService {
  requestConfirm(currentlyInUseDevices: Device[]): void;
  getConfirmCode(device: Device): Promise<string>;
}