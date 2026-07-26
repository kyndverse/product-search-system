export interface DebeziumSourceDto {
  version: string;
  connector: string;
  name: string;
  ts_ms: number;
  ts_us: number;
  ts_ns: number;
  snapshot: string | boolean;
  db: string;
  schema: string;
  table: string;
  sequence: string | null;
  txId: number;
  lsn: number;
  xmin: number | null;
}
