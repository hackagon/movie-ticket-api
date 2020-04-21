import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './local.datasource.config.json';
import chalk from "chalk";

@lifeCycleObserver('datasource')
export class LocalDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'local';

  constructor(
    @inject('datasources.config.local', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    console.log(chalk.red.bgWhite.bold(`Connected to ${config.name} database`));
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    console.log(chalk.red.bgWhite.bold(`Disconnected to ${config.name} database`));
    return super.disconnect();
  }
}
