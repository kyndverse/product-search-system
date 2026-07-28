import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, errors } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor(
    @Inject('ELASTICSEARCH_CLIENT') private readonly client: Client,
  ) {}

  async onModuleInit() {
    const info = await this.client.info();

    this.logger.log(`Connected to Elasticsearch ${info.version.number}`);
  }

  async index<T extends object>(index: string, id: string, document: T) {
    return this.client.index({
      index,
      id,
      document,
    });
  }

  async delete(index: string, id: string) {
    return this.client.delete({ index, id });
  }

  async get<T>(index: string, id: string): Promise<T | null> {
    try {
      const response = await this.client.get<T>({
        index,
        id,
      });

      return response._source ?? null;
    } catch (error) {
      if (error instanceof errors.ResponseError) {
        if (error.statusCode === 404) return null;
      }

      return null;
    }
  }
}
