import { IUserRepo } from "../domain/repositories/IUserRepo";
import { Injectable } from "@nestjs/common";
import { UserAggregate } from "../domain/UserAggregate";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Email } from "../domain/valueObjects/Email";
import { PrismaService } from "../../shared/infrastucture/prisma.service";
import { User } from "@prisma/client";
import { Password } from "../domain/valueObjects/Password";
import { Device, Session } from "../domain/valueObjects/Session";
import { v4 as uuid } from "uuid";

@Injectable()
export class UserRepository implements IUserRepo {
  private useRawQuery = {

    include: {
      sessions: {
        select: {
          device: { select: { code: true } },
          lastLogin: true
        }
      },
      trustedDevices: {
        select: { code: true }
      }
    }

  };

  constructor(private prisma: PrismaService) {
  }

  async exists(t: UserAggregate): Promise<boolean> {
    return !!await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: t.id.toString() },
          { email: t.email.value }
        ]
      }
    });
  }

  async find(id: UniqueEntityID): Promise<UserAggregate> {
    let raw: UserRaw = await this.prisma.user.findUnique({
      where: { id: id.toString() },
      ...this.useRawQuery
    });
    return UserMapper.toDomain(raw);
    // return UserAggregate.create(new UniqueEntityID(raw.id), {
    //   email: Email.create(raw.email),
    //   password: Password.create({ value: raw.pass, hashed: true }),
    //   username: raw.name,
    //   isEmailVerified: raw.isEmailVerified,
    //   sessions: raw.sessions.map<Session>(s => Session.create({
    //     device: Device.create({ id: s.device.code }),
    //     lastLogin: s.lastLogin
    //   })),
    //   trustedDevices: raw.trustedDevices.map<Device>(d => Device.create({ id: d.code }))
    // });
  }

  async findUserByEmail(email: Email): Promise<UserAggregate> {
    let raw: UserRaw = await this.prisma.user.findUnique({
      where: { email: email.value },
      ...this.useRawQuery
    });
    return UserMapper.toDomain(raw);
  }

  getNewId(): UniqueEntityID {
    return new UniqueEntityID(uuid());
  }

  async save(t: UserAggregate): Promise<UserAggregate> {
    let userAggregateRaw: UserRaw = await UserMapper.toDB(t);
    let rawUser: User = userAggregateRaw;
    let trustedDeviseSet = new Set(userAggregateRaw.trustedDevices.map(d => d.code));
    userAggregateRaw.sessions.forEach(s => {
      trustedDeviseSet.delete(s.device.code);
    });


    let raw = await this.prisma.user.upsert({
      where: {
        id: t.id.toString()
      },
      create: {
        id: rawUser.id,
        email: rawUser.email,
        name: rawUser.name,
        isEmailVerified: rawUser.isEmailVerified,
        pass: rawUser.pass
      },
      update: {
        ...rawUser,
        sessions: {
          deleteMany: { userId: rawUser.id },
          create: [...userAggregateRaw.sessions.map(s => {
            return {
              lastLogin: s.lastLogin,
              device: { create: { code: s.device.code, userId: rawUser.id } }
            };
          })]
        },
        trustedDevices: {
          deleteMany: { userId: rawUser.id },
          create: [...Array.from(trustedDeviseSet.values()).map(d => {
            return {
              code: d
            };
          })]
        }
      },
      ...this.useRawQuery
    });


    // let raw: UserAggregateRaw;
    return UserMapper.toDomain(raw);
  }
}

type UserRaw = User &
  { sessions: { device: { code: string }, lastLogin: Date }[], trustedDevices: { code: string }[] }

class UserMapper {
  static toDomain(raw: any): UserAggregate {
    if (raw == null) return null;
    return UserAggregate.create(new UniqueEntityID(raw.id), {
      email: Email.create(raw.email),
      password: Password.create({ value: raw.pass, hashed: true }),
      isEmailVerified: raw.isEmailVerified,
      username: raw.name,
      sessions: raw.sessions?.map(s => Session.create({
        device: Device.create({ id: s.device.code }),
        lastLogin: s.lastLogin
      })) || [],
      trustedDevices: raw.trustedDevices?.map(d => Device.create({ id: d.code })) || []
    });
  }

  static async toDB(user: UserAggregate): Promise<UserRaw> {
    return {
      id: user.id.toString(),
      email: user.email.value,
      name: user.username || user.email.value,
      pass: user.password.value.toString(),
      isEmailVerified: user.isEmailVerified,
      sessions: user.sessions?.map(s => {
        return {
          device: { code: s.device.id },
          lastLogin: s.lastLogin
        };
      }),
      trustedDevices: user.trustedDevices?.map(d => {
        return { code: d.id };
      }),
      plan: undefined
    };
  }
}