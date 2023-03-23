export type Comment = {
  path: string
  position?: number | undefined
  body: string
  line?: number | undefined
  side?: string | undefined
  start_line?: number | undefined
  start_side?: string | undefined
}

export type File = {
  name: string
  appliedFixers: string[]
  diff: string
}

export type PatchDiff = {
  oldFileName: string
  newFileName: string
  oldHeader: string
  newHeader: string
  hunks: Hunk[]
}

export type Hunk = {
  oldStart: number
  oldLines: number
  newStart: number
  newLines: number
  lines: string[]
  linedelimiters: string[]
}
