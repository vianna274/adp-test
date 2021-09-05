import { FetchTaskResponse, MathOperation } from '../api/models';

type ExecuteMathOperation = Omit<FetchTaskResponse, 'id'>;

export const executeMathOperation = ({ right, left, operation }: ExecuteMathOperation) => {
  switch (operation) {
    case MathOperation.addition:
      return left + right;
    case MathOperation.division:
      return left / right;
    case MathOperation.multiplication:
      return left * right;
    case MathOperation.remainder:
      return left % right;
    case MathOperation.subtraction:
      return left - right;
    default:
      throw new Error('Unknown operation');
  }
};

export const MATH_OPERATORS: Record<MathOperation, string> = {
  [MathOperation.addition]: '+',
  [MathOperation.division]: '/',
  [MathOperation.subtraction]: '-',
  [MathOperation.remainder]: '%',
  [MathOperation.multiplication]: '*',
};
