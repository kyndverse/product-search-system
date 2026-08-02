import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, errors } from '@elastic/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { SearchIndex } from './model/search-index.model';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor(
    @Inject('ELASTICSEARCH_CLIENT') private readonly client: Client,
  ) {}

  async onModuleInit() {
    const info = await this.client.info();

    this.logger.log(`Connected to Elasticsearch ${info.version.number}`);

    await this.ensureCategoryIndex();
    await this.ensureProductIndex();
  }

  private async ensureCategoryIndex() {
    const index = SearchIndex.CATEGORIES;

    const exists = await this.client.indices.exists({
      index,
    });

    if (exists) {
      this.logger.log(`Index '${index}' already exists.`);
      return;
    }

    await this.client.indices.create({
      index,
      mappings: {
        properties: {
          id: {
            type: 'keyword',
          },
          name: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
            },
          },
          slug: {
            type: 'keyword',
          },
        },
      },
    });

    this.logger.log(`Index '${index}' created.`);
  }

  private async ensureProductIndex() {
    const index = SearchIndex.PRODUCTS;

    const exists = await this.client.indices.exists({
      index,
    });

    if (exists) {
      this.logger.log(`Index '${index}' already exists.`);
      return;
    }

    await this.client.indices.create({
      index,
      mappings: {
        properties: {
          id: {
            type: 'keyword',
          },
          name: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
              },
            },
          },
          description: {
            type: 'text',
          },
          slug: {
            type: 'keyword',
          },
          price: {
            type: 'double',
          },
          stock: {
            type: 'integer',
          },
          createdAt: {
            type: 'date',
            format: 'epoch_millis',
          },
          category: {
            properties: {
              id: {
                type: 'keyword',
              },
              name: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                  },
                },
              },
              slug: {
                type: 'keyword',
              },
            },
          },
        },
      },
    });

    this.logger.log(`Index '${index}' created.`);
  }

  async index<T extends object>(index: string, id: string, document: T) {
    return this.client.index({
      index,
      id,
      document,
    });
  }

  async delete(index: string, id: string) {
    try {
      await this.client.delete({
        index,
        id,
      });
    } catch (error) {
      if (error instanceof errors.ResponseError && error.statusCode === 404) {
        return;
      }

      throw error;
    }
  }

  async get<T>(index: string, id: string): Promise<T | null> {
    try {
      const response = await this.client.get<T>({
        index,
        id,
      });

      return response._source ?? null;
    } catch (error) {
      if (error instanceof errors.ResponseError && error.statusCode === 404) {
        return null;
      }

      return null;
    }
  }

  async search<TDocument>(index: string, request: estypes.SearchRequest) {
    return this.client.search<TDocument>({
      index,
      ...request,
    });
  }
}
