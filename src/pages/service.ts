import request from 'umi-request';

export const fetchData = (
  id: string,
): Promise<{
  id: string;
  detail: string;
  _id: string;
  preview: string;
}> => {
  return request.get(`/api/industry-chain/${id}`);
};
