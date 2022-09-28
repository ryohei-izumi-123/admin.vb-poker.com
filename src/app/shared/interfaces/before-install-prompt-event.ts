/**
 *
 *
 * @interface IBeforeInstallPromptEvent
 * @extends {Event}
 */
export interface IBeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<IBeforeInstallUserChoice>;
  prompt(): Promise<void>;
}

/**
 *
 *
 * @export
 * @interface IBeforeInstallUserChoice
 * @extends {Event}
 */
export interface IBeforeInstallUserChoice extends Event {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}
