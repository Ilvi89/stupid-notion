import { Entity } from "../../shared/domain/Entity";
import { AccessLevel } from "./AccessLevel";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";

type MemberProps = {
  accessLevel?: AccessLevel
}

export class Member extends Entity<MemberProps> {
  get accessLevel() {
    return this.props.accessLevel;
  }

  public static create(id: UniqueEntityID, props: MemberProps): Member {
    return new Member(id, { ...props, accessLevel: props.accessLevel || AccessLevel.Read() });
  }

  public setAccessLevel(accessLevel: AccessLevel) {
    this.props.accessLevel = accessLevel;
  }
}