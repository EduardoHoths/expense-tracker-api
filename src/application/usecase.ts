export interface UseCase<InputDto, OutputDto> {
  execute(data: InputDto): Promise<OutputDto>;
}