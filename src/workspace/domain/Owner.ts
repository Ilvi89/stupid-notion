import { Entity } from "../../shared/domain/Entity";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Plan } from "./Plan";

type OwnerProps = {
  plan?: Plan
  name: string

  wsCount?: number
}

export class Owner extends Entity<OwnerProps> {
  get plan() {
    return this.props.plan;
  }

  get name() {
    return this.props.name;
  }

  public static create(id: UniqueEntityID, props: OwnerProps): Owner {
    return new Owner(id, { ...props, plan: props.plan || Plan.Base() });
  }

  public canCreateWorkspace(): boolean {
    return this.props.wsCount < this.props.plan.workSpaceMaxCount;
  }
}


