import multer from 'multer';
import express from 'express';
import cors from 'cors';
import DirectoryUtil from './server-helpers/directory.js';
import VideoEditor from './server-helpers/video-editor.js';
import fs from 'fs';

const uploadFolder = './public/uploads/';//'./public/uploads'

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
        //cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage });
const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());
app.use(express.static('public'));

let dirUtil = new DirectoryUtil(uploadFolder, {});
let videoEditor = new VideoEditor({});






/**
 * Routes & Controllers: API Calls
 */


app.get('/', (req, res) => {
    dirUtil.scan(true).then((result) => {
        //console.log(result)
        res.send({ success: true, data: result })
    })

})

app.get('/get-files', (req, res) => {
    console.log(req.query)
    let path = uploadFolder;
    if (req.query.type == 'common')
        path = './public/common_components/'
    console.log(path)
    dirUtil.scan(false, path).then((result) => {
        console.log(result.length)
        //console.log(result)
        if (req.query.type == 'common') {
            let commonResult = [];
            let countI = 0; //helps in dir scan function to complete all before sending results
            for (let i = 0; i < result.length; i++) {
                let cmPath = path + result[i].file + '/';//file is folder name in common folder
                console.log(cmPath)
                dirUtil.scan(false, cmPath).then((common_components) => {
                    console.log(common_components.length)
                    commonResult = commonResult.concat(common_components)

                    if (countI == result.length - 1) {
                        console.log("result: ", commonResult.length)
                        res.send({ success: true, data: commonResult })
                    }
                    countI++
                })
            }
        } else {
            res.send({ success: true, data: result })
        }

        //res.send({ success: true, data: result })
        //res.send({ success: true, data: [] })
    })

})

app.post('/upload-files', upload.any(), (req, res) => {
    //console.log(req.files)
    res.send({ success: true })
})

app.get('/delete-file', (req, res) => {
    console.log(req.query.filename)

    dirUtil.deleteFile(uploadFolder + req.query.filename).then((result) => {
        console.log(result)
        res.send({ success: true })
    })


})

app.post('/save-video-data', (req, res) => {
    let filename = req.body.filename ? req.body.filename : Date.now() + '.json'

    let videoData = JSON.parse(req.body.videoData);
    videoData = JSON.stringify(videoData, null, 2);

    fs.copyFileSync('./public/canva_videos_data/' + filename, './public/z-temp/' + Date.now() + '.json');

    fs.writeFile('./public/canva_videos_data/' + filename, videoData, (result) => {
        console.log(result)
        res.send({ success: true })
    })
})
app.get('/get-video-data', (req, res) => {
    dirUtil.scan(true, './public/canva_videos_data').then((result) => {
        //console.log(result[0])
        res.send({ success: true, data: [result[result.length - 1]] })
    })

})

app.get('/ffmpeg-operations', async (req, res) => {
    let addIntro = req.query.addIntro == 'true' ? true : false;
    let addColors = req.query.addColors == 'true' ? true : false;
    let reduceAudio = req.query.reduceAudio == 'true' ? true : false;
    let fixAudioDelay = req.query.fixAudioDelay == 'true' ? true : false
    let deleteOld = req.query.deleteOld == 'true' ? true : false;
    let createSegments = req.query.createSegments == 'true' ? true : false;
    console.log("FFMPEG-operations: ")

    let filename = req.query.filename
    console.log(filename);
    console.log(req.query.addColors)

    videoEditor.setOptions({
        directoryScan: false,//needed for mergeSegments
        knocksRanges: false,
        //eliminationsRanges: true,
        shotsRanges: false,
        editVideo: false,
    });

    addColors ? await videoEditor.addColors(uploadFolder+filename) : null;

    res.send({ success: true, message: "operation performed!" })
});

// Start the server
app.listen(3002, () => {
    console.log('Server is running on port 3002');
});
