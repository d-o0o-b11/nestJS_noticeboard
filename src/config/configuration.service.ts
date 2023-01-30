import { Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IsWeatherKey } from './weatherKey.config.interface';
import configuration from './weatherKeyConfig';

@Injectable()
export class WeatherConfig implements IsWeatherKey {
  constructor(
    @Inject(configuration.KEY)
    private configService: ConfigType<typeof configuration>,
  ) {}

  get weatherkey(): string {
    const value = this.configService.key;
    return value;
  }
}
