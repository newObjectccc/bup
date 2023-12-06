import fs from 'node:fs';

function readdirToString(dirPath) {
  const result = []
  try {
    const files = fs.readdirSync(dirPath)
    result[0] = files
  } catch (error) {
    result[1] = error
  }
  return result
}

export default readdirToString