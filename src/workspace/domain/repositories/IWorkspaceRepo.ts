import { Repository } from "../../../shared/domain/Repository";
import { WorkspaceAggregate } from "../WorkspaceAggregate";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";

export interface IWorkspaceRepo extends Repository<WorkspaceAggregate> {
  findByOwner(id: UniqueEntityID): Promise<WorkspaceAggregate[]>
}