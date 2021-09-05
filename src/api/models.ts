export enum MathOperation {
  addition = 'addition',
  subtraction = 'subtraction',
  multiplication = 'multiplication',
  division = 'division',
  remainder = 'remainder',
}

export type FetchTaskResponse = {
  id: string;
  operation: MathOperation;
  left: number;
  right: number;
};

export type SubmitTaskBody = {
  id: string;
  result: number;
};
