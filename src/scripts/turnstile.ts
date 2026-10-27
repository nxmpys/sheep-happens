/**
 * Browser side of Cloudflare Turnstile, shared by the feedback form and the
 * community builds. The script is only loaded when someone starts using one of
 * them: no third-party script on normal page views.
 */
export interface Turnstile {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  getResponse(id: string): string | undefined;
  reset(id: string): void;
}
type TurnstileWindow = Window & { turnstile?: Turnstile };

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loading: Promise<Turnstile> | undefined;

export function loadTurnstile(): Promise<Turnstile> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.onload = () => {
      const api = (window as TurnstileWindow).turnstile;
      if (api) resolve(api);
      else reject(new Error('turnstile'));
    };
    script.onerror = () => {
      loading = undefined;
      reject(new Error('turnstile'));
    };
    document.head.append(script);
  });
  return loading;
}
