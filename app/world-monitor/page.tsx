import UltronShell from "@/components/ultron/UltronShell";

export const metadata = {
  title: "World Monitor | ULTRON Intelligence Operating System",
  description: "Dedicated external intelligence workspace connecting global open feeds, geopolitics, and source discovery.",
};

export default function WorldMonitorPage() {
  return <UltronShell initialModule="WORLD_MONITOR" />;
}
