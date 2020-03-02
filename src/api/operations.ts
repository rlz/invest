import { OkResponse, Operation } from './common';
import { API_TOKEN } from './token';

interface OpsResponse extends OkResponse {
  payload: {
    operations: Operation[];
    total: number;
  };
}

export async function loadOps (): Promise<Operation[]> {
  // curl -X GET "https://api-invest.tinkoff.ru/openapi/operations?from=2020-01-01T00%3A00%3A00.000000%2B03%3A00&to=2020-02-28T18%3A38%3A33.131642%2B03%3A00" -H "accept: application/json" -H "Authorization: Bearer t.j6DxpzoSxsEyptf5Ahbp66RLQAfarEMFNbuu1TZmZ5KxwT6SQo8L31r1W7m9V8BWx0Tu_QrXMTQJsCa-zDL4_w"
  const url = new URL('/openapi/operations', 'https://api-invest.tinkoff.ru');
  url.searchParams.set('from', '1900-01-01T00:00:00Z');
  url.searchParams.set('to', new Date().toISOString());
  const resp = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      Authorization:
        `Bearer ${API_TOKEN}`
    }
  });
  const data = await resp.json() as OpsResponse;

  const ops = data.payload.operations;
  ops.sort((o1, o2) => {
    const d1 = new Date(o1.date);
    const d2 = new Date(o2.date);
    if (d1 > d2) {
      return 1;
    }
    if (d1 < d2) {
      return -1;
    }
    return 0;
  });
  return data.payload.operations;
}
