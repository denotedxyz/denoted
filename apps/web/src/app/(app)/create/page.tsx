import { Metadata } from "next";
import { CreatePageEditor } from "../../../components/CreatePageEditor";

export const metadata: Metadata = {
  title: "create",
};

export default function CreatePage() {
  return <CreatePageEditor />;
}
