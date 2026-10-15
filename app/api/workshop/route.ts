import catalog from '../../data/workshop-public.json';
import {queryWorkshop} from '../../lib/workshop-query';
// Only the explicit maker-data projection is public. No Bridge records enter it.
export async function GET(request:Request) {
  return Response.json(queryWorkshop(catalog,new URL(request.url).searchParams),{headers:{'Cache-Control':'public, max-age=60, stale-while-revalidate=300','X-Content-Type-Options':'nosniff'}});
}
