import 'dotenv/config';

type CreateWSPayload = {
  type: 'executed-task';
  data: any;
};

export const createWSPayload = ({ type, data }: CreateWSPayload) => {
  return JSON.stringify({ type, data, origin: process.env.ORIGIN });
};
