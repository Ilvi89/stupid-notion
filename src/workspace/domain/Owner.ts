import { Entity } from "../../shared/domain/Entity";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Plan } from "./Plan";

type OwnerProps = {
  plan?: Plan
}

export class Owner extends Entity<OwnerProps> {
  get plan() {
    return this.props.plan;
  }

  public static create(id: UniqueEntityID, props: OwnerProps): Owner {
    return new Owner(id, { ...props, plan: props.plan || Plan.Base() });
  }
}


