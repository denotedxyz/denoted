import { Editor } from "../../../core/editor/components/Editor";

export default async function Page({ params }: { params: { pageId: string } }) {
  return <Editor pageId={params.pageId} />;
}
