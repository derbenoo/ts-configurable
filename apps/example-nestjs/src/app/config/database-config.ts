/**
 * TypeORM database configuration:
 *  - https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md
 */
export class DatabaseConfig {
  /** Database type. */
  readonly type = 'mysql';

  /** Database host */
  readonly host = 'localhost';

  /** Database host port */
  readonly port = 3306;

  /** Database username */
  readonly username = 'root';

  /** Database password */
  readonly password = 'root';

  /** Database name */
  readonly database = 'test';

  /** Entities to be loaded and used for this connection. Accepts both entity classes and directories paths to load from. Directories support glob patterns */
  readonly entities = [__dirname + '/../**/*.entity{.ts,.js}'];

  /** Whether database schema should be auto created on every application launch */
  readonly synchronize = true;
}
