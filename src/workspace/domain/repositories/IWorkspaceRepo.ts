import { Repository } from "../../../shared/domain/Repository";
import { WorkspaceAggregate } from "../WorkspaceAggregate";

export interface IWorkspaceRepo extends Repository<WorkspaceAggregate> {

}