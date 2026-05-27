import { DocsShell } from "@/components/site/docs/DocsShell";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsShell>{children}</DocsShell>;
}
