<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div style="position: relative;">
        <div style="overflow-y: scroll; max-height: 610px; position: relative; height: 560px;">
            <table class="table table-responsive">
                <tbody>
                    <template v-for="item in items" :key="item.id">
                        <template
                            v-if="showTypes != 'upload' && (item.type == showTypes || showTypes == 'uploaded' || showTypes == 'common')">
                            <tr>
                                <td>
                                    <span>{{ item.name }}</span>
                                    <div @click="addCanvaItemToPage(item)">

                                        <template v-if="item.type == 'video'">
                                            <video controls>
                                                <source :src="item.source" type="video/mp4" />
                                            </video>
                                            <!-- <ThumbnailApp :video-src="item.source" :snapshot-at-duration-percent="50"
                                                :width="240" :height="80" :chunks-quantity="10">
                                            </ThumbnailApp> -->
                                        </template>
                                        <!-- <template v-if="item.type == 'video' && item.category == 'video-overlays'">
                                            <video :src="item.source" height="240" width="320">
                                            </video>
                                        </template> -->
                                        <template v-if="item.type == 'image'">
                                            <img :src="item.source" height="180" width="240" alt="" style="max-width: 80px;"
                                                srcset="" />
                                        </template>
                                        <template v-if="item.type == 'audio'">
                                            <audio controls>
                                                <source :src="item.source" type="audio/mpeg">
                                                Your browser does not support the audio element.
                                            </audio>
                                        </template>
                                    </div>
                                </td>
                                <td>
                                    <span @click="addCanvaItemToPage(item)" style="font-size: 18px; color: green;"><i
                                            class="bi bi-plus-circle"></i></span> <br /><br />
                                    <span @click="deleteFromServer(item.source, item.id)"
                                        style="font-size: 18px; color:red"><i class="bi bi-trash3"></i></span>
                                </td>
                            </tr>
                        </template>
                    </template>
                </tbody>
            </table>
            <!-- Input Drag & Drop -->
            <div :style="'display: ' + (showTypes == 'upload' ? '' : 'none')">
                <div id="dropZone">Drag and drop</div>
                <input style="display: none" type="file" name="fileInput" id="fileInput" multiple />

                <div style="margin-top:20px;">
                    <button class="btn btn-primary">Create Nested Item</button>
                </div>
            </div>

            <!-- Custom Items -->
            <div :style="'display: ' + (showTypes == 'custom' ? '' : 'none')">

                <!-- Input Text with Animations -->
                <h1 @click="showCustoms.customInputTextAnimation = !showCustoms.customInputTextAnimation">Text animated >
                </h1>
                <template v-if="showCustoms.customInputTextAnimation">
                    <div style="margin-top:20px;">
                        <input type="text" v-model="inputAnimatedText.text" name="inputTextAnimation"
                            placeholder="Text"><br /><br />
                        <select name="animations" v-model="inputAnimatedText.animation">
                            <option value="none">None</option>
                            <option value="power1.out">Power1</option>
                            <option value="power2.out">Power2</option>
                            <option value="power3.out">Power3</option>
                            <option value="power4.out">Power4</option>
                            <option value="back.out">Back</option>
                            <option value="elastic.out">Elastic</option>
                            <option value="bounce">Bounce</option>
                            <option value="rough">Rough</option>
                            <option value="slow">Slow</option>
                            <option value="steps">Steps</option>
                            <option value="circ.out">Circle</option>
                            <option value="expo.out">Exponential</option>
                            <option value="sine.out">Sine</option>
                        </select>
                        <select name="textStyle" v-model="inputAnimatedText.textStyle">
                            <option value="none">None</option>
                            <option value="style1">Style 1</option>
                            <option value="style2">Style 2</option>
                            <option value="text3d">Text3d</option>
                        </select>
                        <input type="number" v-model="inputAnimatedText.fontSize" name="inputTextAnimationFontSize"
                            placeholder="12" style="max-width: 40px;"><br />
                        <input type="text" v-model="inputAnimatedText.fontColor" name="inputTextAnimationFontColor"
                            placeholder="white" style="max-width: 50px;">
                        <input type="text" v-if="inputAnimatedText.textStyle == 'text3d'"
                            v-model="inputAnimatedText.fontColor2" name="inputTextAnimationFontColor" placeholder="white"
                            style="max-width: 50px;">
                        <input type="text" v-if="inputAnimatedText.textStyle == 'text3d'"
                            v-model="inputAnimatedText.shadowColor" name="inputTextAnimationFontColor" placeholder="white"
                            style="max-width: 50px;">
                        <input type="number" v-model="inputAnimatedText.stroke" name="inputTextAnimationStroke"
                            placeholder="12" style="max-width: 40px;">
                        <input type="text" v-model="inputAnimatedText.strokeColor" name="inputTextAnimationFontColor"
                            placeholder="white" style="max-width: 50px;"><br /><br />
                        <button class="btn btn-primary" @click="playTextAnimation()">Play</button>
                        <br /><br />


                        <div ref="inputAnimatedTextPlay"
                            style="text-align: left; position: relative; margin-bottom: 100px;">
                            <span :class="inputAnimatedText.textStyle"
                                :style="'font-size:' + inputAnimatedText.fontSize + 'px; color: ' + inputAnimatedText.fontColor + ';-webkit-text-stroke: ' + (inputAnimatedText.stroke ? inputAnimatedText.stroke : 4) + 'px ' + inputAnimatedText.strokeColor + '; text-shadow:' + (inputAnimatedText.textStyle == 'text3d' ? ' -1px -1px 1px #efede3, 0px 1px 0 #2e2e2e, 0px 2px 0 #2c2c2c,  0px 3px 0 #2a2a2a, 0px 4px 0 #282828, 0px 5px 0 #262626, 0px 6px 0 #242424,  0px 7px 0 #222, 0px 8px 0 #202020, 0px 9px 0 #1e1e1e, 0px 10px 0 #1c1c1c,  0px 11px 0 #1a1a1a, 0px 12px 0 #181818, 0px 13px 0 #161616, 0px 14px 0 #141414,  0px 15px 0 #121212, 2px 20px 5px rgba(0, 0, 0, 0.9),  5px 23px 5px rgba(0, 0, 0, 0.3), 8px 27px 8px rgba(0, 0, 0, 0.5),  8px 28px 35px ' + inputAnimatedText.strokeColor + ';' : ';')">{{
                                    inputAnimatedText.text }}</span>
                            <span v-if="inputAnimatedText.textStyle == 'text3d'"
                                :class="inputAnimatedText.textStyle + ' text3d-sub'"
                                :style="'font-size:' + inputAnimatedText.fontSize + 'px; background: -webkit-linear-gradient(' + inputAnimatedText.fontColor + ', ' + inputAnimatedText.fontColor2 + ');  -webkit-text-fill-color: transparent;  -webkit-background-clip: text;  background-clip: text; -webkit-text-stroke: 0px black;'">{{
                                    inputAnimatedText.text }}</span>
                        </div>


                        <br /><br />
                        <button class="btn btn-success" @click="addAnimatedTextToPage()">Create Animated Text</button>
                    </div>

                </template>

                <!-- Input Text with Animations -->
                <h1 @click="showCustoms.customInputItemSearch = !showCustoms.customInputItemSearch">Input item >
                </h1>
                <template v-if="showCustoms.customInputItemSearch">
                    <div style="margin-top:20px;">
                        <label for="customInputItemSearchText">Search</label>
                        <input type="text" v-model="customInputItemSearchText" id="customInputItemSearchText"
                            name="customInputItemSearchText" placeholder="Search"><br />
                        <ol class="searchInputItem">
                            <li v-for="item, index in customInputItemSearchList" v-bind:key="index">
                                <h3 @click="addFilesToStore([item])">{{ item.file }}</h3>
                            </li>
                        </ol>
                    </div>

                </template>

                <!-- Input Marker Text on subtimeline-->
                <h1 @click="showCustoms.customAddMarker = !showCustoms.customAddMarker">Add timeline marker >
                </h1>
                <template v-if="showCustoms.customAddMarker">
                    <div style="margin-top:20px;">
                        <label for="customAddMarkerText">Add Marker</label>
                        <input type="text" v-model="customAddMarkerText" id="customAddMarkerText" name="customAddMarkerText"
                            placeholder="Marker name"><br />
                        <button class="btn btn-primary" @click="addMarkerToPage()">Add Marker</button>
                    </div>

                </template>

                <!-- Input HTML-->
                <h1 @click="showCustoms.customAddHtml = !showCustoms.customAddHtml">Add HTML >
                </h1>
                <template v-if="showCustoms.customAddHtml">
                    <div style="margin-top:20px;">
                        <label for="htmlText">Add HTML</label>
                        <textarea name="html" id="html" cols="30" rows="10" v-model="customHtml"></textarea>
                        <br />
                        <button class="btn btn-primary" @click="addHtmlToPage()">Add HTML</button>
                    </div>

                </template>

                <!-- Input Tiktok TTS Voice-->
                <h1 @click="showCustoms.customAddTiktokVoice = !showCustoms.customAddTiktokVoice">Tiktok Voice >
                </h1>
                <template v-if="showCustoms.customAddTiktokVoice">
                    <div style="margin-top:20px;">
                        <label for="htmlText">Tiktok TTS Voice</label>
                        <textarea name="html" id="html" cols="30" rows="10" v-model="customTiktokVoice"></textarea>
                        <br />
                        <button class="btn btn-primary" @click="addTiktokVoiceToPage()">Add Voice</button>
                    </div>

                </template>
            </div>

        </div>
        <!-- Bottom Navigation -->
        <div id="resources_area" style="position: absolute; bottom: -50px;">
            <ul>
                <li id="uploadedInputs" @click="showTypes = 'uploaded';" :class="showTypes == 'uploaded' ? 'selected' : ''">
                    Uploaded</li>
                <!-- <li @click="showTypes = 'common'; getFilesFromServer('common')"
                    :class="showTypes == 'common' ? 'selected' : ''">Common</li> -->
                <!-- <li @click="showTypes = 'image'" :class="showTypes == 'image' ? 'selected' : ''">Images</li> -->
                <!-- <li @click="showTypes = 'video'" :class="showTypes == 'video' ? 'selected' : ''">Videos</li> -->
                <!-- <li @click="showTypes = 'videoOverlay'" :class="showTypes == 'videoOverlay' ? 'selected' : ''">Overlays</li> -->
                <!-- <li @click="showTypes = 'audio'" :class="showTypes == 'audio' ? 'selected' : ''">Audios</li> -->
                <li id="customInputs" @click="showTypes = 'custom'" :class="showTypes == 'custom' ? 'selected' : ''">Custom
                </li>
                <li id="uploadInputs" @click="showTypes = 'upload'" :class="showTypes == 'upload' ? 'selected' : ''">Upload
                </li>
                <li @click="getFilesFromServer();"><i class="bi bi-arrow-clockwise"></i></li>
            </ul>

        </div>

        <!-- Update Selected Item -->
        <div v-if="selectedItem && selectedItem.id >= 0" class="selectedItemUpdate"
            style="position: absolute; left:0px; top: 0px; height: 540px; width: 353px; background: rgba(63, 63, 63, 1); overflow: auto; padding: 0px 0px 5px 5px;">

            <label for="name"> Name: </label>
            <input type="text" name="name" v-model="selectedItem.name"><br />

            <template v-if="selectedItem.type == 'animatedText'">
                <label for="name"> Font Size: </label>
                <input type="number" v-model="selectedItem.source.fontSize" name="inputTextAnimationfontSize"
                    placeholder="12" style="max-width: 40px;"><br />
                <label for="name"> Stroke: </label>
                <input type="number" v-model="selectedItem.source.stroke" name="inputTextAnimationStroke" placeholder="12"
                    style="max-width: 40px;"><br />
            </template>
            <template v-if="selectedItem.type == 'video' || selectedItem.type == 'image'">
                <div>
                    <button class="btn btn-primary"
                        @click="selectedItem.styles.styles.parent = 'z-index: 1000; height: 1080px; width: 1920px; position: absolute; top: 0px; left: 0px; translate: none; rotate: none; scale: none; transform: translate(0px, 0px);'; selectedItem.styles.styles.childchild = 'height: 1080px; width: 1920px;';">Fit
                        Screen</button>
                </div>
            </template>

            <template v-if="selectedItem.type == 'video' || selectedItem.type == 'audio'">
                <label for="name"> Playback: </label>
                <input type="number" v-model="selectedItem.playbackspeed" name="inputVideoPlaybackspeed" placeholder="0.50"
                    style="max-width: 60px;"><br />

                <label for="name"> Volume: </label>
                <input type="number" v-model="selectedItem.volume" name="inputVideoVolume" placeholder="100"
                    style="max-width: 60px;"><br />
            </template>

            <label for="name"> Transition: </label>
            <select name="transitionName" v-model="selectedItem.transition.name">
                <option value="none">None</option>
                <option value="isaac">isaac: Moving</option>
                <option value="random">Random</option>
            </select><br />

            <label for="name"> Direction: </label>
            <select name="transitionDirection" v-model="selectedItem.transition.direction">
                <option value="none">None</option>
                <option value="leftBottom">Left Bottom</option>
                <option value="rightBottom">Right Bottom</option>
            </select><br />
            <!-- <input type="text" name="source"
                :value="selectedItem.type == 'animatedText' ? JSON.stringify(selectedItem.source) : selectedItem.source"> --><br /><br />


            <h1 style="color:white;">Animations: {{ selectedItem.seek }}s</h1>
            <button class="btn btn-primary" @click="addSampleAnimtionToItem()">Add Animation</button><br />
            <template v-for="(anim, index) in selectedItem?.animations" :key="index">
                <hr>
                <select name="animations" v-model="anim.ease">
                    <option value="none">None</option>
                    <option value="power1.out">Power1</option>
                    <option value="power2.out">Power2</option>
                    <option value="power3.out">Power3</option>
                    <option value="power4.out">Power4</option>
                    <option value="back.out">Back</option>
                    <option value="elastic.out">Elastic</option>
                    <option value="bounce">Bounce</option>
                    <option value="rough">Rough</option>
                    <option value="slow">Slow</option>
                    <option value="steps">Steps</option>
                    <option value="circ.out">Circle</option>
                    <option value="expo.out">Exponential</option>
                    <option value="sine.out">Sine</option>
                    <option value="isaac">Isaac: Continuesly moving</option>
                    <option value="blur">Blur: Filter Blur(8px)</option>
                </select>&nbsp;
                <!-- <select name="animations" v-if="anim.ease == 'isaac'" v-model="anim.direction">
                    <option value="">None</option>
                    <option value="leftBottom">Left Bottom</option>
                    <option value="rightBottom">Right Bottom</option>
                </select>&nbsp; -->
                <input type="number" v-model="anim.start" name="starttime" placeholder="start"
                    style="max-width: 40px;" />&nbsp;
                <input type="number" v-model="anim.end" name="starttime" placeholder="end"
                    style="max-width: 40px;" />&nbsp;<br />
                <input type="text" v-model="anim.transform" name="starttime" placeholder="transform"
                    style="width: 166px;" />&nbsp;
                <button class="btn btn-danger" @click="selectedItem.animations.splice(index, 1)">Remove</button>
            </template><br /><br />
            <button class="btn btn-success" @click="saveSelectedItemChanges()">Save Animations*</button><br />

            <hr>
            <hr>

            <h1 style="color:white">FFMPEG:</h1>

            <button class="btn btn-warning" @click="ffmpegOperationServer(selectedItem.source, 'addColors')">Add
                Colors</button>
        </div>
    </div>
</template>

<script lang="ts">
import gsap from 'gsap'//@ts-ignore
//import ThumbnailApp from './vue-video-thumbnail/src/components/VueVideoThumbnail.vue'//@ts-ignore
import { CanvaItemI } from '../interfaces/CanvaItemI'//@ts-ignore
import { ServerFileI } from '../interfaces/ServerFileI'


export default {
    name: "CanvaInputs",
    props: ['selectedItem'],
    emits: ['insertItem', 'selectedItemUpdated'],
    components: {
        //ThumbnailApp
    },
    data() {
        return {
            serverFiles: [],

            items: [] as CanvaItemI[],
            commonItems: [] as CanvaItemI[],
            showTypes: 'upload',
            isFileAdded: false,

            showCustoms: { customInputTextAnimation: false, customInputItemSearch: false, customAddMarker: false, customAddHtml: false, customAddTiktokVoice: false },
            inputAnimatedText: { text: 'Text Here', animation: 'bounce', textStyle: "style1", fontSize: 80, fontColor: 'white', fontColor2: 'white', shadowColor: 'white', stroke: 4, strokeColor: 'black', stayAnimation: '' },
            customInputItemSearchText: '',
            customInputItemSearchList: [] as ServerFileI[],
            customAddMarkerText: '',
            customHtml: '',
            customTiktokVoice: '',
        }
    },
    methods: {
        addCanvaItemToPage(item: any) {
            console.log("add to page")
            this.$emit('insertItem', item)
        },
        addAnimatedTextToPage() {
            let item = {
                name: this.inputAnimatedText.text,
                type: 'animatedText',
                source: {},
                duration: 3,
                start: 0,
                end: 3,
                styles: { id: -1, pageId: -1, parent: '', childchild: '', zIndex: 1000 },
                operation: '',
                transition: { name: 'none', direction: 'none' }
            }

            item.source = Object.assign({}, this.inputAnimatedText)

            this.addCanvaItemToPage(item)
        },
        addMarkerToPage() {
            let item = {
                type: 'timelineMarker',
                text: this.customAddMarkerText,
                start: 0,
            }

            this.addCanvaItemToPage(item)
        },
        addHtmlToPage() {
            let item = {
                name: 'html',
                type: 'html',
                source: this.customHtml,
                duration: 5,
                start: 0,
                end: 5,
                styles: { id: -1, pageId: -1, parent: 'height: 1280px, width: 1920px;', childchild: 'height: 1280px, width: 1920px;', zIndex: 1000 },
                operation: '',
                transition: { name: 'none', direction: 'none' }
            }

            this.addCanvaItemToPage(item)
        },
        addTiktokVoiceToPage() {
            let that = this;
            const ENDPOINT = 'https://tiktok-tts.weilnet.workers.dev'
            const voice = 'en_us_009'
            try {
                const req = new XMLHttpRequest()
                req.open('POST', `${ENDPOINT}/api/generation`, false)
                req.setRequestHeader('Content-Type', 'application/json')
                req.send(JSON.stringify({
                    text: that.customTiktokVoice,
                    voice: voice
                }))

                let resp = JSON.parse(req.responseText)
                if (resp.data === null) {
                    console.error(`<b>Generation failed</b><br/> ("${resp.error}")`)
                } else {
                    console.log(resp.data)
                    //setAudio(resp.data, text)
                    const audio = new Audio(`data:audio/mpeg;base64,${resp.data}`)
                    audio.onloadedmetadata = function () {
                        let myitem = {
                            name: that.customTiktokVoice,
                            type: 'audio',
                            category: 'audio',
                            source: `data:audio/mpeg;base64,${resp.data}`,
                            playbackspeed: 1,
                            duration: Number(Number(audio.duration).toFixed(2)),
                            start: 0,
                            end: Number(Number(audio.duration).toFixed(2)),
                            styles: { id: -1, pageId: -1, parent: '', childchild: '', zIndex: 1000 },
                            operation: '',
                            transition: { name: 'none', direction: 'none' },
                            isOld: false
                        }
                        that.addCanvaItemToPage(myitem)
                    }
                }
            } catch {
                console.error('Error submitting form (printed to F12 console)')
                console.log('^ Please take a screenshot of this and create an issue on the GitHub repository if one does not already exist :)')
                console.log('If the error code is 503, the service is currently unavailable. Please try again later.')
                console.log(`Voice: ${voice}`)
                console.log(`Text: ${that.customTiktokVoice}`)
            }
        },
        addFilesToStore: function (files: any) {
            let that = this;
            let image = ['jpg', 'png', 'gif', 'webp', 'jpeg']
            let video = ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'ogg', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov']
            let audio = ['m4a', 'flac', 'mp3', 'wav']
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                let id = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 0
                let fileExtension = file.file.slice(file.file.lastIndexOf('.') + 1)//file.file.split('.')[1];
                if (video.includes(fileExtension)) {
                    file['url'] = file.fileUrl;
                    /* Video Duration */
                    that.items.push({
                        id: id,
                        name: file.file,
                        type: 'video',
                        category: file.category ? file.category : 'video',
                        source: file['url'],
                        playbackspeed: 1,
                        duration: file.duration,
                        start: 0,
                        end: file.duration,
                        styles: { id: -1, pageId: -1, parent: '', childchild: '', zIndex: 1000 },
                        operation: '',
                        transition: { name: 'none', direction: 'none' },
                        isOld: false
                    })



                    /* End */


                } else if (image.includes(fileExtension)) {
                    file['url'] = file.fileUrl;
                    this.isFileAdded = true
                    this.items.push({
                        id: id,
                        name: file.file,
                        type: 'image',
                        category: file.category ? file.category : 'image',
                        source: file['url'],
                        playbackspeed: 1,
                        duration: 5,
                        start: 0,
                        end: 5,
                        styles: { id: -1, pageId: -1, parent: '', childchild: '', zIndex: 1000 },
                        operation: '',
                        transition: { name: 'none', direction: 'none' },
                        isOld: false
                    })
                } else if (audio.includes(fileExtension)) {
                    file['url'] = file.fileUrl;

                    const audio = new Audio(file['url'])
                    audio.onloadedmetadata = function () {
                        //window.URL.revokeObjectURL(audio.src);
                        // console.log("audio duration: ")
                        // console.log(audio.duration)
                        that.isFileAdded = true
                        that.items.push({
                            id: id,
                            name: file.file,
                            type: 'audio',
                            category: file.category ? file.category : 'audio',
                            source: file['url'],
                            playbackspeed: 1,
                            duration: Number(Number(audio.duration).toFixed(2)),
                            start: 0,
                            end: Number(Number(audio.duration).toFixed(2)),
                            styles: { id: -1, pageId: -1, parent: '', childchild: '', zIndex: 1000 },
                            operation: '',
                            transition: { name: 'none', direction: 'none' },
                            isOld: false
                        })
                    };
                }
            }
        },
        sendFilesToServer: function (files: any) {
            let that = this;
            let formData = new FormData();
            files.forEach((file: any) => {
                formData.append('file[]', file)
            })

            const requestOptions = {
                method: 'POST',
                body: formData
            };
            fetch('http://localhost:3002/upload-files', requestOptions)
                .then(response => {
                    //console.log(response.json())
                    that.getFilesFromServer();
                })
            //.then(response => response.json())
            //.then(data => product.value = data);
        },
        getFilesFromServer: function (type?: string) {
            let that = this

            const requestOptions = {
                method: 'GET'
            };

            type = type ? type : ''//set default

            fetch('http://localhost:3002/get-files?type=' + type, requestOptions)
                //.then(response => console.log(response.json()))
                .then(response => response.json())
                .then(data => {
                    let files = data.data;
                    //console.log(files)
                    //that.items = [];
                    //that.serverFiles = files;
                    //console.log(that.serverFiles.slice(0,5))
                    if (type == 'common') {
                        //that.addFilesToStore(files)
                        that.serverFiles = files;
                    } else {
                        that.addFilesToStore(files.reverse().slice(0, 10))
                    }

                    //that.items = data.data

                });
        },
        deleteFromServer: function (source: string, id: number) {
            let that = this;

            source = source.split('uploads/')[1];
            fetch('http://localhost:3002/delete-file?filename=' + source)
                .then((res) => {
                    let index = that.items.findIndex(x => x.id == id)
                    that.items.splice(index, 1)
                })
        },
        ffmpegOperationServer: function (source: string, operation: string) {
            let that = this;
            source = source.split('uploads/')[1];
            fetch('http://localhost:3002/ffmpeg-operations?filename=' + source + '&' + operation + '=true')
                .then((res) => {
                    console.log(res)
                })
        },
        playTextAnimation: function () {
            //console.log("playing animation:")
            gsap.fromTo(Object(this.$refs.inputAnimatedTextPlay), { transform: "scale(0)" }, { duration: 0.3, ease: this.inputAnimatedText.animation, transform: "scale(1)" })
        },
        /*  */
        addSampleAnimtionToItem: function () {
            if (this.selectedItem) {
                let lastAnim = null
                if (this.selectedItem.animations) {
                    if (this.selectedItem.animations.length > 0)
                        lastAnim = this.selectedItem.animations[this.selectedItem.animations.length - 1]
                } else {
                    this.selectedItem.animations = []
                }

                this.selectedItem.animations.push({ start: lastAnim ? lastAnim.end : 0, end: lastAnim ? lastAnim.end + 5 : 5, ease: 'none', transform: 'scale(1.5)', direction: '' })
            }
        },
        saveSelectedItemChanges: function () {
            console.log(this.selectedItem)
            if (this.selectedItem.animations && this.selectedItem.animations.length > 0) {
                this.selectedItem.animations.sort((a: any, b: any) => a.end - b.end)
                this.selectedItem.animations.sort((a: any, b: any) => a.start - b.start)
            }

            this.$emit('selectedItemUpdated', this.selectedItem)
        }
    },
    mounted: function () {
        let that = this;
        const dropZone = document.getElementById('dropZone')
        const inputFile = document.getElementById('fileInput')
        if (inputFile && dropZone) {
            inputFile.addEventListener('change', handleFileInput)
            dropZone.addEventListener('dragover', handleDragOver)
            dropZone.addEventListener('drop', handleDrop)
            dropZone.addEventListener('click', handleClick)
            document.addEventListener('paste', handlePaste)
        }

        function handleDrop(event: any) {
            event.preventDefault()
            //console.log(event.dataTransfer.files)
            that.sendFilesToServer(event.dataTransfer.files)
            //that.addFilesToStore(event.dataTransfer.files)
        }
        function handleDragOver(event: any) {
            event.preventDefault()
        }
        function handleFileInput(event: any) {
            // Handle files selected through the file input element
            const files = event.target.files
            //console.log(files)
            that.sendFilesToServer(files)
            //that.addFilesToStore(files)
        }
        function handleClick(event: any) {
            //console.log(event.dataTransfer.files)
            let inputField = document.getElementById('fileInput')

            inputField ? inputField.click() : null
        }
        function handlePaste(event: any) {
            console.log("Handling paste")
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;

            for (const item of items) {
                if (item.type.indexOf('image') !== -1) {
                    const blob = item.getAsFile();
                    /* const imageURL = URL.createObjectURL(blob);
                    // Create an image element and display the pasted image
                    const img = new Image();
                    img.src = imageURL; */
                    that.sendFilesToServer([blob])
                }
            }
        }




        this.getFilesFromServer();
        this.getFilesFromServer('common');
    },
    watch: {
        customInputItemSearchText(val) {
            let that = this;
            that.customInputItemSearchList = [];
            if (val == '') {
                return;
            }

            const lowerSearchTerm = val.toLowerCase();
            return this.serverFiles.filter((item: any) => {
                if (item.hasOwnProperty('file') && typeof item.file === 'string') {
                    const lowerName = item.file.toLowerCase();
                    if (lowerName.includes(lowerSearchTerm))
                        that.customInputItemSearchList.push((item))
                }
                if (item.hasOwnProperty('category') && typeof item.category === 'string') {
                    const lowerName = item.category.toLowerCase();
                    if (lowerName.includes(lowerSearchTerm))
                        that.customInputItemSearchList.push((item))
                }
            });
        }
    }
}

</script>

<style>
label {
    margin: 10px 10px;
}

.selectedItemUpdate>label {
    color: white;
    margin: 10px 10px;

}
</style>