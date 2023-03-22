import { IUserRepo } from "../../domain/repositories/IUserRepo";
import { UserAggregate } from "../../domain/userAggregate";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Email } from "../../domain/valueObjects/Email";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FakeUserRepo implements IUserRepo {
  private lastId: number = 0;
  private data: UserAggregate[] = [];

  exists(t: UserAggregate): Promise<boolean> {
    return Promise.resolve(this.data.includes(t));
  }

  find(id: UniqueEntityID): Promise<UserAggregate> {
    let user = this.data.find((value: UserAggregate) => value.id.equals(id));
    return Promise.resolve(user);
  }

  findUserByEmail(email: Email): Promise<UserAggregate> {
    return Promise.resolve(this.data.find(value => value.email.equals(email)));
  }

  getNewId(): UniqueEntityID {
    this.lastId++;
    return new UniqueEntityID(this.lastId.toString());
  }

  save(t: UserAggregate): Promise<UserAggregate> {
    this.data.push(t);
    return Promise.resolve(this.data[this.data.length - 1]);
  }

  findFirstFive(): Promise<UserAggregate[]> {
    return Promise.resolve(this.data);
  }
}