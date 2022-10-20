export type ECSError = {
  message: string,
  line: number,
  file_path: string,
  source_class: string,
}

export type ECSDiff = {
  diff: string,
  applied_checkers: Array<string>,
}

export type Comment = {
  path: string,
  body: string,
  side: string,
  start_side: string,
  line: number,
};

export type Feedback = {
  path: string,
  feedback: Array<ECSError>,
};