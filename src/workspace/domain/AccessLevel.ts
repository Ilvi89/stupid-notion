import { ValueObject } from "../../shared/domain/ValueObject";

export type AccessMode = "EDIT" | "READ" | "COMMENT"

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

  public toString(): string {
    return this.props.mode.toString()
  }

  public static FromString(s: string): AccessLevel | null {
    let mode: AccessMode

    switch (s) {
      case "EDIT":
        mode = "EDIT"
        break
      case "READ":
        mode = "READ"
        break
      case "COMMENT":
        mode = "COMMENT"
        break
      default:
        return null
    }

    return new AccessLevel({ mode: mode })
  }
}