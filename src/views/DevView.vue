<template>
    <div class="canva">
      <!-- Inputs & Draggable View & Save Delete & JsonEditor -->
      <div class="row mx-auto mt-6 bg-gray-200" x-data="">
        <!-- Canva Input Files -->
        <div class="canva__inputs">
          <CanvaInputs @insert-item="addCanvaItemToPage" :selectedItem="selectedItem"
            @selected-item-updated="onSelectedItemChanges">
          </CanvaInputs>
        </div>
  
        <!-- Draggable View -->
        <main class="canva__main" id="canva__main" aria-labelledby=":r4:0" style="min-height: 540px">
          <div class="vWU3Dw">
            <div class="NmadZQ">
              <div class="canva__main-sub" tabindex="-1" role="none" style="touch-action: pan-x pan-y; overflow: hidden">
                <div class="T6XjCg" style="pointer-events: all" @click="canvaContainerClicked">
                  <div class="WVSfHg" style="pointer-events: all">
                    <div class="dP63AQ">
                      <div class="K7UhbQ">
                        <div class="fo6ibA">
                          <div
                            style="position: relative; font-size: 38px; z-index: 9999; width: 608px; transform: scale(0.42); margin: auto; text-align: center; color: rgba(12,12,12, 0.5);">
                            <span style="position: absolute; left:100px; top:-50px;">
                              <div style="display: inline-block; cursor: pointer;">
                                <span @click="isPlaying ? stop() : play()" style="font-size: 32px;">
                                  <i :class="'bi bi-' + (isPlaying ? 'stop' : 'play') + '-circle'"></i>
                                  T:
                                  <span>
                                    {{ ((endPlayingTimer.getTime() - startPlayingTimer.getTime()) / 1000 +
                                      currentPlayingTime).toFixed(2) }}
                                  </span>
                                </span>
  
                              </div>
                            </span>
                          </div>
                          <div class="qWdtDQ">
                            <div class="uPeMFQ">
                              <div class="xvJQZA">
                                <div class="_2y_DBA" data-page-id="1"
                                  style="width: 807.261px; height: 454.084px; margin: 0px">
  
                                  <div class="O7ADyQ" style="width: 1920px; height: 1080px; transform: scale(0.42)">
  
                                    <div class="pTC3Qw canva__container" lang="en" style="width: 1920px; height: 1080px; background-color: white;">
                                      <template v-for="page in pages">
                                        <div :style="'display:' + (page.id == selectedPage.id ? '' : 'none;')">
                                          <template v-for="myItem in page.items">
                                            <CanvaItem :item="myItem" :id="myItem.id" :pageId='page.id' :type="myItem.type"
                                              :source="myItem.source" :outsideClick="outsideClick"
                                              :operation="myItem.operation" :currentPlayingTime="currentPlayingTime"
                                              :styles="myItem.styles" :zIndex="myItem?.styles?.zIndex"
                                              @updated-styles="stylesUpdated" @item-selected="selectedItemChanged">
                                            </CanvaItem>
                                          </template>
                                        </div>
                                      </template>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            style="position: relative; font-size: 38px; z-index: 9999; width: 608px; transform: scale(0.42); margin: auto; text-align: center; color: rgba(12,12,12, 0.5);">
                            <span
                              style="position: absolute; left: 0px; top:-20px; transform: scaleY(31); padding-bottom: 47px;">|</span>
                            <span
                              style="position: absolute; top:-20px; transform: scaleY(31); padding-bottom: 47px;">|</span>
                            <span
                              style="position: absolute; right: 0px; top:-20px; transform: scaleY(31); padding-bottom: 47px;">|</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
  
        <!-- Save Delete -->
        <div style="margin-top: 60px; margin-bottom: 10px;">
          <button class="btn btn-success" @click="saveAll()">Save</button>&nbsp;
          <button class="btn btn-danger" @click="deleteAll()">Delete</button>
          &nbsp;&nbsp;
          <input type="number" v-model="currentPlayingTime" style="max-width: 60px;">&nbsp;
          <button class="btn btn-primary" @click="seekTotalVideoTimer(currentPlayingTime++)">Seek: {{ currentPlayingTime
          }}</button>
        </div>
  
        <!-- 3d sample, delete it -->
        <h1 class="nice_bold_text_example"
          style="display:none; font-family: 'Red Ring Bold'; color: white; font-size: 80px;-webkit-text-stroke:4px black; letter-spacing: -3px;">
          obviously
        </h1>
  
  
      </div>
  
  
      <!-- Play/Stop & Pages & subTimeline -->
      <div id="canva__timeline" style="margin-top: 0px; margin-bottom: 10px;" aria-labelledby=":r4:0">
        <div class="row">
          <!-- <div class="col-md-2">
            <div id="dropZone">Drag and drop</div>
            <input style="display: none" type="file" name="fileInput" id="fileInput" multiple />
          </div> -->
          <div class="col-md">
            <div class="canva__timeline" style="">
              <div style="display: inline-block; cursor: pointer;">
                <span @click="isPlaying ? stop() : play()" style="font-size: 32px;">
                  <i :class="'bi bi-' + (isPlaying ? 'stop' : 'play') + '-circle'"></i></span>
              </div>
              <div class="sub__timeline" v-if="selectedPage">
                <CanvaSubTimeline :items="lastThreeItems"
                  :config="{ onTimelineItemClicked: onTimelineItemClicked, onItemUpdate: onItemUpdate }"
                  :timelineMarkers="selectedPage.timelineMarkers" @deleteMarker="deleteMarker" :key="subTimelineKey">
                </CanvaSubTimeline>
  
              </div>
              <div class="timeline__video">
                <DraggableTimeline v-model="pages" class="canva__timeline-mother" @start="drag = true" @end="drag = false"
                  item-key="id">
                  <template #item="{ element }">
                    <div class="canva__timeline-item"
                      :style="element.id == selectedPage.id ? 'border: solid darkorange' : ''"
                      @click="changeSelectedPage(element.id)">
                      {{ element.id }}
                      <div class="item__duration">{{
                        element.items.length > 0 ?
                        (Math.max(...(element.items.map((e: any) => e.end)))
                          - Math.min(...(element.items.map((e: any) => e.start)))).toFixed(2)
  
                        : 0
                      }}s</div>
                    </div>
                  </template>
                </DraggableTimeline>
  
                <div class="canva__timeline-item" style="" @click="addNewPage()">
                  <div>ADD + </div>
                </div>
  
              </div>
              <div class="timeline__audio">audio</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- JsonEditor -->
      <JsonEditorVue v-model="selectedItem" class="jse-theme-dark" :onChange="onSelectedItemChanges" />
  
      <!-- Common Components - Sound Effects - Global Audio -->
      <div id="common_components" style="display: ;">
  
        <div v-if="globalVoiceOver != ''">
          <audio ref="globalVoiceOverPlayer" style="width: 100%;" controls>
            <source :src="globalVoiceOver">
          </audio>
        </div>
        <div v-if="globalBGMusic != ''">
          <audio ref="globalBGMusicPlayer" style="width: 100%;" controls>
            <source :src="globalBGMusic">
          </audio>
        </div>
  
        <div class="common_sounds">
          <!-- Common Sounds: -->
          <audio id="audio_common_swoosh1">
            <source src="http://localhost:3002/common_components/sound-effects/SWOOSH1-fixed.mp3" type="audio/mpeg">
          </audio>
          <audio id="audio_common_swoosh2">
            <source src="http://localhost:3002/common_components/sound-effects/SWOOSH2-fixed.mp3" type="audio/mpeg">
          </audio>
          <audio id="audio_common_swoosh3">
            <source src="http://localhost:3002/common_components/sound-effects/SWOOSH3-fixed.mp3" type="audio/mpeg">
          </audio>
          <audio id="audio_common_swoosh4">
            <source src="http://localhost:3002/common_components/sound-effects/SWOOSH4-fixed.mp3" type="audio/mpeg">
          </audio>
          <audio id="audio_common_swoosh5">
            <source src="http://localhost:3002/common_components/sound-effects/SWOOSH5-fixed.mp3" type="audio/mpeg">
          </audio>
          <audio id="audio_common_waterDrop">
            <source src="http://localhost:3002/common_components/sound-effects/drop.mp3" type="audio/mpeg">
          </audio>
          <audio id="audio_common_keyboard1">
            <source src="http://localhost:3002/common_components/sound-effects/keyboard1.mp3" type="audio/mpeg">
          </audio>
        </div>
      </div>
  
      <!-- Voice Commands -->
      <div>
        <div>
          <h2>Voice Commands</h2>
          <table class="table table-responsive">
            <thead>
              <th>Word</th>
              <th>function</th>
            </thead>
            <tbody>
              <tr>
                <td>Play/Start/Pause/Stop</td>
                <td>Play/Stop</td>
              </tr>
              <tr>
                <td>Refresh</td>
                <td>Refresh Page</td>
              </tr>
              <tr>
                <td>Time [Next | X seconds]</td>
                <td>Moves Current Time</td>
              </tr>
              <tr>
                <td>Select [Next | Previous]</td>
                <td>Selects next/previous element in array</td>
              </tr>
              <tr>
                <td>Custom | Upload | Uploaded</td>
                <td>Selects Input Tabs</td>
              </tr>
  
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <style></style>
  
  <script lang="ts">
  import CanvaItem from '../components/CanvaItem.vue'
  import CanvaInputs from '../components/CanvaInputs.vue'
  import DraggableTimeline from 'vuedraggable'
  import CanvaSubTimeline from '../components/CanvaSubTimeline.vue'//@ts-ignore
  import { CanvaItemI } from '../interfaces/CanvaItemI'//@ts-ignore
  import { PageItemI } from '../interfaces/PageItemI'//@ts-ignore
  import { MarkerItemI } from '../interfaces/MarkerItemI'
  import 'vanilla-jsoneditor/themes/jse-theme-dark.css'//@ts-ignore
  import JsonEditorVue from 'json-editor-vue'
  
  
  export default {
    name: 'DevView',
    display: 'Transitions',
    order: 7,
    components: {
      CanvaItem,
      CanvaInputs,
      DraggableTimeline,
      CanvaSubTimeline,
      JsonEditorVue
    },
    data() {
      return {
        jsonEditorTesting: { hello: "world", how: "are", you: "?" },
        drag: false,
  
        globalVoiceOver: "",//"http://localhost:3002/samia-video-editing/globalVoiceOver-cut-pitch-increased-by-1.mp3",
        //globalBGMusic: "http://localhost:3002/uploads/GlobalBGMusic-ThinkAboutMe.mp3",
        globalBGMusic: "http://localhost:3002/common_components/music/GlobalBGMusic-ThinkAboutMe.mp3",
  
        pages: [] as PageItemI[],
        selectedPage: {} as PageItemI,
        lastThreeItems: [] as CanvaItemI[],
        subTimelineKey: 0,
  
  
        isFileAdded: false,
        selectedItem: {} as CanvaItemI,
        selectedItemIndex: -1,
  
        outsideClick: '',
        operation: 'resize',
        itemSwitched: false,
  
        isPlaying: false,
        currentPlayingTime: 0,
        startPlayingTimer: new Date(),
        endPlayingTimer: new Date(),
        playingInterval: 0,
  
        playAllTimeout: [0],//@ts-ignore
  
        recognition: new window.webkitSpeechRecognition(),
  
      }
    },
    computed: {},
    methods: {
      stylesUpdated: function (styles: any) {
        //console.log("styles updated")
        //console.log(styles)
        let that = this
        let foundPage = this.pages.find((e) => e.id == that.selectedPage.id)
        if (foundPage) {
          foundPage.items.forEach((e: CanvaItemI, i: Number) => {
            //@ts-ignore
            if (e.id == styles.id && foundPage.id == styles.pageId) {
              console.log("update", styles)
              e.styles = styles
            }
          })
          // console.log('outside-update')
          // console.log(foundPage)
        }
      },
      addNewPage: function () {
        let id = this.pages.length > 0 ? this.pages[this.pages.length - 1].id + 1 : 1;
  
        let newPage = { id: id, items: [], duration: 5 };
        this.pages.push(newPage)
        this.selectedPage = newPage;
      },
      addCanvaItemToPage: function (item: any) {
        let that = this
        let foundPage = this.pages.find((e) => e.id == that.selectedPage.id)
        if(!foundPage){
          this.addNewPage();
          foundPage = this.pages[0]
        }
        
        if (foundPage) {
          console.log(foundPage.items.map((e: CanvaItemI) => e.id))
          let id = 0;
          if (foundPage.items.length > 0) id = Math.max(...(foundPage.items.map((e: CanvaItemI) => e.id))) + 1;
  
          if (item.type == 'timelineMarker') {
            let newItems = {} as MarkerItemI;
            newItems.type = item.type
            newItems.text = item.text
            newItems.start = this.currentPlayingTime;
            if (!this.selectedPage.timelineMarkers)
              this.selectedPage.timelineMarkers = []
            this.selectedPage.timelineMarkers.push(newItems)
          } else {
  
            console.log("AddCanvaitemToPage:")
            console.log(item)
  
            let newItems = {} as CanvaItemI;
            newItems = {
              id: id, name: item.name,
              type: item.type, category: item.category,
              source: item.source,
              duration: item.duration, playbackspeed: item.playbackspeed,
              styles: item.styles, operation: '', start: this.currentPlayingTime,
              end: this.currentPlayingTime + item.duration,
              transition: { name: item.transition?.name, direction: item.transition?.direction },
              isOld: item.isOld
            }
  
  
  
            console.log("New Item:", newItems)
            foundPage.items.push(newItems);
          }
        }
        this.subTimelineKey++;
      },
      changeSelectedPage: function (id: number) {
        let that = this
        let foundPage = this.pages.find((e) => e.id == id)
        if (foundPage) {
          this.selectedPage = foundPage;
          this.itemSwitched = !this.itemSwitched;
          this.outsideClick = "" + Math.random()
        }
      },
      selectedItemChanged: function (info: any) {
        //this.selectedItem = this.selectedPage.items[info.id];//wrong index as we sort
        this.selectedPage.items.forEach((item: CanvaItemI, index: Number) => {
          if (info.id == item.id) {
            this.selectedItem = item;
          }
        });
  
        this.outsideClick = info.id + ":" + info.pageId;//to disselect other item
      },
  
      canvaContainerClicked(e: any) {
        let clickedClass = e.target.classList;
        if (clickedClass.contains('canva__container') || clickedClass.contains('dP63AQ') || clickedClass.contains('WVSfHg')) {//@ts-ignore
          this.selectedItem = {};
          this.outsideClick = "" + Math.random();//disselect all items
        }
      },
  
      /* subTimeline */
      onTimelineItemClicked: function (item: any) {
        this.seekTotalVideoTimer(item.start * 1)
        var e = document.getElementById('item_' + this.selectedPage.id + '_' + item.id)
        e?.click();
      },
      onItemUpdate(time?: any) {
        if (time) {
          this.currentPlayingTime = time * 1;
          this.seekTotalVideoTimer(time * 1)
        }
        else this.subTimelineKey++;
      },
      deleteMarker(time: number) {
        console.log("Deleting Marker(DevView):", time)
        this.selectedPage.timelineMarkers.forEach((marker: MarkerItemI, index: number) => {
          if (marker.start == time) {
            console.log('found marker')
            this.selectedPage.timelineMarkers.splice(index, 1)
            this.subTimelineKey++;
            return;
          }
        })
      },
      /* play & stop everything */
      playPageContent(page: PageItemI) {
        page.items.forEach((item: CanvaItemI, index: Number) => {
          //console.log(this.currentPlayingTime, item.start, item.end)
          if (item.end >= this.currentPlayingTime) {
            console.log(this.currentPlayingTime, item.start, item.end)
            item.operation = 'play'
          } else if (item.start < this.currentPlayingTime - 1) {
            item.operation = 'hide'
          }
        })
      },
      stopPageContent(page: PageItemI) {
        page.items.forEach((item: CanvaItemI, index: Number) => {
          item.operation = ''
        })
      },
      play: function () {
        let that = this;
        if (!this.isPlaying) {
          this.isPlaying = true
          this.startPlayingTimer = new Date();
          this.endPlayingTimer = this.startPlayingTimer
          this.playingInterval = setInterval(() => {
            that.endPlayingTimer = new Date();
          }, 250)
  
  
          /* play only current page */
          that.playPageContent(this.selectedPage)
  
  
          if (this.$refs.globalVoiceOverPlayer) {//@ts-ignore
            this.$refs.globalVoiceOverPlayer.currentTime = this.currentPlayingTime;//@ts-ignore
            this.$refs.globalVoiceOverPlayer.play();
          }
  
          if (this.$refs.globalBGMusicPlayer) {//@ts-ignore
            this.$refs.globalBGMusicPlayer.currentTime = this.currentPlayingTime;//@ts-ignore
            this.$refs.globalBGMusicPlayer.volume = 0.01;//@ts-ignore
            this.$refs.globalBGMusicPlayer.play();
          }
        } else {
          this.stop();
        }
      },
      stop: function () {
        let that = this;
  
        this.endPlayingTimer = new Date();
        clearInterval(this.playingInterval)
  
        that.stopPageContent(this.selectedPage)
  
        //@ts-ignore
        this.$refs.globalVoiceOverPlayer?.pause();//@ts-ignore
        this.$refs.globalBGMusicPlayer?.pause();
  
        this.isPlaying = false;
      },
      seekTotalVideoTimer(time: number) {
        let that = this;
        this.pages.forEach(function (page, index) {
          page.items.forEach((item: CanvaItemI, index: Number) => {
            if (item.start <= time && time <= item.end) {
              item.operation = 'show'
            } else
              item.operation = 'hide'
          })
        });
      },
      /*  */
      saveAll: function () {
        //console.log(this.pages)
        this.stop();
  
  
        let videoData = JSON.stringify(this.pages)
        videoData = JSON.parse(videoData)//@ts-ignore
        videoData[0].items = videoData[0]?.items.sort((a: any, b: any) => a.start - b.start)
        videoData = JSON.stringify(videoData)
  
        /* operation should always be '' */
  
        //localStorage.pages = videoData
  
        let that = this;
        let formData = new FormData();
        let filename = this.$route.params.file + ".json";
        console.log(filename)
        const requestOptions = {
          method: 'POST',
          mode: 'cors', // this cannot be 'no-cors'
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoData: videoData, filename: filename })
        };
        //@ts-ignore
        fetch('http://localhost:3002/save-video-data', requestOptions)
          .then(response => {
            console.log(response)
  
            //console.log(response.json())
            //that.getFilesFromServer();
          })
  
      },
      loadFromServer: function () {
        let that = this;
        const requestOptions = {
          method: 'GET'
        };
        //@ts-ignore
        fetch('http://localhost:3002/get-video-data', requestOptions)
          .then(response => response.json())
          .then(data => {
            let files = data.data;
            let lastFile = files[files.length - 1]
            //console.log(lastFile)
  
            let filepath = lastFile.filePath.replace('public/', '')
            //@ts-ignore
            fetch('http://localhost:3002/' + filepath, requestOptions)
              .then(response => response.json())
              .then(data => {
  
                var regex = /(\"(hide|show|play)\")/g;
                let myPages = JSON.parse(JSON.stringify(data).replace(regex, '""'));
  
                let lastItem = { start: 0 };
                let start = 0, end = 0;
  
                /* myPages[0].items?.forEach((item: CanvaItemI) => {
                  if (item.end > end)
                    end = item.end;
  
                  //@ts-ignore
                  //that.lastThreeItems.push(Object.assign({}, item))
                  that.lastThreeItems.push(item)
                  if (end > 5) {
                    if (that.lastThreeItems.length > 4)
                      that.lastThreeItems.shift();
                    that.currentPlayingTime = that.lastThreeItems[0].start;
                    if (that.currentPlayingTime < 0)
                      that.currentPlayingTime = 0
                  }
  
                }); */
                that.currentPlayingTime = 0
                that.lastThreeItems = myPages[0].items
  
                //@ts-ignore
                //that.lastThreeItems.push(thirdLastItem, secondLastItem, lastItem)
  
                //that.currentPlayingTime = secondLastItem.start;
  
                that.pages = myPages
                that.selectedPage = that.pages[0]
              });
  
  
          });
      },
      loadFile: function () {
        let that = this;
        const requestOptions = {
          method: 'GET'
        };
        let filepath = 'canva_videos_data/' + this.$route.params.file + ".json";
        fetch('http://localhost:3002/' + filepath, requestOptions)
          .then(response => response.json())
          .then(async function (data) {
  
            var regex = /(\"(hide|show|play)\")/g;
            let myPages = JSON.parse(JSON.stringify(data).replace(regex, '""'));
  
            let checkedItems = 0;
            for (let index = 0; index < myPages[0].items.length; index++) {
              let item = myPages[0].items[index];
              if (item.type == 'page' && item.source) {
                console.log(item.type, item.source)
                await fetch('http://localhost:3002/canva_videos_data/' + item.source, requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    console.log(data[0].items)
                    myPages[0].items[index].page.items = data[0].items
                    checkedItems++;
                    console.log(myPages[0])
                    if (checkedItems == myPages[0].items.length) {
                      console.log("calling in if")
                      that.lateAddingData(myPages)
                    }
                  });
              } else {
                checkedItems++;
                if (checkedItems == myPages[0].items.length) {
                  console.log("calling in else")
                  that.lateAddingData(myPages)
                }
              }
            }
  
            /* that.currentPlayingTime = 0
            that.lastThreeItems = myPages[0].items
  
            that.pages = myPages
            that.selectedPage = that.pages[0] */
  
  
          });
      },
      lateAddingData: function (myPages: PageItemI[]) {
        this.currentPlayingTime = 0
        this.lastThreeItems = myPages[0].items
  
        this.pages = myPages
        this.selectedPage = this.pages[0]
      },
      deleteAll: function () {
        localStorage.pages = ''
        this.stop();
  
  
        let videoData = '[]'
  
  
        let that = this;
        let formData = new FormData();
        formData.append('video_data', videoData)
  
        const requestOptions = {
          method: 'POST',
          mode: 'cors', // this cannot be 'no-cors'
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: videoData
        };
        //@ts-ignore
        fetch('http://localhost:3002/save-video-data', requestOptions)
          .then(response => {
            console.log(response)
          })
      },
      /*  */
      /*  */
      onSelectedItemChanges: function (changes: any) {
        let that = this;
        if (changes.json) {
          /* changes from: jsonEditor */
          if (this.selectedItem == changes.json) {
            console.log("no change found.")
            return;
          }
          this.selectedItem = changes.json;
  
        } else {
          /* changes from: CanvaInputs */
          this.selectedItem = changes;
        }
        this.selectedPage.items.forEach((e: any, index: number) => {
          if (e.id == this.selectedItem.id) {
            this.pages[0].items[index] = this.selectedItem
            that.subTimelineKey++;
            that.saveAll();
  
          }
        });
      },
      /*  */
      /*  */
      handleShortcuts: function (e: any) {
        console.log(e)
        switch (e.key) {
          case '[':
            console.log('Move to Back')
            if (this.selectedPage.items.length > 1) {
              if (isNaN(this.selectedItem.styles.zIndex) || this.selectedItem.styles.zIndex < 1)
                this.selectedItem.styles.zIndex = 1;
              this.selectedItem.styles.zIndex = this.selectedItem.styles.zIndex * 1 - 1;
            }
            break;
          case ']':
            console.log('Move to Front')
            if (this.selectedPage.items.length > 1) {
              if (isNaN(this.selectedItem.styles.zIndex))
                this.selectedItem.styles.zIndex = 0;
              this.selectedItem.styles.zIndex = this.selectedItem.styles.zIndex * 1 + 1;
            }
            break;
          case 'Delete':
            console.log("Delete Item")
            this.selectedPage.items.splice(this.selectedItem.id, 1);
            break;
          case 'Escape':
            console.log("escape pressed .")//@ts-ignore
            this.selectedItem = {};
            this.outsideClick = "" + Math.random();
            break;
          case ' '://Space
            e.preventDefault()
            console.log("space pressed")//@ts-ignore
            this.play();
            break;
          case 'Control'://Space
            e.preventDefault()
            console.log("ctrl pressed")//@ts-ignore
            //this.play();
            break;
          default:
            console.log("default here")
            break;
        }
      },
      handleSpeechRecognition: function () {
        let that = this;
        console.log("speech recognition")
        //@ts-ignore
        //let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;//
        //this.recognition = new SpeechRecognition();
  
        this.recognition.continuous = true; // Allow continuous recognition
        this.recognition.lang = 'en-US'; // Set the language
        this.recognition.onresult = (event: any) => {
          let transcript = event.results[event.results.length - 1][0].transcript;
          // Handle the recognized text (e.g., display it on the web page)
          transcript = transcript.toLowerCase();
          console.log(transcript)
          if (transcript.includes('start') || transcript.includes('play') || transcript.includes('stop') || transcript.includes('pause')) {
            that.handleShortcuts({ key: ' ', preventDefault: function () { } })
          }
          if (transcript.includes('refresh')) {
            location.reload();
          }
  
          if (transcript.includes('time')) {
            const numbers = transcript.match(/\d+(\.\d+)?/g);
            console.log(numbers)
            if (numbers != null && numbers.length > 0) {
              console.log("seeking now: ")
              that.currentPlayingTime =numbers[0] * 1 
              that.seekTotalVideoTimer(numbers[0] * 1)
            }
            if (transcript.includes('next')) {
              that.seekTotalVideoTimer(that.currentPlayingTime++)
            }
          }
  
          if (transcript.includes('select')) {
            if (transcript.includes('next')) {
              that.selectedItemIndex = that.selectedItemIndex + 1;
              console.log(that.selectedItemIndex)
              that.onItemUpdate(that.pages[0].items[that.selectedItemIndex].start + 0.2)
              that.subTimelineKey++;
              that.onTimelineItemClicked(that.pages[0].items[that.selectedItemIndex])
              that.subTimelineKey++;
            } else if (transcript.includes('previous')) {
              that.selectedItemIndex = that.selectedItemIndex - 1;
              console.log(that.selectedItemIndex)
              that.onItemUpdate(that.pages[0].items[that.selectedItemIndex].start)
              that.onTimelineItemClicked(that.pages[0].items[that.selectedItemIndex])
              that.subTimelineKey++;
            }
          }
  
          if (transcript.includes('custom')) {
            document.getElementById('customInputs')?.click();
          }
          if (transcript.includes('uploaded')) {
            document.getElementById('uploadedInputs')?.click();
          } else if (transcript.includes('upload')) {
            document.getElementById('uploadInputs')?.click();
          }
  
  
          if (transcript.includes('save')) {
            that.saveAll();
          }
        };
  
        this.recognition.onend = function () {
          that.recognition?.start();
        }
        this.recognition.onerror = function (e: any) {
          console.log('error occured', e)
        }
        //setTimeout(function () {
        this.recognition?.start()
        //}, 20000)
      }
    },
    mounted: function () {
      let that = this
  
      /* initiate pages from localstorage of browser*/
      //console.log(localStorage.pages)
      // if (localStorage.pages)
      //   this.pages = JSON.parse(localStorage.pages)
      // else
      //   this.pages.push({ id: 0, items: [], duration: 5 })
      this.$route.params.file ? this.loadFile() : this.loadFromServer();
  
      /* dev view: seek to time to only show necessary items in view */
      setTimeout(() => {
        that.seekTotalVideoTimer(that.currentPlayingTime)
      }, 2000)
  
  
      this.selectedPage = this.pages[0]
      /* End */
  
  
      let canva__main = document.getElementById('canva__main');
      canva__main != null ? canva__main.addEventListener('keydown', (e) => {
        that.handleShortcuts(e)
      }) : null;
  
  
      that.handleSpeechRecognition();
  
      document.addEventListener("visibilitychange", function () {
        console.log(document.hidden, document.visibilityState);
        if (document.hidden) {
          that.recognition.abort()
          that.recognition.abort()
          that.recognition = null;
          //that.recognition.stop()
        } else {//@ts-ignore
          that.recognition = new window.webkitSpeechRecognition()
          that.handleSpeechRecognition();
        }
        //if (!document.hidden)
          //that.recognition.start()
      }, false);
    }
  }
  </script>
  
  <style></style>
  