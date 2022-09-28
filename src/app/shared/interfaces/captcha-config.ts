/**
 *
 *
 * @export
 * @interface ICaptchaConfig
 */
export interface ICaptchaConfig {
  theme?: 'dark' | 'light';
  type?: 'audio' | 'image';
  size?: 'compact' | 'normal';
  tabindex?: number;
  sitekey?: string;
  callback?: any;
  'expired-callback'?: any;
}
