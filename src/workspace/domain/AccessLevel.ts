import { ValueObject } from "../../shared/domain/ValueObject";

type AccessMode = "EDIT" | "READ" | "COMMENT"

type AccessLevelProps = {
  mode: AccessMode
}

export class AccessLevel extends ValueObject<AccessLevelProps> {
  public static ACCESS_EDIT: AccessMode = "EDIT";
  public static ACCESS_READ: AccessMode = "READ";
  public static ACCESS_COMMENT: AccessMode = "COMMENT";

  public static Edit(): AccessLevel {
    return new AccessLevel({ mode: this.ACCESS_EDIT });
  }
  public static Read(): AccessLevel {
    return new AccessLevel({ mode: this.ACCESS_READ });
  }
  public static Comment(): AccessLevel {
    return new AccessLevel({ mode: this.ACCESS_COMMENT });
  }
}