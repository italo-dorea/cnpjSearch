/**
 * Regras da dica "Ajude com o cafezinho": discreta, rara e fácil de calar.
 *
 * - Aparece logo depois que o app abre (HINT_FIRST_DELAY_MS), para não competir com o carregamento.
 * - Depois repete a cada HINT_INTERVAL_MS, no máximo HINT_MAX_PER_SESSION vezes por sessão.
 * - Some sozinha em HINT_DISPLAY_MS e nunca bloqueia a tela.
 * - Para de vez quando a pessoa abre o apoio ou toca em "Agora não".
 * - Não aparece com a janela sem foco/oculta, com o diálogo de apoio aberto, nem se já foi
 *   mostrada há menos de HINT_MIN_GAP_MS em outra sessão (evita insistir ao reabrir o app).
 */
export const HINT_FIRST_DELAY_MS = 4000;
export const HINT_INTERVAL_MS = 3 * 60 * 1000;
export const HINT_DISPLAY_MS = 7000;
export const HINT_MAX_PER_SESSION = 3;
export const HINT_MIN_GAP_MS = 10 * 60 * 1000;

const KEY = "cnpjsearch.supportHint";

export interface HintStored {
  /** A pessoa abriu o apoio ou pediu para não ver mais a dica. */
  stopped: boolean;
  /** Quando a dica foi mostrada pela última vez (ms desde 1970). */
  lastShown: number;
}

export const loadHintState = (): HintStored => {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { stopped: parsed.stopped === true, lastShown: Number(parsed.lastShown) || 0 };
  } catch {
    return { stopped: false, lastShown: 0 };
  }
};

const save = (state: HintStored) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sem armazenamento (modo privado etc.): a dica só segue as regras da sessão
  }
};

export const stopHints = () => save({ ...loadHintState(), stopped: true });
export const markHintShown = (now: number) => save({ ...loadHintState(), lastShown: now });

export interface HintContext {
  now: number;
  stored: HintStored;
  sessionShows: number;
  /** Momento a partir do qual a próxima exibição é permitida (dentro da sessão). */
  nextAt: number;
  windowVisible: boolean;
  windowFocused: boolean;
  dialogOpen: boolean;
  /** Há um meio de apoio configurado (senão o botão nem existe). */
  configured: boolean;
}

export const shouldShowHint = (c: HintContext): boolean => {
  if (!c.configured || c.stored.stopped || c.dialogOpen) return false;
  if (!c.windowVisible || !c.windowFocused) return false;
  if (c.sessionShows >= HINT_MAX_PER_SESSION || c.now < c.nextAt) return false;
  // Primeira exibição da sessão: respeita o intervalo mínimo em relação à sessão anterior.
  if (c.sessionShows === 0) return c.now - c.stored.lastShown >= HINT_MIN_GAP_MS;
  return true;
};
