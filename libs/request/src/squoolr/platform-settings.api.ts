import { PlatformSettingsEntity } from '@glom/data-types';
import { GlomRequest } from '../lib/glom-request';

export class PlatformSettingsApi {
  constructor(private readonly request: GlomRequest) {}

  async getPlatformSettings() {
    const resp = await this.request.get<PlatformSettingsEntity>(
      '/platform-settings'
    );
    return resp.data;
  }
}
