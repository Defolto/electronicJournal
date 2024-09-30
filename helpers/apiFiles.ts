import { existsSync, promises as fs } from 'fs'
import { getStartPath } from '../mongoDB/general'

async function getPaths(
   filePath: string
): Promise<{ dirPath: string; fileName: string; fullPath: string }> {
   let dirPath = getStartPath()
   let fileName = ''

   for (const dir of filePath.split('/')) {
      // если дошли до файла
      if (dir.includes('.')) {
         fileName = dir
         break
      }

      dirPath += `/${dir}`
      if (!existsSync(dirPath)) {
         await fs.mkdir(dirPath)
      }
   }

   return { dirPath, fileName, fullPath: `${dirPath}/${fileName}` }
}

export async function writeFile(filePath: string, data: string | Buffer) {
   const { fullPath } = await getPaths(filePath)

   await fs.writeFile(fullPath, data)
}

export async function readFile(filePath: string) {
   const { fullPath } = await getPaths(filePath)

   return await fs.readFile(fullPath, 'utf-8')
}

// Для удаления папки, сначала рекурсивно удаляем всё внутри
export async function deleteDir(path: string) {
   const { dirPath } = await getPaths(path)
   const files = await fs.readdir(dirPath)

   for (const file of files) {
      const curPath = `${dirPath}/${file}`

      if ((await fs.stat(curPath)).isDirectory()) {
         await deleteDir(curPath)
      } else {
         await fs.unlink(curPath)
      }
   }

   // Почему-то не удаляется папка предмета
   await fs.rmdir(dirPath)
}

export async function deleteFile(path: string) {
   const { fullPath } = await getPaths(path)
   await fs.unlink(fullPath)
}

export async function renameFile(oldFilePath: string, newFilePath: string) {
   const { fullPath: oldFullPath } = await getPaths(oldFilePath)
   const { fullPath: newFullPath } = await getPaths(newFilePath)

   await fs.rename(oldFullPath, newFullPath)
}

export async function renameDir(oldPath: string, newPath: string) {
   const { dirPath: oldDirPath } = await getPaths(oldPath)
   const { dirPath: newDirPath } = await getPaths(newPath)
   if (!(await existFile(oldDirPath))) {
      return
   }

   const files = await fs.readdir(oldDirPath)
   for (const file of files) {
      const curPath = `${oldDirPath}/${file}`
      const newPath = `${newDirPath}/${file}`

      await fs.copyFile(curPath, newPath)
   }

   await deleteDir(oldPath)
}

export async function existFile(path: string) {
   return existsSync(path)
}
