import {
  CacheInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { map, Observable, tap } from 'rxjs';
import { CACHE_EVICT_METADATA } from './cache.constants';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private readonly CACHE_EVICT_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();

    console.log(await this.cacheManager.store.keys());

    // 상태 변환 메서드일떄
    const reflector: Reflector = this.reflector;
    const evictKeys = reflector.getAllAndMerge(CACHE_EVICT_METADATA, [
      context.getClass(), // NoticeBoardController
      context.getHandler(), // [...]
    ]);

    if (this.CACHE_EVICT_METHODS.includes(req.method)) {
      //POST, PATCH, PUT, DELETE
      //await (this.cacheManager as Cache).del(evictKeys.join(''));
      // console.log('post들어옴');
      return next.handle().pipe(
        tap((data) => {
          console.log('dsfsdf', evictKeys.join(''));
          (this.cacheManager as Cache).set(
            evictKeys.join(''),
            JSON.stringify(data),
            600 * 600,
          );
        }),
      );
    } else {
      //GET
      const value = await (this.cacheManager as Cache).get<string>(
        evictKeys.join(''),
      );

      // console.log('method', req.method, value, evictKeys.join(''));

      if (value) {
        return super.intercept(context, next);
      } else {
        console.log('execute');
        return next.handle().pipe(
          tap((data) => {
            (this.cacheManager as Cache).set(
              evictKeys.join(''),
              JSON.stringify(data),
              600 * 600,
            );
          }),
        );
      }
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
