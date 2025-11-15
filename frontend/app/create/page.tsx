import { CreatePoolForm } from "@/components/forms/CreatePoolForm";

export default function CreatePoolPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="section-title">Launch a new intel pool</h1>
        <p className="text-sm text-white/70">
          Fill in the details of your case, deploy an IntelPool via the factory, and encrypt your intel with Lit. Once deployed,
          contributors can pledge USDC until the threshold is met.
        </p>
      </div>
      <CreatePoolForm />
    </section>
  );
}
