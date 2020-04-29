import {inject, lifeCycleObserver, LifeCycleObserver, ValueOrPromise} from '@loopback/core';
import {juggler} from '@loopback/repository';
import chalk from "chalk";
import config from './staging.datasource.config.json';

@lifeCycleObserver('datasource')
export class StagingDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'staging';

  constructor(
    @inject('datasources.config.staging', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    console.log(chalk.blue.bold(`Connected to ${config.name} database`));
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}
