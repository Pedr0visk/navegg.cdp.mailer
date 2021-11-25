export enum ReportStatus {
  // When user activate the audience but the proccess 
  // did not get started
  Pending = 'pending',

  // When the audience's processing is in progress
  Progress = 'progress',

  // The process has been successfully completed
  Completed = 'completed',

  // The process failed
  Failed = 'failed',
}
