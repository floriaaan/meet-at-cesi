import { useEffect, useState } from "react";
import { Button } from "../Button/Button";

export const PWAInstall = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

  const onClick = (evt: any) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }

  return (
    <Button
      onClick={onClick as () => void}
      variant="primary"
      size="medium"
      rounded="rounded-[20px]"
    >
      {"Installer l'application"}
    </Button>
  );
};
