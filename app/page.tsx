import { SuiBalanceTracker } from "@/components/sui-balance-tracker";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background/50">
      <SuiBalanceTracker />
    </main>
  );
}
