import { registerAs } from '@nestjs/config';
import Joi from 'joi';
import { IsWeatherKey } from './weatherKey.config.interface';

export default registerAs('weatherKey', () => {
  const schema = Joi.object<IsWeatherKey, true>({
    key: Joi.string().required(),
  });

  const config = {
    key: process.env.WEATHER_KEY,
  };

  const { error } = schema.validate(config, {
    abortEarly: false,
  });
  return config;
});
