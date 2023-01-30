import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { IsWeatherKey } from './weatherKey.config.interface';

export default registerAs('weatherKey', () => {
  const schema = Joi.object<IsWeatherKey, true>({
    key: Joi.string().required(),
  });

  const config = {
    key: process.env.WEATHER_KEY,
  };

  const { error, value } = schema.validate(config, {
    abortEarly: false,
  });

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  return value;
});
