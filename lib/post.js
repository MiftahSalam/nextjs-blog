import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const postDirectory = path.join(process.cwd(),'posts')

export function getSortedPostData() {
    // console.log("getSortedPostData first")
    const fileNames = fs.readdirSync(postDirectory)
    const allPostsData = fileNames.map(filename => {
        const id = filename.replace(/\.md$/,'')
        const fullPath = path.join(postDirectory,filename)
        const fileContents = fs.readFileSync(fullPath,'utf8')
        const matterResult = matter(fileContents)

        return {
            id, ...matterResult.data
        }
    })
    // console.log("getSortedPostData -> allPostsData", allPostsData)
    return allPostsData.sort((a,b) => {
        if(a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postDirectory)

    return fileNames.map(filename => {
        return {
            params: {
                id: filename.replace(/\.md$/,'')
            }
        }
    })
}

export async function getPostData(id) {
    const fullPath = path.join(postDirectory,`${id}.md`)
    const fileContents = fs.readFileSync(fullPath,'utf8')
    const matterResult = matter(fileContents)
    const processecContent = await remark().use(html).process(matterResult.content)
    const contentHtml = processecContent.toString()
    
    return {
        id, contentHtml, ...matterResult.data
    }
}