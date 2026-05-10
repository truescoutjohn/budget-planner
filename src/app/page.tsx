import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/app/(protected)/home/page";

export default function App() {
  return (
    <TooltipProvider>
      <Home />
    </TooltipProvider>
  );
}
