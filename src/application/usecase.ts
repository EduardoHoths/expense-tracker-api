export interface UseCase<InputDTO, OutputDTO> {
  execute(data: InputDTO): Promise<OutputDTO>;
}