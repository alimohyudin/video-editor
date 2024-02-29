import FfmpegCommand from 'fluent-ffmpeg';
import { spawn } from 'child_process';
import DirectoryUtil from './directory.js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { execa } from 'execa';
dotenv.config();


export default class VideoEditor {
    constructor(options) {
        this.options = options;
        //for youtube shorts:
        if (options.youtubeShortsFormat === true) {
            this.duration = 6;
            this.beforeStart = 3; //beforeStart means that if we recorded an action at 0:25 then we do 0.25 - 3 which is 0.22
            this.zeroKillDuration = 1;
            //
            this.shotsbeforeStart = 2
            this.shotsDuration = 2
        } else {
            //for youtube Longs:
            this.beforeStart = 15;//fast 10; slow 20
            this.duration = 20;// fast 15 ; slow 25
            this.zeroKillDuration = 1;
            //
            this.shotsbeforeStart = 4;// fast 2; slow 6
            this.shotsDuration = 8; // fast 6; slow 10
        }

        this.totalKills = 0;
        this.totalKnocks = 0;
    }
    setOptions(options) {
        this.options = options;
        //for youtube shorts:
        if (options.youtubeShortsFormat === true) {
            this.duration = 5;
            this.beforeStart = 3;
            this.zeroKillDuration = 1;
            //
            this.shotsbeforeStart = 2
            this.shotsDuration = 2
        } else {
            //for youtube Longs:
            this.beforeStart = 15;//fast 10; slow 20
            this.duration = 20;// fast 15 ; slow 25
            this.zeroKillDuration = 1;
            //
            this.shotsbeforeStart = 4;// fast 2; slow 6
            this.shotsDuration = 8; // fast 6; slow 10
        }
    }

    findKnocksRanges(knocksTimeline = null) {

        return new Promise((resolve, reject) => {
            if (!this.options.knocksRanges) {
                return resolve(false);
            }

            let mknocks = knocksTimeline != null ? knocksTimeline : fs.readFileSync('./output/knocksTimeline.json', { encoding: 'utf8', flag: 'r' });
            mknocks = JSON.parse(mknocks);

            let knocks = mknocks;//Object.keys(mknocks);//now we have only arrays, not objects

            this.totalKnocks = knocks.length;//number of knocks for later use, 

            let index = 0;
            let start = knocks[0];
            let duration = this.duration; //end = duration
            let beforeStart = this.beforeStart; //start = beforeStart
            let isDurationChanged = false;

            let calcKnocks = [];

            while (index < knocks.length) {
                /**
                 * End(duration) stays 15 seconds
                 * only if there is not another knock or kill in the same range
                 */
                /* if (!isDurationChanged)
                    duration = 15;

                //console.log("starting loop: index: " + index)
                if (index + 1 <= knocks.length) {
                    //console.log(knocks[index + 1] * 1 - knocks[index] * 1)
                    if (knocks[index + 1] - knocks[index] <= 15) {
                        duration += 10;
                        index++;
                        isDurationChanged = true;
                        continue;
                    }
                }
                //console.log("End: " + end)
                isDurationChanged = false; */
                start = knocks[index] * 1 - beforeStart;

                calcKnocks[calcKnocks.length] = { start: start, duration: duration, end: start * 1 + duration * 1 }
                /**
                 * change start to new one if previous one is used
                 */
                /* if (index + 1 <= knocks.length)
                    start = knocks[index + 1]; */

                index++;
            }

            calcKnocks.sort((a, b) => a.start - b.start);

            const combinedArray = [];

            let totalTime = 0;

            for (let i = 0; i < calcKnocks.length; i++) {
                const currentObject = calcKnocks[i];

                if (i > 0) {
                    const previousObject = combinedArray[combinedArray.length - 1];

                    if (currentObject.start <= previousObject.end) {
                        previousObject.end = currentObject.end;

                        continue;
                    }
                }

                totalTime += currentObject.end - currentObject.start;
                if (this.options.youtubeShortsFormat) {
                    if (totalTime + (currentObject.end - currentObject.start) < 50)
                        combinedArray.push(currentObject);

                } else {
                    combinedArray.push(currentObject);
                }
            }
            console.log("Total Time: " + totalTime)

            console.log(combinedArray);
            //console.log(knocksRanges);
            resolve(combinedArray);

        })
    }
    findShortsRanges(knocksTimeline = null) {

        return new Promise((resolve, reject) => {

            let mknocks = knocksTimeline != null ? knocksTimeline : fs.readFileSync('./output/knocksTimeline.json', { encoding: 'utf8', flag: 'r' });
            mknocks = JSON.parse(mknocks);

            let knocks = mknocks;//Object.keys(mknocks);//now we have only arrays, not objects

            this.totalKnocks = knocks.length;//number of knocks for later use, 

            let index = 0;
            let start = knocks[0];
            let duration = this.duration; //end = duration
            let beforeStart = this.beforeStart; //start = beforeStart
            let isDurationChanged = false;

            let calcKnocks = [];

            while (index < knocks.length) {
                /**
                 * End(duration) stays 15 seconds
                 * only if there is not another knock or kill in the same range
                 */
                /* if (!isDurationChanged)
                    duration = 15;

                //console.log("starting loop: index: " + index)
                if (index + 1 <= knocks.length) {
                    //console.log(knocks[index + 1] * 1 - knocks[index] * 1)
                    if (knocks[index + 1] - knocks[index] <= 15) {
                        duration += 10;
                        index++;
                        isDurationChanged = true;
                        continue;
                    }
                }
                //console.log("End: " + end)
                isDurationChanged = false; */
                start = knocks[index] * 1 - beforeStart;

                calcKnocks[calcKnocks.length] = { start: start, duration: duration, end: start * 1 + duration * 1 }
                /**
                 * change start to new one if previous one is used
                 */
                /* if (index + 1 <= knocks.length)
                    start = knocks[index + 1]; */

                index++;
            }

            calcKnocks.sort((a, b) => a.start - b.start);

            const combinedArray = [];

            let totalTime = 0;

            for (let i = 0; i < calcKnocks.length; i++) {
                const currentObject = calcKnocks[i];

                if (i > 0) {
                    const previousObject = combinedArray[combinedArray.length - 1];

                    if (currentObject.start <= previousObject.end) {
                        previousObject.end = currentObject.end;

                        continue;
                    }
                }

                totalTime += currentObject.end - currentObject.start;

                combinedArray.push(currentObject);
            }
            console.log("Total Time: " + totalTime)

            combinedArray.sort((a, b) => b.start - a.start); //reverse order
            totalTime = 0;

            const combinedArray2 = [];

            for (let i = 0; i < combinedArray.length; i++) {
                const currentObject = combinedArray[i];

                totalTime += currentObject.end - currentObject.start;
                if (!(this.options.fullShortsFormat)) {
                    if (totalTime + (currentObject.end - currentObject.start) < 60)
                        combinedArray2.push(currentObject);

                } else {
                    combinedArray2.push(currentObject);
                }
            }
            console.log("Total Time: " + totalTime)
            combinedArray2.sort((a, b) => a.start - b.start); //reverse order

            console.log(combinedArray2);
            //console.log(knocksRanges);
            resolve(combinedArray2);

        })
    }
    addKillsRangesToKnocks(knocksRanges, killsRanges = null) {
        let that = this;
        return new Promise((resolve, reject) => {
            if (!this.options.eliminationsRanges) {
                return resolve(false);
            }
            //let eliminations = { "0": "80.000", "1": "180.000", "2": "210.000", "3": "265.000", "4": "275.000", "5": "300.000", "6": "370.000", "7": "460.000", "8": "515.000", "10": "535.000", "11": "540.000", "12": "565.000", "13": "640.000", "15": "670.000", "17": "1005.000" }
            let eliminations = killsRanges != null ? killsRanges : fs.readFileSync('./output/eliminationsTimeline.json', { encoding: 'utf8', flag: 'r' });
            eliminations = JSON.parse(eliminations);

            console.log(eliminations)
            let kills = Object.keys(eliminations);
            this.totalKills = kills[kills.length - 1];

            let duration = this.duration;
            let beforeStart = this.beforeStart;

            let meliminations = Object.values(eliminations);
            meliminations.forEach((val) => {
                if (val > beforeStart)
                    val = val - beforeStart; //just like start = start - 10

                duration = this.duration;
                //make zero kill duration being very short
                if (eliminations[0] == val + beforeStart) {
                    val = val + beforeStart;
                    duration = this.zeroKillDuration;
                }
                knocksRanges.push({ start: val * 1, duration: duration, end: val * 1 + duration * 1, kills: "yes" });
            })
            knocksRanges.sort((a, b) => a.start - b.start);

            const combinedArray = [];

            for (let i = 0; i < knocksRanges.length; i++) {
                const currentObject = knocksRanges[i];

                if (i > 0) {
                    const previousObject = combinedArray[combinedArray.length - 1];

                    if (currentObject.start <= previousObject.end) {
                        previousObject.end = currentObject.end;

                        continue;
                    }
                }

                combinedArray.push(currentObject);
            }

            //console.log(combinedArray);
            //console.log(knocksRanges);
            resolve(combinedArray);
        });
    }

    shotsRanges(knocksAndKillsRanges = [], shotsRanges = null) {
        return new Promise((resolve, reject) => {
            if (!this.options.shotsRanges) {
                return resolve(false);
            }

            if(shotsRanges == null){
                return resolve(knocksAndKillsRanges);
            }
            //let eliminations = { "0": "80.000", "1": "180.000", "2": "210.000", "3": "265.000", "4": "275.000", "5": "300.000", "6": "370.000", "7": "460.000", "8": "515.000", "10": "535.000", "11": "540.000", "12": "565.000", "13": "640.000", "15": "670.000", "17": "1005.000" }
            let shots = shotsRanges != null ? shotsRanges : fs.readFileSync('./output/shotsTimeline.json', { encoding: 'utf8', flag: 'r' });
            shots = JSON.parse(shots);

            let duration = this.shotsDuration;
            let beforeStart = this.shotsbeforeStart;

            let allRanges = knocksAndKillsRanges;
            let mshots = shots;
            mshots.forEach((val) => {
                if (val > beforeStart)
                    val = +val - beforeStart; //just like start = start - 10

                //duration = this.duration;
                //if(val > knocksAndKillsRanges[0].start && val < knocksAndKillsRanges[knocksAndKillsRanges.length - 1].end)
                if (val > knocksAndKillsRanges[0].start)
                    allRanges.push({ start: +val, duration: duration, end: +val + +duration, kills: "yes" });
            })
            allRanges.sort((a, b) => a.start - b.start);

            const combinedArray = [];

            for (let i = 0; i < allRanges.length; i++) {
                const currentObject = allRanges[i];

                if (i > 0) {
                    const previousObject = combinedArray[combinedArray.length - 1];

                    if (currentObject.start <= previousObject.end) {
                        previousObject.end = currentObject.end;

                        continue;
                    }
                }

                combinedArray.push(currentObject);
            }

            console.log(combinedArray);
            //console.log(shotsRanges);
            resolve(combinedArray);
        });
    }

    combineCloseRanges(allRanges) {
        return new Promise((resolve, reject) => {

            if (allRanges.length === 0) {
                return resolve([]);
            }

            let newAllRanges = [];
            let last = allRanges[0]
            let combineDuration = 20;
            for (let i = 1; i < allRanges.length; i++) {
                //console.log(last);
                //console.log(allRanges[i]);
                //console.log("==============");
                //console.log(last.end)
                //console.log(allRanges[i].start)

                // if(i > 1)
                //     combineDuration = 20;



                if (allRanges[i].start < last.end + combineDuration) {
                    last.end = allRanges[i].end;
                    last.duration = last.end - last.start;
                    //console.log("YES");
                } else {
                    last.duration = last.end - last.start;//correcting duration left wronged by other function
                    newAllRanges.push(last);
                    last = allRanges[i];
                    //console.log("NO");
                }
                //break;
            }
            newAllRanges.push(last);
            /* if(newAllRanges[newAllRanges.length - 1].end < last.end){

            } */

            let totalDuration = 0;
            for (let i = 0; i < newAllRanges.length; i++) {
                totalDuration += newAllRanges[i].duration;
            }
            console.log(totalDuration);

            resolve(newAllRanges)
        });
    }

    addAudioOnVideo(options) {
        let that = this;
        return new Promise(async (resolve, reject) => {
            let newFilename = filename.replace('.mp4', '-coloring.mp4')

            await fs.renameSync(filename, newFilename)


            let args = [
                '-i', newFilename,
                '-acodec', 'copy',
                '-vf', 'eq=brightness=0.120:contrast=1.400:saturation=2.140:gamma=1.2',
                '-crf', '16',
                '-vcodec', 'h264_amf',
                '-b:v', '120000k',
                '-threads', '0',
                '-hide_banner',
                '-map', '0',
                '-disposition:1', 'default',
                '-movflags', '+faststart',
                '-default_mode', 'infer_no_subs',
                '-ignore_unknown',
                '-f', 'mp4',
                '-y', filename
            ]



            console.log(args.join(' '))

            /* that.runFfmpeg(args).then(async (res) => {
                console.log("Color Added!")
                await fs.unlinkSync(newFilename);
                resolve(filename)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            }); */
            //const { stdout } = await execa('cmd', args).pipeStdout('stdout.txt');
            execa('ffmpeg', args).then(async (res) => {
                console.log("Color Added!")
                await fs.unlinkSync(newFilename);
                resolve(filename)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            });
        });

        /* console.log("===========================");
        console.log('Add Audio on Video!');
        console.log("===========================");
        return new Promise(async (resolve, reject) => {
            if (options.audio == undefined) {
                console.log('No audio arg provided');
                return resolve(false);
            } else {
                //console.log('audio arg provided');
            }

            // Create ffmpeg command
            const command = new FfmpegCommand();

            let audioFiles = await fs.readdirSync(outputAudioPath);
            if (audioFiles.length <= 0) {
                return reject('no audio file exists');
            }
            // Set video resolution and aspect ratio
            command
                .input(outputVideoPath + "subtitle-" + outputFilename)
                .input(outputAudioPath + audioFiles[audioFiles.length - 1])
                .input(inputMusicPath + "quieter-music.wav")
                //.videoCodec('copy')
                .videoCodec('h264_amf')
                .native()
                .audioCodec('aac')
                .audioBitrate(384)
                .audioChannels(2)
                .videoBitrate(15000)
                .outputOptions('-shortest')
                .complexFilter([
                    {
                        filter: 'amix',
                        options: { inputs: 2, duration: 'shortest' },
                        //outputs: 'outputs'
                    }
                ])
                .on('error', function (err) {
                    console.log('An error occured: ' + err.message);
                    reject('An error occured: ' + err.message);
                })
                .on('end', function () {
                    console.log("===========================");
                    console.log('Done: Add Audio on Video!');
                    console.log("===========================");
                    resolve(outputVideoPath + "upload/audio-" + outputFilename);

                })

            // Save the output file
            command.save(outputVideoPath + 'upload/audio-' + outputFilename, (error, file) => {
                console.log('did it ever reached?')
                if (error) {
                    console.log(`Error converting file: ${error}`);
                } else {
                    console.log(`File converted successfully: ${file}`);
                }
            });
        }) */
    }

    editVideo(filepath, ranges, fixAudioDelay = false) {

        return new Promise(async (resolve, reject) => {
            console.log('edit video');
            if (!this.options.editVideo) {
                return resolve(false);
            }
            if (!ranges) {
                return resolve(false);
            }
            console.log('yes: edit video');

            // input video file path
            const inputVideoPath = filepath; //'D:\\work2.0\\currentProjects\\pubg-eliminations-recognition\\input\\videos\\input2.mp4';

            // output video file path
            const outputVideoPath = 'output_video.mp4';

            let index = 0;
            while (index < ranges.length) {
                console.log((index + 1) + " - " + ranges.length);
                await this.createSegment(inputVideoPath, ranges[index].start, ranges[index].end - ranges[index].start, fixAudioDelay);

                index++;
            }
            resolve('video edited')
        })
    }

    createSegment(inputVideoPath, start, duration, fixAudioDelay = false) {
        let that = this;

        console.log("===========================");
        console.log('Start: Create Segment of video!');
        console.log("===========================");

        if (start < 0)
            start = 0;


        return new Promise(async (resolve, reject) => {

            let args = [
                '-hide_banner',
                '-ss', start,
                '-i', inputVideoPath,
                '-t', duration,
                //'-filter:a', 'volume=0.5',//don't allow this if long video
                '-avoid_negative_ts', 'make_zero',
                '-map', '0:0',
                '-c:0', 'copy',//if audio doesn't exist then it will throw ffmpeg error
                '-map', '0:1',//if audio doesn't exist then it will throw ffmpeg error
                '-c:1', 'copy',//if audio doesn't exist then it will throw ffmpeg error
                '-map_metadata', '0',
                '-movflags', '+faststart',
                '-default_mode', 'infer_no_subs',
                '-ignore_unknown',
                '-f', 'mp4',
                '-y', 'temp/' + start + '.mp4'
            ]

            if (fixAudioDelay) {
                //ffmpeg -ss '70' -t '10' -i "DouWan_20230704_003808.mp4" -itsoffset 0.75 -ss '70' -t '10' -i "DouWan_20230704_003808.mp4" -map 1:v -map 0:a -c:v hevc_amf -b:v 200000k "DouWan_20230704_003808-sync.mp4" -y
                args = [
                    '-ss', start,
                    '-i', inputVideoPath,
                    '-t', duration,
                    '-itsoffset', '0.75',
                    '-ss', start,
                    '-i', inputVideoPath,
                    '-t', duration,
                    '-avoid_negative_ts', 'make_zero',
                    '-map', '1:v',
                    '-map', '0:a',
                    '-map_metadata', '0',
                    '-movflags', '+faststart',
                    '-default_mode', 'infer_no_subs',
                    '-ignore_unknown',
                    '-f', 'mp4',
                    '-y', 'temp/' + start + '.mp4'
                ]
            }

            await that.runFfmpeg(args);
            resolve('temp/' + start + '.mp4')

            return;
        })
    }

    mergeSegments() {
        let that = this;
        console.log("===========================");
        console.log('Start: Merge Segment of video!');
        console.log("===========================");
        console.log("Total Knocks: " + this.totalKnocks)
        console.log("Total Kills: " + this.totalKills)
        console.log("===========================");


        return new Promise(async (resolve, reject) => {
            if (!this.options.editVideo) {
                return resolve(false);
            }
            // Create ffmpeg command
            const command = new FfmpegCommand();
            // input video file path
            this.options.directoryScan = true;
            let dirUtil = new DirectoryUtil('./temp', this.options);
            dirUtil.scan(true).then(async (res) => {
                //console.log(res);
                let myfiles = res.map((file) => {
                    //command.addInput('./temp/' + file.file);
                    return process.env.base_path + '/temp/' + file.file;
                })

                console.log(myfiles);

                myfiles = myfiles.map((file) => {
                    return "file '" + file + "'\n"
                });
                myfiles = myfiles.join('')

                let tempfilenamestxt = process.env.base_path + '/temp/tempfilenames.txt';
                await fs.writeFileSync(tempfilenamestxt, myfiles);

                console.log(myfiles);
                let filename = process.env.base_path + '/output/' + ((new Date()).getTime()) + '.mp4'


                let args = [
                    '-hide_banner',
                    '-f', 'concat',
                    '-safe', '0',
                    //'-protocol_whitelist', 'file,pipe,fd',
                    '-i', tempfilenamestxt,
                    '-map', '0:0',
                    '-c:0', 'copy',
                    '-disposition:0', 'default',
                    '-map', '0:1',
                    '-c:1', 'copy',
                    '-disposition:1', 'default',
                    '-movflags', '+faststart',
                    '-default_mode', 'infer_no_subs',
                    '-ignore_unknown',
                    '-f', 'mp4',
                    '-y', filename
                ]

                console.log(args.join(' '))

                that.runFfmpeg(args).then((res) => {
                    resolve(filename)
                }).catch((err) => {
                    console.log(err)
                    reject('failed at ffmpeg')
                });
            })
        });
    }
    
    makeYoutubeShortsFormat(filepath = null, fastMode = false) {
        let that = this;
        console.log("===========================");
        console.log('Start: Youtube Shorts Format video!');
        console.log("===========================");

        if (filepath == '' || filepath == null) {
            filepath = './output/1685506513678.mp4'
        }


        return new Promise(async (resolve, reject) => {
            if (!this.options.youtubeShortsFormat) {
                return resolve(false);
            }

            const outputWidth = 837; // (9/16 * inputHeight)
            const outputHeight = 1488//'?';

            // Create ffmpeg command
            //const command = new FfmpegCommand(filepath);
            let output_shorts_filepath = './output/' + ((new Date()).getTime()) + '.mp4'

            // Set video resolution and aspect ratio
            let args = [
                '-hide_banner',
                //'-protocol_whitelist', 'file,pipe,fd',
                '-i', filepath,
                '-filter:v', 'crop=' + outputWidth + ':' + outputHeight + '',
                '-r', fastMode ? '30' : '60',
                '-map', '0:0',
                '-c:0', 'copy',
                '-disposition:0', 'default',
                '-map', '0:1',
                '-c:1', 'copy',
                '-disposition:1', 'default',
                '-movflags', '+faststart',
                '-default_mode', 'infer_no_subs',
                '-ignore_unknown',
                '-c:v', 'libx264',
                '-vcodec', 'h264_amf',
                '-b:v', '120000k',
                '-f', 'mp4',
                '-y', output_shorts_filepath
            ]

            console.log(args.join(' '))

            that.runFfmpeg(args).then((res) => {
                resolve(output_shorts_filepath)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            });



            /* command
                .videoFilters('crop=1080:1080')//works perfectly as HD for shorts
                //.videoFilters('crop=675:1200')//for Douwan Videos only which is 1600:1200 4:3 ratio, it is converted to 9:16 ratio
                //it works as SD
                //https://www.calculatorsoup.com/calculators/math/ratios.php
                .videoCodec('h264_amf')
                .native()
                .audioCodec('aac')
                .audioBitrate(384)
                .audioChannels(2)
                .videoBitrate(20000)
                .on('error', function (err) {
                    console.log('Error ' + err.message);
                })
                .on('end', function () {
                    console.log("===========================");
                    console.log('Finished: Youtube Shorts Format video!');
                    console.log("===========================");
                    resolve(output_shorts_filepath);
                });
    
    
    
            // Save the output file
            command.save(output_shorts_filepath, (error, file) => {
                if (error) {
                    console.log(`Error converting file: ${error}`);
                } else {
                    console.log(`File converted successfully: ${file}`);
                }
            }); */
        });
    }

    addColors(filename) {
        let that = this;
        return new Promise(async (resolve, reject) => {
            let newFilename = filename.replace('.mp4', '-coloring.mp4')

            await fs.renameSync(filename, newFilename)


            let args = [
                '-i', newFilename,
                '-acodec', 'copy',
                '-vf', 'eq=brightness=0.100:contrast=1.000:saturation=2.00:gamma=1.0',
                '-crf', '16',
                '-vcodec', 'h264_amf',
                '-b:v', '120000k',
                '-threads', '0',
                '-hide_banner',
                '-map', '0',
                '-disposition:1', 'default',
                '-movflags', '+faststart',
                '-default_mode', 'infer_no_subs',
                '-ignore_unknown',
                '-f', 'mp4',
                '-y', filename
            ]



            console.log(args.join(' '))

            //const { stdout } = await execa('cmd', args).pipeStdout('stdout.txt');
            execa('ffmpeg', args).then(async (res) => {
                console.log("Color Added!")
                //await fs.unlinkSync(newFilename);
                // Subdirectory name to replace the last segment of the path
                const subdirectoryName = 'backup'; // Replace with your desired subdirectory name

                // Use path.dirname to get the directory part of the path
                const directory = path.dirname(newFilename);

                // Use path.basename to get the filename part of the path
                const fileName = path.basename(newFilename);

                // Create the new path by joining the directory and subdirectory name
                const newPath = path.join(directory, subdirectoryName, fileName);
                
                await fs.copyFileSync(newFilename, newPath)
                await fs.unlinkSync(newFilename)


                resolve(filename)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            });
        });
    }

    reduceAudio(filename) {
        let that = this;
        return new Promise(async (resolve, reject) => {
            let newFilename = filename.replace('.mp4', '-reducing-audio.mp4')

            await fs.renameSync(filename, newFilename)

            //ffmpeg -i DouWan_20230703_011321-del.mp4 -hide_banner -filter:a "volume=0.01" -avoid_negative_ts make_zero -map 0:0 -c:0 copy -map 0:1 -map_metadata 0 -movflags +faststart -default_mode infer_no_subs -ignore_unknown -f mp4 -y DouWan_20230703_011321.mp4

            let args = [
                '-i', newFilename,
                '-hide_banner',
                '-filter:a', "volume=0.04",
                '-vcodec', 'h264_amf',
                '-b:v', '120000k',
                '-b:a', '192k',
                '-map', '0:0',
                '-c:0', 'copy',
                '-map', '0:1',
                '-disposition:1', 'default',
                '-movflags', '+faststart',
                '-default_mode', 'infer_no_subs',
                '-ignore_unknown',
                '-f', 'mp4',
                '-y', filename
            ]



            console.log(args.join(' '))

            /* that.runFfmpeg(args).then(async (res) => {
                console.log("Color Added!")
                await fs.unlinkSync(newFilename);
                resolve(filename)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            }); */
            //const { stdout } = await execa('cmd', args).pipeStdout('stdout.txt');
            execa('ffmpeg', args).then(async (res) => {
                console.log("Audio Reduced!")
                await fs.unlinkSync(newFilename);
                resolve(filename)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            });
        });
    }

    addStartupTopMessages(filename) {
        let that = this;
        return new Promise(async (resolve, reject) => {
            let newFilename = filename.replace('.mp4', '-top-messages.mp4')

            await fs.renameSync(filename, newFilename)

            //ffmpeg -c:v libvpx-vp9 -i D:\work2.0\DeployableProjects\pubg-editor-final\output\output_video.webm -i .\1689639830130.mp4 -filter_complex "[1:v][0:v] overlay=25:25:enable='between(t,0,11)'" -pix_fmt yuv420p -c:a copy -disposition:1 default -movflags '+faststart' -default_mode infer_no_subs -ignore_unknown -b:a 192k -b:v 120000k -vcodec h264_amf  -f mp4 -y output.mp4

            let args = [
                '-c:v', 'libvpx-vp9',
                '-i', './inputs/top-messages-startup.webm',
                '-i', newFilename,
                '-filter_complex', "[1:v][0:v] overlay=25:25:enable='between(t,0,11)'",
                '-pix_fmt', 'yuv420p',
                '-c:a', 'copy',
                '-disposition:1', 'default',
                '-movflags', '+faststart',
                '-default_mode', 'infer_no_subs',
                '-ignore_unknown',
                '-b:a', '192k',
                '-b:v', '120000k',
                '-vcodec', 'h264_amf',
                '-f', 'mp4',
                '-y', filename
            ]



            console.log(args.join(' '))

            //const { stdout } = await execa('cmd', args).pipeStdout('stdout.txt');
            execa('ffmpeg', args).then(async (res) => {
                console.log("Startup messages Added!")
                await fs.unlinkSync(newFilename);
                resolve(filename)
            }).catch((err) => {
                console.log(err)
                reject('failed at ffmpeg')
            });
        });

    }

    runFfmpeg(args) {

        console.log("===========================");
        console.log('Start: FFMPEG Script!');
        console.log("===========================");
        //console.log(args.join(' '));

        return new Promise((resolve, reject) => {
            // Spawn a new NodeJS process
            const ffmpegProcess = spawn('ffmpeg', args);

            // Capture the output from the Python program
            ffmpegProcess.stdout.on('data', (data) => {
                console.log(`FFMPEG program output: ${data}`);


            });

            // Handle any errors that occur during execution
            ffmpegProcess.on('error', (err) => {
                console.error(`Error executing FFMPEG program: ${err}`);
            });

            // Handle the FFMPEG program's exit
            ffmpegProcess.on('close', (code) => {
                console.log(`FFMPEG program exited with code ${code}`);
                console.log(args)
                console.log("===========================");
                console.log('Finished: FFMPEG Script!');
                console.log("===========================");
                if (code === 0) {
                    return resolve('done');
                } else {
                    return reject('error code: ' + code);

                }
            });
        });
    }
}
