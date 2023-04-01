import { AggregateRoot } from "../../shared/domain/AggregateRoot";
import { Member } from "./Member";
import { Owner } from "./Owner";
import { AccessLevel } from "./AccessLevel";
import { UniqueEntityID } from "../../shared/domain/UniqueEntityID";
import { Plan } from "./Plan";

type WorkspaceProps = {
  owner: Owner
  name?: string
  members?: Member[]

  availableAccessLevels?: AccessLevel[]
}

export class WorkspaceAggregate extends AggregateRoot<WorkspaceProps> {

  private static baseAvailableAccessLevels: AccessLevel[] = [AccessLevel.Read(), AccessLevel.Edit()];

  get ownerId() {
    return this.props.owner.id;
  }

  get name(): string {
    return this.props.name;
  }

  public static create(id: UniqueEntityID, props: WorkspaceProps): WorkspaceAggregate {

    if (!props.owner.canCreateWorkspace()) {
      throw new Error("Owner workspace limit reached");
    }
    return new WorkspaceAggregate(id, {
      ...props,
      name: props.name || props.owner.name + " " + "Workspace",
      availableAccessLevels: props.owner.plan.equals(Plan.Pro())
        ? [...this.baseAvailableAccessLevels, AccessLevel.Comment()]
        : this.baseAvailableAccessLevels
    });
  }


}





