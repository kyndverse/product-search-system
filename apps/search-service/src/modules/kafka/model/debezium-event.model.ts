import { DebeziumSourceDto } from './debezium-source.model';

export interface DebeziumEventDto<T> {
  before: T | null;
  after: T | null;
  source: DebeziumSourceDto;
  transaction: unknown;
  op: 'c' | 'u' | 'd' | 'r';
  ts_ms: number;
  ts_us: number;
  ts_ns: number;
}
