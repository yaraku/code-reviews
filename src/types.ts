export type ECSError = {
  message: string
  line: number
  file_path: string
  source_class: string
}

export type PintError = {
  diff: string
  applied_fixers: string[]
}

export type Comment = {
  path: string
  body: string
  side: string
  start_side: string
  line: number
}

export type Feedback = {
  path: string
  feedback: PintError
}

