import { TemplateRef } from '@angular/core';
import { TAlertLevel } from '@shared/types';
export interface IAlertOption {
  level?: TAlertLevel;
  icon?: string;
  isClosable?: boolean;
  isAppLevel?: boolean;
  templates?: {
    actions?: TemplateRef<any>;
    text?: TemplateRef<any>;
  };
}
