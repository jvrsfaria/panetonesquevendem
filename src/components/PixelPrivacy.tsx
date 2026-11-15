import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { onConsentChange, readChoice, saveChoices } from "@/lib/consent";

export function PixelPrivacy() {
  const [denied, setDenied] = useState(false);
  useEffect(() => {
    const update = () => setDenied(readChoice("advertising") === "denied");
    update();
    return onConsentChange(update);
  }, []);
  return <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
    <Link to="/privacidade" className="underline">Privacidade</Link>
    <Button variant="secondary" size="sm" disabled={denied} onClick={() => saveChoices({ advertising: "denied" })}>
      {denied ? "Medição publicitária desativada" : "Desativar cookies de publicidade"}
    </Button>
  </div>;
}