interface ImportMetaEnv {
  /** Google Search Console HTML-tag verification code (optional). */
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
  /** Bing Webmaster Tools verification code (optional). */
  readonly PUBLIC_BING_SITE_VERIFICATION?: string;
  /** Turnstile site key for the feedback form. Without it the form is hidden (except in dev). */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
