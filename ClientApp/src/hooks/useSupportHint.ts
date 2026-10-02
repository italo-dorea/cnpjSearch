import { useCallback, useEffect, useRef, useState } from "react";
import {
  HINT_FIRST_DELAY_MS,
  HINT_INTERVAL_MS,
  loadHintState,
  markHintShown,
  shouldShowHint,
  stopHints,
} from "../utils/supportHint";

/** Controla quando a dica de apoio aparece (regras em utils/supportHint.ts). */
export function useSupportHint(dialogOpen: boolean, configured: boolean) {
  const [visible, setVisible] = useState(false);
  const session = useRef({ shows: 0, nextAt: 0 });
  const dialogOpenRef = useRef(dialogOpen);

  useEffect(() => {
    dialogOpenRef.current = dialogOpen;
  }, [dialogOpen]);

  const evaluate = useCallback(() => {
    const now = Date.now();
    const show = shouldShowHint({
      now,
      stored: loadHintState(),
      sessionShows: session.current.shows,
      nextAt: session.current.nextAt,
      windowVisible: document.visibilityState === "visible",
      windowFocused: document.hasFocus(),
      dialogOpen: dialogOpenRef.current,
      configured,
    });
    if (!show) return;
    session.current.shows += 1;
    session.current.nextAt = now + HINT_INTERVAL_MS;
    markHintShown(now);
    setVisible(true);
  }, [configured]);

  useEffect(() => {
    // A primeira exibição espera o app assentar; depois a reavaliação periódica cobre o
    // intervalo entre exibições e o retorno do foco à janela.
    session.current.nextAt = Date.now() + HINT_FIRST_DELAY_MS;
    const first = window.setTimeout(evaluate, HINT_FIRST_DELAY_MS + 100);
    const tick = window.setInterval(evaluate, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(tick);
    };
  }, [evaluate]);

  const hide = useCallback(() => setVisible(false), []);
  const stop = useCallback(() => {
    stopHints();
    setVisible(false);
  }, []);

  return { visible, hide, stop };
}
