import * as os from 'os';
import * as path from 'path';

/**
 * TypeORM database configuration:
 *  - https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md
 */
export class DatabaseConfig {
  /** Database type. */
  readonly type = 'sqlite';

  /** Database name */
  readonly database = path.join(os.tmpdir(), 'database.sqlite');

  /** Entities to be loaded and used for this connection. Accepts both entity classes and directories paths to load from. Directories support glob patterns */
  readonly entities = [`${__dirname}/**/*.entity.ts`];

  /** Whether database schema should be auto created on every application launch */
  readonly synchronize = true;
}
