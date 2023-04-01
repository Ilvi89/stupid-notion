import { ValueObject } from "../../shared/domain/ValueObject";

type PlanProps = {
  name: string
}

export class Plan extends ValueObject<PlanProps> {
  public static PLAN_BASE = "BASE";
  public static PLAN_PRO = "PRO";

  public static Base(): Plan {
    return new Plan({ name: this.PLAN_BASE });
  }

  public static Pro(): Plan {
    return new Plan({ name: this.PLAN_PRO });
  }
}