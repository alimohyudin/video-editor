import fs from 'fs';
import path from 'path';
import { getVideoDurationInSeconds } from 'get-video-duration';


export default class Directory {
    constructor(path, options) {
        this.path = path;
        this.options = options;

    }

    setOptions(options) {
        this.options = options;
    }

    scan(sortByFilename = false, myPath = null) {
        let usePath = this.path;
        if (myPath != null) {
            usePath = myPath
        }

        let that = this;
        return new Promise((resolve, reject) => {
            fs.readdir(usePath, async (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    //resolve(files);
                    const fileStats = files.map((file) => {
                        const filePath = `${usePath}/${file}`;
                        const fileUrl = `http://localhost:3002/${usePath.replace('./public/', '')}${file}`
                        const stat = fs.statSync(filePath);
                        return {
                            file,
                            type: that.getFileType(file),
                            category: usePath.replace('./public/common_components/', '').replace('/', ''),
                            filePath: filePath,
                            fileUrl: fileUrl,
                            createdAt: stat.ctimeMs, // Get the creation time in milliseconds
                        };
                    });

                    // Sort the files based on creation time (ascending order)
                    let sortedFiles;
                    if (sortByFilename)
                        sortedFiles = fileStats.sort((a, b) => a.file.replace('.mp4', '') - b.file.replace('.mp4', ''));
                    else
                        sortedFiles = fileStats.sort((a, b) => a.createdAt - b.createdAt);
                    //console.log(sortedFiles[0]);
                    for (let index = 0; index < sortedFiles.length; index++) {
                        const file = sortedFiles[index];
                        if(file.type == 'video'){
                            sortedFiles[index].duration = await getVideoDurationInSeconds(file.filePath);
                        }
                        
                    }
                    resolve(sortedFiles);
                }
            });

        });
    }

    deleteTemp() {
        return new Promise((resolve, reject) => {
            let tempPath = './temp'
            fs.readdir(tempPath, (err, files) => {
                if (err) {
                    console.error('Error reading directory:', err);
                    return;
                }

                // Iterate over the files
                files.forEach((file) => {
                    const filePath = path.join(tempPath, file);

                    // Delete the file
                    fs.unlink(filePath, (error) => {
                        if (error) {
                            console.error('Error deleting file:', error);
                        } else {
                            console.log('File deleted:', filePath);

                        }
                    });
                });
                resolve('done');
            });
        })
    }

    deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, function (err) {
                console.log(err);
                resolve('done');
            });
        });
    }

    getFileType(filename) {
        let image = ['jpg', 'png', 'gif', 'webp', 'jpeg']
        let video = ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov']
        if (filename && filename != '') {
            let ext = path.extname(filename).toLowerCase().replace('.', '')
            if(image.includes(ext))
                return 'image'
            if(video.includes(ext))
                return 'video'
            return 'general'
        }
    }
}