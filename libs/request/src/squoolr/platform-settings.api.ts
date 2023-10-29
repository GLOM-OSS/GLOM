import { PlatformSettingsEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class PlatformSettingsApi {
  constructor(private readonly request: GlomRequest) {}

  getPlatformSettings() {
    return this.request.get<PlatformSettingsEntity>('/platform-settings');
  }
}
