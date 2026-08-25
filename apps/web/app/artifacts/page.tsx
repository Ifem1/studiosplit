import { redirect } from "next/navigation";

// Keep the short URL useful for the first StudioSplit project while the
// project-scoped workflow remains the canonical route.
export default function ArtifactsShortcutPage() {
  redirect("/projects/1/artifacts");
}
