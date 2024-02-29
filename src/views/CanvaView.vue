<template>
  <div class="canva">
    <div class="row mx-auto mt-6 bg-gray-200" x-data="">
      <!-- Canva Input Files -->
      <div class="canva__inputs">
        <CanvaInputs @insert-item="addCanvaItemToPage"></CanvaInputs>
      </div>
      <main class="canva__main" id="canva__main" aria-labelledby=":r4:0" style="min-height: 540px">
        <div class="vWU3Dw">
          <div class="NmadZQ">
            <div class="canva__main-sub" tabindex="-1" role="none" style="touch-action: pan-x pan-y; overflow: hidden">
              <div class="T6XjCg" style="pointer-events: all" @click="canvaContainerClicked">
                <div class="WVSfHg" style="pointer-events: all">
                  <div class="dP63AQ">
                    <div class="K7UhbQ">
                      <div class="fo6ibA">
                        <div class="qWdtDQ">
                          <div class="uPeMFQ">
                            <div class="xvJQZA">
                              <div class="_2y_DBA" data-page-id="1"
                                style="width: 807.261px; height: 454.084px; margin: 0px">
                                <div class="O7ADyQ" style="width: 1920px; height: 1080px; transform: scale(0.42)">
                                  <div class="pTC3Qw canva__container" lang="en" style="width: 1920px; height: 1080px">
                                    <template v-for="page in pages">
                                      <div :style="'display:' + (page.id == selectedPage.id ? '' : 'none;')">
                                        <template v-for="myItem in page.items">
                                          <CanvaItem :item="myItem" :id="myItem.id" :pageId='page.id' :type="myItem.type"
                                            :source="myItem.source" :outsideClick="outsideClick"
                                            :operation="myItem.operation" :currentPlayingTime="currentPlayingTime" :styles="myItem.styles"
                                            :zIndex="myItem.styles.zIndex" @updated-styles="stylesUpdated"
                                            @item-selected="selectedItemChanged">
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>



      <div style="margin-top: 60px; margin-bottom: 10px;">
        <button class="btn btn-primary" @click="saveAll()">Save</button>&nbsp;
        <button class="btn btn-danger" @click="deleteAll()">Delete</button>
        &nbsp;&nbsp;
        <input type="number" v-model="currentPlayingTime" style="max-width: 60px;">&nbsp;
        <button class="btn btn-success" @click="seekTotalVideoTimer(currentPlayingTime++)">Seek: {{ currentPlayingTime
        }}</button>
      </div>

      <h1 class="nice_bold_text_example"
        style="display:none; font-family: 'Red Ring Bold'; color: white; font-size: 80px;-webkit-text-stroke:4px black; letter-spacing: -3px;">
        OBVIOUSLY</h1>

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
    </div>

    <div style="margin-top: 0px; margin-bottom: 10px;">
      <div class="row">
        <!-- <div class="col-md-2">
          <div id="dropZone">Drag and drop</div>
          <input style="display: none" type="file" name="fileInput" id="fileInput" multiple />
        </div> -->
        <div class="col-md">
          <div class="canva__timeline" style="">
            <div style="display: inline-block; cursor: pointer;">
              <span @click="play()" style="font-size: 32px;"><i class="bi bi-play-circle"></i></span>&nbsp;
              <span @click="stop()" style="font-size: 32px;"><i class="bi bi-stop-circle"></i></span>&nbsp;
            </div>
            <div class="sub__timeline" v-if="selectedPage">
              <CanvaSubTimeline :items="selectedPage.items" :currentPlayingTime="currentPlayingTime" :config="{onTimelineItemClicked:onTimelineItemClicked}"></CanvaSubTimeline>

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


  </div>
</template>

<style></style>

<script lang="ts">
import CanvaItem from '../components/CanvaItem.vue'
import CanvaInputs from '../components/CanvaInputs.vue'
import DraggableTimeline from 'vuedraggable'
import CanvaSubTimeline from '../components/CanvaSubTimeline.vue'//@ts-ignore
import { CanvaItemI } from '../interfaces/CanvaItemI'//@ts-ignore
import { PageItemI } from '../interfaces/PageItemI'


export default {
  display: 'Transitions',
  order: 7,
  components: {
    CanvaItem,
    CanvaInputs,
    DraggableTimeline,
    CanvaSubTimeline
  },
  data() {
    return {
      drag: false,

      globalVoiceOver: "http://localhost:3002/samia-video-editing/globalVoiceOver-cut-pitch-increased-by-1.mp3",
      globalBGMusic: "http://localhost:3002/samia-video-editing/globalBGMusic3.mp3",
      pages: [] as PageItemI[],
      selectedPage: {} as PageItemI,


      isFileAdded: false,
      selectedItem: {} as CanvaItemI,

      outsideClick: '',
      operation: 'resize',
      itemSwitched: false,

      isPlaying: false,
      currentPlayingTime: 0,
      startPlayingTimer: 0,
      endPlayingTimer: 0,

      playAllTimeout: [0],

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
            //console.log("update")
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
    addCanvaItemToPage: function (item: CanvaItemI) {
      let that = this
      let foundPage = this.pages.find((e) => e.id == that.selectedPage.id)
      if (foundPage) {
        console.log(foundPage.items.map((e: CanvaItemI) => e.id))
        let id = 0;
        if (foundPage.items.length > 0) id = Math.max(...(foundPage.items.map((e: CanvaItemI) => e.id))) + 1;

        console.log("AddCanvaitemToPage:")
        console.log(foundPage.items)

        let newItems = {} as CanvaItemI;
        newItems = { id: id, name: item.name, type: item.type, source: item.source, duration: item.duration, playbackspeed: item.playbackspeed, styles: item.styles, operation: '', start: this.currentPlayingTime, end: this.currentPlayingTime + item.duration }
        console.log("New Item:", newItems)
        foundPage.items.push(newItems);
        if (item.type == 'video') {
          foundPage.duration = item.duration
        }
      }

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
      //console.log("selectedItemChanged")
      //console.log(info)
      this.selectedItem = this.selectedPage.items[info.id];
      //console.log(this.selectedItem)
      this.outsideClick = info.id + ":" + info.pageId;//to disselect other item
    },

    canvaContainerClicked(e: any) {
      // console.log('canva container clicked: ')
      // console.log(e.target.classList)
      let clickedClass = e.target.classList;
      if (clickedClass.contains('canva__container') || clickedClass.contains('dP63AQ') || clickedClass.contains('WVSfHg')) {
        this.outsideClick = "" + Math.random();//disselect all items
      }
    },
    onTimelineItemClicked: function (item: any) {
      console.log("onTimelineItemClicked");
      //this.selectedItemChanged({id: item.id, pageId: this.selectedPage.id})
      console.log('item_'+this.selectedPage.id+'_'+item.id)
      var e = document.getElementById('item_'+this.selectedPage.id+'_'+item.id)
      e?.click();
    },

    /* play & stop everything */
    playPageContent(page: PageItemI) {
      page.items.forEach((item: CanvaItemI, index: Number) => {
        //console.log(this.currentPlayingTime, item.start, item.end)
        if (item.end >= this.currentPlayingTime) {
          console.log(this.currentPlayingTime, item.start, item.end)
          item.operation = 'play'
        } else if(item.start < this.currentPlayingTime -1 ){
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

        /* play only current page */
        that.playPageContent(this.selectedPage)

        //@ts-ignore
        this.$refs.globalVoiceOverPlayer.currentTime = this.currentPlayingTime;//@ts-ignore
        this.$refs.globalVoiceOverPlayer.play();
        //@ts-ignore
        this.$refs.globalBGMusicPlayer.currentTime = this.currentPlayingTime;//@ts-ignore
        this.$refs.globalBGMusicPlayer.volume = 0.05;//@ts-ignore
        this.$refs.globalBGMusicPlayer.play();
      }
    },
    stop: function () {
      let that = this;

      that.stopPageContent(this.selectedPage)

      //@ts-ignore
      this.$refs.globalVoiceOverPlayer.pause();//@ts-ignore
      this.$refs.globalBGMusicPlayer.pause();

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

      /* operation should always be '' */

      //localStorage.pages = videoData

      let that = this;
      let formData = new FormData();
      formData.append('video_data', videoData)
      //let formParam = new URLSearchParams(formData)

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
          console.log(lastFile)

          let filepath = lastFile.filePath.replace('public/', '')
          //@ts-ignore
          fetch('http://localhost:3002/' + filepath, requestOptions)
            .then(response => response.json())
            .then(data => {

              var regex = /(\"(hide|show|play)\")/g;
              //console.log(JSON.stringify(data).replace(regex, '""'))
              that.pages = JSON.parse(JSON.stringify(data).replace(regex, '""'));
              that.pages[0].items.sort((a:any,b:any)=>a.start-b.start)
              console.log(that.pages)
              //that.pages = data
              that.selectedPage = that.pages[0]
            });


        });
    },
    deleteAll: function () {
      localStorage.pages = ''
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
    }
    /*  */
  },
  mounted: function () {
    let that = this

    /* initiate pages */
    //console.log(localStorage.pages)
    // if (localStorage.pages)
    //   this.pages = JSON.parse(localStorage.pages)
    // else
    //   this.pages.push({ id: 0, items: [], duration: 5 })
    this.loadFromServer();



    this.selectedPage = this.pages[0]
    /* End */
    let canva__main = document.getElementById('canva__main');
    canva__main != null ? canva__main.addEventListener('keydown', (e) => {
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
          console.log("escape pressed")
          this.outsideClick = "" + Math.random();
          break;
        default:
          console.log("default here")
          break;
      }
    }) : null;
  }
}
</script>

<style></style>