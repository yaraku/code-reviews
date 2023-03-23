import { PatchDiff } from "./types"

export function filterFiles(files: any[]) {
  return (fileA: PatchDiff): boolean => {
    return files.find((fileB: any) => {
      return fileA?.newFileName?.includes(fileB.path)
    }) !== undefined
  }
}
