export interface UseCase<IRequest, IResponse> {
  execute (req: IRequest) : Promise<IResponse> | IResponse;
}