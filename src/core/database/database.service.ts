import { Inject, Injectable, Logger } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { CONNECTION_POOL } from './database.module-definition';

@Injectable()
class DatabaseService {
  private readonly logger = new Logger('SQL');
  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {}

  async runQuery(query: string, params?: unknown[]) {
    return this.queryWithLogging(this.pool, query, params);
  }

  getLogMessage(query: string, params?: unknown[]) {
    if (!params) {
      return `Query: ${query}`;
    }
    return `Query: ${query} Params: ${JSON.stringify(params)}`;
  }

  async queryWithLogging(
    source: Pool | PoolClient,
    query: string,
    params?: unknown[],
  ) {
    try {
      if (!source.query) {
        throw new Error('Source does not have a query method');
      }
      const message = this.getLogMessage(query, params)
        .replace(/\n|/g, '')
        .replace(/  +/g, ' ');
      // const queryPromise = source.query(query, params);
      // queryPromise
      //   .then(() => {
      //     this.logger.log(message);
      //   })
      //   .catch((error) => {
      //     this.logger.warn(message);
      //     throw error;
      //   });

      // return queryPromise;

      const result = await source.query(query, params);
      this.logger.log(message);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getPoolClient() {
    const poolClient = await this.pool.connect();
    // return poolClient;
    const proxyClient = new Proxy(poolClient, {
      get: (target: PoolClient, propertyName: keyof PoolClient) => {
        if (propertyName === 'query') {
          try {
            return async(query: string, params?: unknown[]) => {
              return await this.queryWithLogging(target, query, params);
            };
          } catch (error) {
            throw error;
          }
        }
        return target[propertyName];
      },
    });

    return proxyClient;
  }
}

export default DatabaseService;
