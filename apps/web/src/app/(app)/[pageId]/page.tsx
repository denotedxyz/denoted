import { PageEditor } from "../../../core/editor/components/PageEditor";

export default async function Page({ params }: { params: { pageId: string } }) {
  return <PageEditor pageId={params.pageId} />;
}
