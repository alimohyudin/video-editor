<template>
  <div class="canva" style="overflow-x: hidden; overflow-y: hidden;">
    <div class="" data-page-id="1" style="height:100%; width:100%; margin: 0px; overflow: hidden !important;">
      <div class="O7ADyQ" style="width: 1920px; height: 1080px; transform: scale(1); overflow: hidden !important;">
        <div class="pTC3Qw canva__container" lang="en"
          style="width: 1920px; height: 1080px; overflow: hidden !important;">
          <template v-for="page in pages">
            <div :style="'display:' + (page.id == selectedPage.id ? '' : 'none;')">
              <template v-for="item in page.items">
                <CanvaItem :item="item" :id="item.id" :pageId='page.id' :type="item.type" :source="item.source"
                  :outsideClick="outsideClick" :operation="item.operation" :styles="item.styles"
                  :zIndex="item.styles.zIndex">
                </CanvaItem>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div id="common_components" style="display: none;">

    <div v-if="globalVoiceOver != ''">
      <audio ref="globalVoiceOverPlayer">
        <source :src="globalVoiceOver">
      </audio>
    </div>
    <div v-if="globalBGMusic != ''">
      <audio ref="globalBGMusicPlayer" controls>
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
</template>
  
<style scoped>
body {
  overflow: hidden !important;
}
</style>
  
<script lang="ts">
import CanvaItem from '../components/CanvaItem.vue'
import CanvaInputs from '../components/CanvaInputs.vue'
import DraggableTimeline from 'vuedraggable'//@ts-ignore
//@ts-ignore
import { CanvaItemI } from '../interfaces/CanvaItemI'

declare interface PageItemI {
  id: number
  items: CanvaItemI[]
  duration: number
}

export default {
  display: 'Transitions',
  order: 7,
  components: {
    CanvaItem,
    CanvaInputs,
    DraggableTimeline,
  },
  data() {
    return {
      drag: false,
      globalVoiceOver: "",
      globalBGMusic: "http://localhost:3002/common_components/music/GlobalBGMusic-ThinkAboutMe.mp3",
      pages: [] as PageItemI[],
      selectedPage: {} as PageItemI,


      isFileAdded: false,
      selectedItem: {} as CanvaItemI,

      outsideClick: '',
      operation: 'resize',
      itemSwitched: false,

      isPlaying: false,
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
        foundPage.items.forEach((e, i) => {
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
      let newPage = { id: this.pages[this.pages.length - 1].id + 1, items: [], duration: 5 };
      this.pages.push(newPage)
      this.selectedPage = newPage;
    },
    addCanvaItemToPage: function (item: CanvaItemI) {
      let that = this
      let foundPage = this.pages.find((e) => e.id == that.selectedPage.id)
      if (foundPage) {
        let id = foundPage.items.length > 0 ? foundPage.items[foundPage.items.length - 1].id + 1 : 0;
        let newItems = {} as CanvaItemI;
        newItems = { id: id, name: item.type, type: item.type, start: item.start, end: item.end, source: item.source, duration: item.duration, styles: item.styles, operation: '' }
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

    /*  */
    playPageContent(page: PageItemI) {
      page.items.forEach((item, index) => {
        item.operation = 'play'
      })
    },
    stopPageContent(page: PageItemI) {
      page.items.forEach((item, index) => {
        item.operation = ''
      })
    },
    play: function () {
      let that = this;

      if (!this.isPlaying) {
        this.isPlaying = true
        let duration = 0;
        this.pages.forEach(function (page, index) {

          /* calculate duration from items length as it is changed via timeline */

          console.log("duration: " + duration)
          //duration = index > 0 ? that.pages[index - 1].duration : page.duration;
          that.playAllTimeout[index] = setTimeout(function () {
            console.log("started: " + index)
            /*  */
            that.playPageContent(page)
            that.changeSelectedPage(page.id)
            /*  */
            that.isPlaying = false;
          }, duration * 1000);

          duration = page.items.length > 0 ?
            Number((Math.max(...(page.items.map((e: any) => e.end)))
              - Math.min(...(page.items.map((e: any) => e.start)))).toFixed(2))
            : 0;
        });
      }

      if (this.$refs.globalBGMusicPlayer) {//@ts-ignore
        this.$refs.globalBGMusicPlayer.volume = 0.01;//@ts-ignore
        this.$refs.globalBGMusicPlayer.play();
      }
    },
    stop: function () {
      let that = this;
      //console.log("stop")
      this.playAllTimeout.forEach(function (e, index) {
        clearTimeout(that.playAllTimeout[index]);
      })
      this.pages.forEach(function (page, index) {
        that.stopPageContent(page)
      });

      //@ts-ignore
      this.$refs.globalVoiceOverPlayer.pause();//@ts-ignore
      this.$refs.globalBGMusicPlayer.pause();

      this.isPlaying = false;
    },
    /*  */
    saveAll: function () {
      //console.log(this.pages)
      let videoData = JSON.stringify(this.pages)
      localStorage.pages = videoData

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
    deleteAll: function () {
      localStorage.pages = ''
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
              //console.log(JSON.parse(data)
              that.pages = JSON.parse(JSON.stringify(data).replace('operation":"play', 'operation":"'));
              that.selectedPage = that.pages[0]
              setTimeout(() => {
                that.play();
              }, 5000)
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
      let that = this;
      this.pages = myPages
      this.selectedPage = this.pages[0]

      setTimeout(() => {
        that.play();
      }, 5000)
    },
    /*  */
  },
  mounted: function () {
    let that = this
    //this.loadFromServer();
    this.$route.params.file ? this.loadFile() : this.loadFromServer();
    /* initiate pages */
    //console.log(localStorage.pages)
    // if (localStorage.pages)
    //   this.pages = JSON.parse(localStorage.pages)
    // else
    //   this.pages.push({ id: 0, items: [], duration: 5 })

    //this.selectedPage = this.pages[0]
    /* End */
    /* setTimeout(() => {
      this.play();
    }, 5000) */

  }
}
</script>
  
<style scoped>
.canva {
  background-color: rgb(54, 54, 54);
}
</style>
  