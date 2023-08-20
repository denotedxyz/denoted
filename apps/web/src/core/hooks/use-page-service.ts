import { useUser } from "../../contexts/user-context";
import { createPageService } from "../page/page-service";

export function usePageService() {
  const user = useUser();

  const pageService = createPageService(user);

  return pageService;
}
