import {
  CacheInterceptor,
  CACHE_MANAGER,
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Cluster } from 'ioredis';
import { map, Observable, tap } from 'rxjs';
import { CacheDBService } from 'src/redis/cache.service';
import { CACHE_EVICT_METADATA } from './cache.constants';

@Injectable()
export class HttpCacheInterceptor22 extends CacheInterceptor {
  private readonly CACHE_EVICT_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];
  private readonly CACHE_SET_METHODS = ['POST', 'PATCH', 'PUT'];

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    // console.log(context);
    // console.log(this.cacheManager);

    // this.cacheManager <-- (CACHE_MANAGER) -- CacheModule.register()

    // 상태 변환 메서드일떄
    const reflector: Reflector = this.reflector;
    const evictKeys = reflector.getAllAndMerge(CACHE_EVICT_METADATA, [
      context.getClass(), // NoticeBoardController
      context.getHandler(), // [...]
    ]);

    if (this.CACHE_EVICT_METHODS.includes(req.method)) {
      await (this.cacheManager as Cache).del(evictKeys.join(''));

      return next.handle().pipe(
        tap((data) => {
          (this.cacheManager as Cache).set(
            evictKeys.join(''),
            JSON.stringify(data),
            600 * 600,
          );
          console.log(
            'DataGEt',
            (this.cacheManager as Cache).get(evictKeys.join('')),
          );
        }),
      );

      return next.handle().pipe(
        map((data) => {
          if (
            this.CACHE_SET_METHODS.includes(req.method) &&
            !(this.cacheManager as Cache).get<string>(evictKeys.join(''))
          ) {
            (this.cacheManager as Cache).set(evictKeys.join(''), data, 60 * 60);
            console.log('ㄸㄸㄸㄸㄸㄸㄸ');
          }
          return data;
        }),
      );
    } else {
      const value = await (this.cacheManager as Cache).get<string>(
        evictKeys.join(''),
      );

      console.log('method', req.method, value, evictKeys.join(''));

      if (value) {
        return JSON.parse(value);
      } else {
        // await (this.cacheManager as Cache).set(
        //   evictKeys.join(''),
        //   next.handle().pipe(
        //     map((data) => {
        //       JSON.stringify(data);
        //       console.log('data', data);
        //     }),
        //   ),
        //   60 * 60,
        // );

        next.handle().pipe(
          map((data) => {
            console.log('mapData', data);
            (this.cacheManager as Cache).set(evictKeys.join(''), data, 60 * 60);
          }),
        );
      }

      console.log(
        'test22222',
        await (this.cacheManager as Cache).get(evictKeys.join('')),
      );

      // 원하는 키값? evictKeys

      // 기존 캐싱 처리
      return super.intercept(context, next);
    }
  }

  /**
   * @param cacheKeys 삭제할 캐시 키 목록
   */
  private async clearCaches(cacheKeys: string[]): Promise<boolean> {
    console.log((this.cacheManager as Cache).get(cacheKeys[0]));

    this.cacheManager.del(cacheKeys);

    console.log((this.cacheManager as Cache).get(cacheKeys[0]));

    return true;
    // const client: Cluster = await this.cacheManager;

    // // console.log(client);

    // const redisNodes = client.nodes();

    // const result2 = await Promise.all(
    //   redisNodes.map(async (redis) => {
    //     const _keys = await Promise.all(
    //       cacheKeys.map((cacheKey) => redis.keys(`*${cacheKey}*`)),
    //     );
    //     const keys = _keys.flat();
    //     return Promise.all(keys.map((key) => !!this.cacheManager.del(key)));
    //   }),
    // );
    // return result2.flat().every((r) => !!r);
  }
}
