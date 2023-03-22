import { IEmailConfirmService } from "../useCases/IEmailConfirmService";
import { IDeviceConfirmService } from "../useCases/IDeviceConfirmService";
import { Email } from "../domain/valueObjects/Email";
import { Device } from "../domain/valueObjects/Session";

export class FakeEmailConfirmService implements IEmailConfirmService {
  getConfirmCode(email: Email): Promise<string> {
    return Promise.resolve("123");
  }

  requestConfirm(email: Email): void {
  }
}

export class FakeDeviceConfirmService implements IDeviceConfirmService {
  getConfirmCode(device: Device): Promise<string> {
    return Promise.resolve("123");
  }

  requestConfirm(currentlyInUseDevices: Device[]): void {
  }
}
