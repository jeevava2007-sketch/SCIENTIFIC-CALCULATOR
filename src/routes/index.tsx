import { createFileRoute } from "@tanstack/react-router";
import { NexusApp } from "@/nexus/ui/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <NexusApp />;
}
