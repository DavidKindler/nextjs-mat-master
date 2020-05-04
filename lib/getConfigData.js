import fs from 'fs'
import path from 'path'

const configDirectory = path.join(process.cwd(), 'config')

export function getConfigData () {
  const fileNames = fs.readdirSync(configDirectory)
  const filteredFileNames = fileNames.filter(
    fileName => path.extname(fileName) === '.json'
  )
  const allConfigData = filteredFileNames.map(fileName => {
    const fullPath = path.join(configDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return fileContents
  })
  return JSON.parse(allConfigData)

  // Sort posts by date
  // return allPostsData.sort((a, b) => {
  //   if (a.date < b.date) {
  //     return 1
  //   } else {
  //     return -1
  //   }
  // })
}
