import { UpdatePageEditor } from "../../../components/UpdatePageEditor";

export default async function Page({ params }: { params: { pageId: string } }) {
  return <UpdatePageEditor pageId={params.pageId} />;
}
