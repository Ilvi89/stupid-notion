import { ValueObject } from "../../shared/domain/ValueObject";

type PlanProps = {
  name: string
  workSpaceMaxCount: number
}

export class Plan extends ValueObject<PlanProps> {
  public static PLAN_BASE = "BASE";
  public static PLAN_PRO = "PRO";

  get workSpaceMaxCount() {
    return this.props.workSpaceMaxCount;
  }

  public static Base(): Plan {
    return new Plan({ name: this.PLAN_BASE, workSpaceMaxCount: 1 });
  }

  public static Pro(): Plan {
    return new Plan({ name: this.PLAN_PRO, workSpaceMaxCount: 5 });
  }
}