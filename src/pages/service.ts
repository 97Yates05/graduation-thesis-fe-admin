import request from 'umi-request';

export const fetchIndustryChain = (
  id: string,
): Promise<{
  id: string;
  detail: string;
  _id: string;
  preview: string;
}> => {
  return request.get(`/api/industry-chain/${id}`);
};

export const fetchIndustry = (
  name: string,
): Promise<
  {
    _id: string;
    name: string;
  }[]
> => {
  return request.get('/api/industry/list', {
    params: { name },
  });
};
