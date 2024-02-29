<template>
  <div class="canva__box" ref="myBox" :id="'item_' + pageId + '_' + id" @click="itemClicked">
    <div class="box_child" ref="myBoxChild">
      <template v-if="type == 'title'">
        <div class="box_output_div" ref="myBoxChildChild">
          <h1>{{ source }}</h1>
        </div>
      </template>
      <template v-if="type == 'animatedText' || type == 'text'">
        <div class="box_output_div" ref="myBoxChildChild">
          <div ref="animatedTextPlay" style="text-align: left; position: relative;">
            <span :class="source.textStyle"
              :style="'font-size:' + source.fontSize + 'px; color: ' + source.fontColor + ';-webkit-text-stroke: ' + (source.stroke ? source.stroke : 4) + 'px ' + source.strokeColor + '; text-shadow:'+ (source.textStyle == 'text3d' ? ' -1px -1px 1px #efede3, 0px 1px 0 #2e2e2e, 0px 2px 0 #2c2c2c,  0px 3px 0 #2a2a2a, 0px 4px 0 #282828, 0px 5px 0 #262626, 0px 6px 0 #242424,  0px 7px 0 #222, 0px 8px 0 #202020, 0px 9px 0 #1e1e1e, 0px 10px 0 #1c1c1c,  0px 11px 0 #1a1a1a, 0px 12px 0 #181818, 0px 13px 0 #161616, 0px 14px 0 #141414,  0px 15px 0 #121212, 2px 20px 5px rgba(0, 0, 0, 0.9),  5px 23px 5px rgba(0, 0, 0, 0.3), 8px 27px 8px rgba(0, 0, 0, 0.5),  8px 28px 35px '+source.shadowColor+';':';') ">{{
                item.name }}</span>
            <span v-if="source.textStyle == 'text3d'" :class="source.textStyle + ' text3d-sub'"
              :style="'font-size:' + source.fontSize + 'px; background: -webkit-linear-gradient(' + source.fontColor + ', ' + source.fontColor2 + ');  -webkit-text-fill-color: transparent;  -webkit-background-clip: text;  background-clip: text; -webkit-text-stroke: 0px black;'">{{
                source.text }}</span>
          </div>
        </div>
      </template>
      <template v-if="type == 'video'">
        <div class="box_output_div" ref="myBoxChildChild">
          <video ref="myVideo" :loop="item.category == 'video-overlays' ? true : false">
            <source :src="source" type="" />
          </video>
        </div>
      </template>
      <template v-if="type == 'image'">
        <div class="box_output_div" ref="myBoxChildChild">
          <img draggable="false" style="object-fit: fill" :src="source" />
        </div>
      </template>
      <template v-if="type == 'audio'">
        <div class="box_output_div" ref="myBoxChildChild">
          <audio ref="myAudio">
            <source :src="source" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>
      </template>
      <template v-if="type == 'page'">
        <div class="box_output_div" ref="myBoxChildChild">
          <div class="O7ADyQ" :style="'width: 1920px; height: 1080px; transform: scale(' + calculateScale(h, w) + ');'">

            <div class="pTC3Qw canva__container" lang="en" style="width: 1920px; height: 1080px">
              <template v-if="item.page && item.page.items && item.page.items.length > 0">
                <template v-for="(myItem, index) in item.page.items" v-bind:key="index">
                  <canva-item :item="myItem" :id="myItem.id" :pageId='item.page.id' :type="myItem.type"
                    :source="myItem.source" :outsideClick="outsideClick" :operation="myItem.operation"
                    :styles="myItem.styles" :zIndex="myItem.styles.zIndex" :disable="true"></canva-item>
                </template>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template v-if="type == 'html'">
        <div class="box_output_div" ref="myBoxChildChild">
          <div v-html="source"></div>
        </div>
      </template>

    </div>
  </div>
  <template v-if="isDragResizeEnabled">

    <VueDragCrop :isActive="true" :w="w" :h="h" :x="x" :y="y" v-on:resizing="resize" v-on:dragging="onDrag"
      :parentW="1920" :parentH="1080" :parentScaleX="0.42" :parentScaleY="0.42" style="z-index: 2147483647;">
      <div style="position: absolute; top: -50px;">
        <button :class="'btn btn-' + (operation == 'resize' ? 'success' : 'secondary')" style="font-size: x-large"
          @click="isResize = true; isCrop = false">R</button>&nbsp;
        <button :class="'btn btn-' + (operation == 'crop' ? 'success' : 'secondary')" style="font-size: x-large"
          @click="isResize = false; isCrop = true">C</button>&nbsp;
        <router-link :to="'/dev/' + item.name" target="_blank">
          <button v-if="type == 'page'" :class="'btn btn-success'" style="font-size: x-large">Edit
            Page: {{ item.name }}</button>&nbsp;
        </router-link>
      </div>
    </VueDragCrop>
  </template>
</template>

<script lang="ts">
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/all'//@ts-ignore
import VueDragCrop from './vue-drag/vue-drag-crop/src/'//@ts-ignore
import { CanvaItemI } from '../interfaces/CanvaItemI'//@ts-ignore
import { PageItemI } from '../interfaces/PageItemI'

interface Props {
  value?: string | number | boolean
}

export default {
  name: 'canva-item',
  props: ['id', 'pageId', 'type', 'source', 'outsideClick', 'operation', 'currentPlayingTime', 'styles', "zIndex", 'itemSwitched', 'item', 'disable'],
  emits: ['updatedStyles', 'itemSelected'],
  components: {
    //VueDragResize,
    VueDragCrop,
  },
  data() {
    return {
      showControls: true,

      selectedItem: null,
      isDragResizeEnabled: false,
      isResize: true,
      isCrop: false,
      isPlay: false,
      x: 0,
      y: 0,
      h: 0,
      w: 0,

      resizedHeight: 0,
      resizedWidth: 0,
      dragX: 0,
      dragY: 0,
      useOldTransformForCrop: false,
      wasClickedBefore: false,

      /* animation properties*/
      allTimeouts: [0],
      runningAnimationHandle: Object(),
      inputAnimatedText: Object(),
      myColor: 'yellow'
    }
  },
  setup(props) {
    let that = this
    //console.log("props")
    //console.log(props['item'])
    // if(props && props['item'].type == 'animatedText'){
    //   //console.log("found animated Text")//@ts-ignore
    //   props['item'].source = JSON.parse(props['item'].source)
    // }
  },
  watch: {
    outsideClick(newValue, oldValue) {
      if (newValue != this.id + ":" + this.pageId) {
        this.selectedItem = null
        this.isDragResizeEnabled = false
      }
    },
    /* crop/resize/ Play video / Play animations */
    operation(newValue, oldValue) {
      let that = this;
      this.isResize = newValue == 'resize'
      this.isCrop = newValue == 'crop'
      this.isPlay = newValue == 'play'
      //console.log("operation: " + newValue)
      if (newValue == 'play') {//@ts-ignore
        this.$refs.myBox.style.setProperty('display', 'none');
        switch (this.type) {
          case 'animatedText':
            this.startSetTimeout(() => {//@ts-ignore
              this.$refs.myBox.style.setProperty('display', '');
              this.item.defaultSoundEffect != false ? this.playAnimmationSound('keyboard1') : null;//@ts-ignore
              gsap.fromTo(Object(this.$refs.animatedTextPlay), { transform: "scale(0)" }, { duration: 0.3, ease: this.item.source.animation, transform: "scale(1)" })
              //console.log("animatedTextFound")

              if (this.item.animations && this.item.animations.length > 0) {
                this.playAnimations(this.item.animations)
              }

              this.endSetTimeout(() => {
                //gsap.fromTo(Object(this.$refs.animatedTextPlay), { transform: "scale(1)" }, { duration: 0.3, ease: this.item.source.animation, transform: "scale(0)" })
                //@ts-ignore
                this.$refs.myBox.style.setProperty('display', 'none');
              }, (this.item.end - this.item.start) * 1000)
            }, this.item.start * 1000)
            break;
          case 'video'://@ts-ignore
            this.startSetTimeout(() => {//@ts-ignore
              this.$refs.myBox.style.setProperty('display', '');
              if (this.item.category == 'video-overlays') {//@ts-ignore
                this.$refs.myBox.style.setProperty('display', '');
              }
              else if (this.item.transition && this.item.transition.name == 'random') {
                let rand = Math.floor(Math.random() * 2 + 1);
                console.log("random: ", rand)
                // if (rand == 1)
                //   gsap.fromTo(Object(this.$refs.myBox), { display: "none", transform: "scale(0)" }, { duration: 0.3, ease: 'power2.out', display: "" })
                // else {
                //@ts-ignore
                let orgWidth = this.$refs.myBox.style
                console.log("orgWidth", orgWidth)
                gsap.fromTo(Object(this.$refs.myBox), { x: 1920 }, { duration: 0.3, ease: 'power2.out', x: 0 })
                //}


                this.playAnimmationSound('swoosh', 0.1)

              } else {//@ts-ignore
                this.$refs.myBox.style.setProperty('display', '');
              }

              if (this.item.playbackspeed > 0)//@ts-ignore
                this.$refs.myVideo.playbackRate = this.item.playbackspeed//@ts-ignore
              if (this.item.volume >= 0)//@ts-ignore
                this.$refs.myVideo.volume = this.item.volume ? this.item.volume / 100 : 1;//@ts-ignore

              this.$refs.myVideo.play();

              if (this.item.animations && this.item.animations.length > 0) {
                this.playAnimations(this.item.animations)
              }


              this.endSetTimeout(() => {//@ts-ignore
                this.$refs.myVideo.pause();//@ts-ignore
                //if (this.item.transition.name == 'random') {
                //gsap.fromTo(Object(this.$refs.myBox), { display: "", transform: "scale(1)" }, { duration: 0.3, ease: 'power2.out', display: "none", transform: "scale(2)" })
                //} else {//@ts-ignore
                this.$refs.myBox.style.setProperty('display', 'none');
                //}

              }, (this.item.end - this.item.start) * 1000)

            }, this.item.start * 1000)
            break;
          case 'audio':
            this.startSetTimeout(() => {//@ts-ignore
              this.$refs.myAudio.volume = this.item.volume ? this.item.volume / 100 : 1;//@ts-ignore
              this.$refs.myAudio.play();
              this.endSetTimeout(() => {//@ts-ignore
                this.$refs.myAudio.pause();
              }, (this.item.end - this.item.start) * 1000)
            }, this.item.start * 1000)
            break;
          case 'image'://@ts-ignore
            console.log(this.item)
            this.startSetTimeout(() => {//@ts-ignore
              this.$refs.myBox.style.setProperty('display', '');
              this.isaacInStayOutAnimation(this.item.transition.name, this.item.transition.direction, this.item.animations)

            }, this.item.start * 1000)

            break;
          case 'page'://@ts-ignore
            this.startSetTimeout(() => {//@ts-ignore
              this.$refs.myBox.style.setProperty('display', '');
              //gsap.to(Object(this.$refs.myBox), { duration: this.item.end - this.item.start, ease: 'power2.out', x: 800 })
              if (this.item.animations && this.item.animations.length > 0) {
                this.playAnimations(this.item.animations)
              }

              that.playPageContent(this.item.page);

              this.endSetTimeout(() => {
                that.stopPageContent(this.item.page);//@ts-ignore
                that.$refs.myBox.style.setProperty('display', 'none');
              }, (this.item.end - this.item.start) * 1000)
            }, this.item.start * 1000)
            break;
          case 'text':
            this.startSetTimeout(() => {//@ts-ignore
              this.$refs.myBox.style.setProperty('display', '');

              if (this.item.animations && this.item.animations.length > 0) {
                this.playAnimations(this.item.animations)
              }

              this.endSetTimeout(() => {
                //@ts-ignore
                this.$refs.myBox.style.setProperty('display', 'none');
              }, (this.item.end - this.item.start) * 1000)
            }, this.item.start * 1000)
            break;
          default:
            break;
        }
      } else if (newValue == '') {
        switch (this.type) {
          case 'video'://@ts-ignore
            if (this.$refs.myVideo) {//@ts-ignore
              this.$refs.myVideo.pause()//@ts-ignore
              this.$refs.myVideo.currentTime = 0;//@ts-ignore
            }
            //this.$refs.myBox.style.setProperty('transform', 'scale(1) translate(0px, 0px)');
            gsap.to(Object(this.$refs.myBox), { duration: 0, ease: 'none', transform: '', })
            this.clearAllTimeouts();
            break;
          case 'audio'://@ts-ignore
            this.$refs.myAudio.pause()//@ts-ignore
            this.$refs.myAudio.currentTime = 0;
            break;
          case 'image':
            gsap.to(Object(this.$refs.myBox), { x: 0 })
            if (Object.keys(this.runningAnimationHandle).length > 0)
              this.runningAnimationHandle?.kill();

            break;
          case 'page':
            this.stopPageContent(this.item.page);
            break;
          default:
            break;
        }
      } else if (newValue == 'hide') {//@ts-ignore
        this.$refs.myBox.style.setProperty('display', 'none');
      } else if (newValue == 'show') {//@ts-ignore
        this.$refs.myBox.style.setProperty('display', '');
      }
    },
    selectedItem(item) {
      if (item != null) {

        //console.log("item selected")
        //console.log(this.pageId+"; "+this.id)
        this.$emit("itemSelected", { id: this.id, pageId: this.pageId })
      }
    },
    zIndex(value, oldValue) {
      // console.log('zIndex changed')
      // console.log(value)
      // console.log(oldValue)
      if (this.selectedItem != null && value >= 0) {//@ts-ignore
        this.selectedItem.style.setProperty('z-index', value)
      }
    },
    currentPlayingTime(newValue, oldValue) {
      console.log("insideItem-TimeChanged", newValue)
      if (this.item.type == 'video') {
        let mySeek = (newValue * 1 - this.item.start * 1).toFixed(2)//@ts-ignore
        this.$refs.myVideo.currentTime = mySeek
        this.item.seek = mySeek

        if (this.item.animations && this.item.animations.length > 0) {
          let lastAnim = {}
          for (let index = 0; index < this.item.animations.length; index++) {
            const anim = this.item.animations[index];
            if (anim.start < mySeek) {
              //apply css
              console.log("applying css to item", anim)
              lastAnim.transform = anim.transform;
            }
          }
          lastAnim.start = 0;
          lastAnim.end = 0;
          this.playAnimations([lastAnim])
        }
      }
      else if (this.item.type == 'audio') {//@ts-ignore
        this.$refs.myAudio.currentTime = newValue * 1 - this.item.start * 1
      }
    }
  },
  methods: {
    resize(newRect: any) {
      //@ts-ignore
      if (this.selectedItem != null && this.selectedItem.style) {
        if (this.isResize) {
          //@ts-ignore
          //this.selectedItem.style.setProperty('overflow', "");//@ts-ignore
          this.selectedItem.style.height = newRect.height + 'px' //@ts-ignore
          this.selectedItem.style.width = newRect.width + 'px' //@ts-ignore


          let myHeight = newRect.height
          if (this.resizedHeight != 0) myHeight = myHeight - this.resizedHeight
          else myHeight = 0

          let myWidth = newRect.width
          if (this.resizedWidth != 0) myWidth = myWidth - this.resizedWidth
          else myWidth = 0


          //@ts-ignore
          let box_output_div = this.selectedItem.children[0].children[0]
          let style = box_output_div.style
          myHeight = style.height.replace('px', '') * 1 + myHeight
          myWidth = style.width.replace('px', '') * 1 + myWidth

          this.h = myHeight;
          this.w = myWidth;

          //@ts-ignore
          this.selectedItem.children[0].children[0].style.setProperty('height', myHeight + 'px') //@ts-ignore
          this.selectedItem.children[0].children[0].style.setProperty('width', myWidth + 'px') //@ts-ignore
          //this.selectedItem.children[0].children[0].style.height = newRect.height + "px";//@ts-ignore
          //this.selectedItem.children[0].children[0].style.width = newRect.width + "px";//@ts-ignore

          //@ts-ignore
          this.selectedItem.style.setProperty('top', newRect.top + 'px') //@ts-ignore
          this.selectedItem.style.setProperty('left', newRect.left + 'px')

          this.resizedHeight = newRect.height
          this.resizedWidth = newRect.width
        }

        //crop
        if (this.isCrop) {
          //@ts-ignore
          //this.selectedItem.style.setProperty('overflow', "");//@ts-ignore
          this.selectedItem.style.setProperty('top', newRect.top + 'px') //@ts-ignore
          this.selectedItem.style.setProperty('left', newRect.left + 'px') //@ts-ignore
          this.selectedItem.style.height = newRect.height + 'px' //@ts-ignore
          this.selectedItem.style.width = newRect.width + 'px' //@ts-ignore

          let myLeft = newRect.left
          if (this.dragX != 0) myLeft = -1 * (myLeft - this.dragX)
          else myLeft = 0

          let myTop = newRect.top
          if (this.dragY != 0) myTop = -1 * (myTop - this.dragY)
          else myTop = 0


          this.dragX = newRect.left
          this.dragY = newRect.top

          //if (true) {
          //@ts-ignore
          let box_output_div = this.selectedItem.children[0].children[0]
          let style = box_output_div.style

          if (style.transform != '') {
            let matrix = new WebKitCSSMatrix(style.transform)
            if (matrix) {
              myLeft = matrix.e * 1 + myLeft * 1
              myTop = matrix.f * 1 + myTop * 1
              //this.useOldTransformForCrop = false;
            }
          }
          //}

          //@ts-ignore
          this.selectedItem.children[0].children[0].style.setProperty(
            'transform',
            'translate(' + myLeft + 'px, ' + myTop + 'px)'
          ) //@ts-ignore

        }

        this.sendUpdatedStylesBack();
      }
    },
    onDrag(newRect: any) {
      //console.log(newRect)
      //@ts-ignore
      this.selectedItem.style.height = newRect.height + 'px' //@ts-ignore
      this.selectedItem.style.width = newRect.width + 'px' //@ts-ignore
      this.selectedItem.style.setProperty('position', 'absolute') //@ts-ignore
      this.selectedItem.style.setProperty('top', newRect.top + 'px') //@ts-ignore
      this.selectedItem.style.setProperty('left', newRect.left + 'px')

      //for cropping, save xy to make child margin start from zero
      this.dragX = 0
      this.dragY = 0

      this.resizedHeight = 0
      this.resizedWidth = 0

      this.sendUpdatedStylesBack();
    },
    itemClicked(e: any) {
      if (this.disable) return;
      console.log("CanvaItem.vue", "itemClicked")
      let thisItem = this.$refs.myBox;// e.target.parentElement.parentElement.parentElement

      if (!this.item.isOld) {
        console.log("!wasClickedBefore")
        //@ts-ignore
        thisItem.children[0].children[0].style.setProperty('height', thisItem.offsetHeight + 'px') //@ts-ignore
        thisItem.children[0].children[0].style.setProperty('width', thisItem.offsetWidth + 'px') //@ts-ignore
        this.wasClickedBefore = true
      }

      //@ts-ignore
      if (this.selectedItem != null && this.selectedItem != thisItem) {
        console.log("selectedItem != null")
        //console.log("width: " + e.target.parentElement.offsetWidth)
        //@ts-ignore
        this.selectedItem = thisItem
        //@ts-ignore
        this.isDragResizeEnabled = false
      } else {
        //@ts-ignore
        this.selectedItem = thisItem
        //console.log(this.selectedItem)
        this.isDragResizeEnabled = true //@ts-ignore

        let myTop = thisItem.style.getPropertyValue('top')
        myTop = myTop ? myTop.replace('px', '') * 1 : 0//@ts-ignore
        let myLeft = thisItem.style.getPropertyValue('left')
        myLeft = myLeft ? myLeft.replace('px', '') * 1 : 0//@ts-ignore

        this.h = thisItem.offsetHeight //@ts-ignore
        this.w = thisItem.offsetWidth //@ts-ignore
        this.x = thisItem.offsetX ? thisItem.offsetX : myLeft //@ts-ignore
        this.y = thisItem.offsetY ? thisItem.offsetY : myTop
        // console.log(this.h)
        // console.log(this.w)
        // console.log(this.x)
        // console.log(this.y)
        //this.resize({height: 0, width:0, top: 0, left: 0})
      }

      this.sendUpdatedStylesBack();
    },
    /*  */
    sendUpdatedStylesBack(keepEmpty = false) {
      /* Send back updated styles */
      if (keepEmpty) {
        let parent = ''//@ts-ignore
        let childchild = ''//@ts-ignore
        this.$emit("updatedStyles", { id: this.id, pageId: this.pageId, styles: { parent: parent, childchild: childchild } });
      }
      if (this.selectedItem) {
        //@ts-ignore
        let zIndex = this.selectedItem.style.zIndex;//@ts-ignore
        let parent = this.selectedItem.style.cssText//@ts-ignore
        let childchild = this.selectedItem.children[0].children[0].style.cssText//@ts-ignore
        //console.log('save childchild: ')
        //console.log(childchild)
        this.$emit("updatedStyles", { id: this.id, pageId: this.pageId, zIndex: zIndex, styles: { parent: parent, childchild: childchild, dragX: this.dragX, dragY: this.dragY, resizedHeight: this.resizedHeight, resizedWidth: this.resizedWidth } });
      }
    },
    calculateScale(height: number, width: number) {

      // Get the dimensions of the parent and child divs
      const parentWidth = width;
      const parentHeight = height;
      const childWidth = 1920;
      const childHeight = 1080;

      // Calculate the scale values
      const scaleX = parentWidth / childWidth;
      const scaleY = parentHeight / childHeight;

      // Set the scale on the child div
      //child.style.transform = `scale(${Math.min(scaleX, scaleY)})`;
      return Math.min(scaleX, scaleY)
    },
    /*  */
    isaacInStayOutAnimation(name: string, direction: string, animations?: object, duration?: number, viewOffsetHeight?: number) {
      //console.log("isaacInStayOutAnimation: ", name)
      let that = this;
      let myX = 0;
      let myY = 0;

      //console.log("helperAnimation")//@ts-ignore
      //console.log(this.$refs.myBox.parentElement.parentElement.offsetHeight)
      if (direction && direction != '') {
        if (direction == 'leftBottom') {//@ts-ignore
          myX = -1 * (this.$refs.myBox.style.left.replace('px', '') * 1 + this.$refs.myBox.style.width.replace('px', '') * 1);//@ts-ignore
          myY = (viewOffsetHeight ? viewOffsetHeight : 1080) - this.$refs.myBox.style.top.replace('px', '') * 1;
        } else if (direction == 'rightBottom') {//@ts-ignore
          myX = 1920 - this.$refs.myBox.style.left.replace('px', '') * 1;//@ts-ignore
          myY = (viewOffsetHeight ? viewOffsetHeight : 1080) - this.$refs.myBox.style.top.replace('px', '') * 1;
        }

        direction == 'none' ? this.playAnimmationSound("drop") : this.playAnimmationSound("swoosh")

      }
      /* moves box out of view on leftBottom/rightBottom */
      gsap.to(Object(this.$refs.myBox), { duration: 0, ease: 'none', x: myX, y: myY })



      /* In: brings back to 0,0 (original position) */
      gsap.to(Object(this.$refs.myBox), {
        duration: 0.3, ease: 'power2.out', x: 0, y: 0, onComplete: () => {
          /* Stay: start moving */
          if (name == 'isaac') {
            gsap.registerPlugin(MotionPathPlugin)
            that.runningAnimationHandle = gsap.to(Object(that.$refs.myBox), {
              motionPath: {
                path: [{ x: 0, y: 0 }, { x: -2.1963443756103516, y: -1.20151519775390 }, { x: -4.576183319091797, y: -1.9860477447509766 }, { x: -7.033046722412109, y: -2.4873390197753906 }, { x: -9.508649826049805, y: -2.8901710510253906 }, { x: -11.902198791503906, y: -3.602445602416992 }, { x: -12.776601791381836, y: -5.736196517944336 }, { x: -11.759370803833008, y: -8.017805099487305 }, { x: -10.352743148803711, y: -10.093305587768555 }, { x: -8.80990219116211, y: -12.070581436157227 }, { x: -9.836677551269531, y: -13.111902236938477 }, { x: -12.204391479492188, y: -13.932403564453125 }, { x: -14.382814407348633, y: -15.16556167602539 }, { x: -16.152339935302734, y: -16.927608489990234 }, { x: -17.128875732421875, y: -19.216066360473633 }, { x: -17.005239486694336, y: -21.70030403137207 }, { x: -15.91244888305664, y: -23.943283081054688 }, { x: -14.184225082397461, y: -25.750642776489258 }, { x: -12.075296401977539, y: -27.09968662261963 }, { x: -9.745136260986328, y: -28.01902484893799 }, { x: -7.295820236206055, y: -28.54819965362549 }, { x: -4.795909881591797, y: -28.728349685668945 }, { x: -2.292400360107422, y: -28.59957504272461 }, { x: -1.43762969970703, y: -30.207984924316406 }, { x: -1.0708351135253906, y: -32.68677806854248 }, { x: -0.2480049133300781, y: -35.05030345916748 }, { x: 1.2039756774902344, y: -37.08027648925781 }, { x: 3.3090362548828125, y: -38.41137886047363 }, { x: 5.763553619384766, y: -38.86731433868408 }, { x: 8.255687713623047, y: -38.63429260253906 }, { x: 10.666797637939453, y: -37.95160675048828 }, { x: 12.975334167480469, y: -36.97382926940918 }, { x: 15.186664581298828, y: -35.79148578643799 }, { x: 17.228851318359375, y: -34.57054138183594 }, { x: 17.24842071533203, y: -37.033358573913574 }, { x: 18.880794525146484, y: -38.878037452697754 }, { x: 21.20629119873047, y: -39.78888988494873 }, { x: 23.689350128173828, y: -40.117218017578125 }, { x: 26.194862365722656, y: -40.054701805114746 }, { x: 28.673343658447266, y: -39.67938709259033 }, { x: 31.0909423828125, y: -39.016785621643066 }, { x: 33.408485412597656, y: -38.06221961975098 }, { x: 35.56684112548828, y: -36.78951644897461 }, { x: 37.4688835144043, y: -35.160704612731934 }, { x: 38.9622688293457, y: -33.15365409851074 }, { x: 39.863250732421875, y: -30.8221492767334 }, { x: 40.06923294067383, y: -28.33047866821289 }, { x: 40.12669372558594, y: -26.115134239196777 }, { x: 42.485687255859375, y: -25.262924194335938 }, { x: 44.838226318359375, y: -24.39309310913086 }, { x: 47.18090057373047, y: -23.497037887573242 }, { x: 49.50644302368164, y: -22.55756950378418 }, { x: 51.79475784301758, y: -21.5313720703125 }, { x: 53.930145263671875, y: -20.230024337768555 }, { x: 53.09867477416992, y: -18.485658645629883 }, { x: 50.814903259277344, y: -17.449556350708008 }, { x: 48.780452728271484, y: -16.004619598388672 }, { x: 47.786338806152344, y: -13.756731033325195 }, { x: 48.246482849121094, y: -11.312324523925781 }, { x: 49.43012237548828, y: -9.105709075927734 }, { x: 51.6756477355957, y: -8.031486511230469 }, { x: 53.95368576049805, y: -6.981943130493164 }, { x: 56.213253021240234, y: -5.893238067626953 }, { x: 58.44663619995117, y: -4.751884460449219 }, { x: 60.63928985595703, y: -3.5343589782714844 }, { x: 62.75888442993164, y: -2.194416046142578 }, { x: 64.7036247253418, y: -0.6158809661865234 }, { x: 65.75675582885742, y: 1.5624332427978516 }, { x: 64.07391357421875, y: 3.305665969848633 }, { x: 61.76384353637695, y: 4.277698516845703 }, { x: 59.400821685791016, y: 5.118593215942383 }, { x: 57.093109130859375, y: 6.0970916748046875 }, { x: 55.14851760864258, y: 7.640058517456055 }, { x: 55.07486343383789, y: 10.02751350402832 }, { x: 56.568477630615234, y: 12.028060913085938 }, { x: 58.44935989379883, y: 13.684913635253906 }, { x: 60.47500991821289, y: 15.163261413574219 }, { x: 62.57637405395508, y: 16.532358169555664 }, { x: 62.730342864990234, y: 17.742937088012695 }, { x: 60.47805404663086, y: 18.846651077270508 }, { x: 58.23592758178711, y: 19.970930099487305 }, { x: 56.00874710083008, y: 21.124454498291016 }, { x: 53.8040771484375, y: 22.32040786743164 }, { x: 51.63892364501953, y: 23.586170196533203 }, { x: 49.562931060791016, y: 24.99183654785156 }, { x: 48.00487518310547, y: 26.88347625732422 }, { x: 49.93315887451172, y: 28.189739227294922 }, { x: 52.401283264160156, y: 28.631847381591797 }, { x: 54.88310623168945, y: 28.994544982910156 }, { x: 57.353485107421875, y: 29.426937103271484 }, { x: 59.78491973876953, y: 30.03863525390625 }, { x: 62.10710906982422, y: 30.977062225341797 }, { x: 64.10389709472656, y: 32.47378921508789 }, { x: 65.25662612915039, y: 34.66987609863281 }, { x: 65.27766036987305, y: 37.16154098510742 }, { x: 64.55595016479492, y: 39.558448791503906 }, { x: 63.4094352722168, y: 41.7842903137207 }, { x: 61.81365966796875, y: 43.714622497558594 }, { x: 59.91844940185547, y: 45.354103088378906 }, { x: 57.82502746582031, y: 46.73310470581055 }, { x: 55.600650787353516, y: 47.890228271484375 }, { x: 53.28816604614258, y: 48.86009216308594 }, { x: 50.91499328613281, y: 49.6706657409668 }, { x: 48.499053955078125, y: 50.34361267089844 }, { x: 46.05268478393555, y: 50.896053314208984 }, { x: 43.58433151245117, y: 51.340415954589844 }, { x: 41.10033416748047, y: 51.686851501464844 }, { x: 38.605350494384766, y: 51.942832946777344 }, { x: 36.103065490722656, y: 52.11369323730469 }, { x: 33.59659194946289, y: 52.20378112792969 }, { x: 31.08852767944336, y: 52.21600341796875 }, { x: 28.58123016357422, y: 52.151573181152344 }, { x: 26.077045440673828, y: 52.01161193847656 }, { x: 23.57827377319336, y: 51.79514694213867 }, { x: 21.08749008178711, y: 51.50114822387695 }, { x: 18.60747528076172, y: 51.126869201660156 }, { x: 16.14166259765625, y: 50.66828155517578 }, { x: 13.694194793701172, y: 50.1203727722168 }, { x: 11.270336151123047, y: 49.47615051269531 }, { x: 8.876998901367188, y: 48.72642517089844 }, { x: 6.523750305175781, y: 47.859432220458984 }, { x: 4.223659515380859, y: 46.860042572021484 }, { x: 1.9957923889160156, y: 45.7089958190918 }, { x: -0.1317787170410156, y: 44.382259368896484 }, { x: -2.116819381713867, y: 42.851131439208984 }, { x: -3.8567962646484375, y: 41.05815124511719 }, { x: -5.063449859619141, y: 38.85929489135742 }, { x: -6.233196258544922, y: 36.64060592651367 }, { x: -7.3494415283203125, y: 34.39457702636719 }, { x: -8.380056381225586, y: 32.108150482177734 }, { x: -9.24799919128418, y: 29.756011962890625 }, { x: -9.668878555297852, y: 27.294662475585938 }, { x: -8.273002624511719, y: 25.44100570678711 }, { x: -5.7949676513671875, y: 25.08098602294922 }, { x: -3.3677902221679688, y: 24.49533462524414 }, { x: -1.5499763488769531, y: 22.826637268066406 }, { x: -0.7793540954589844, y: 20.454912185668945 }, { x: -0.9056854248046875, y: 18.24994468688965 }, { x: -2.7639312744140625, y: 16.57170867919922 }, { x: -4.7802886962890625, y: 15.080108642578125 }, { x: -6.796611785888672, y: 13.588468551635742 }, { x: -8.708101272583008, y: 11.966548919677734 }, { x: -10.195741653442383, y: 9.969194412231445 }, { x: -9.64559555053711, y: 7.697175979614258 }, { x: -7.472156524658203, y: 6.475421905517578 }, { x: -5.320713043212891, y: 5.320713043212891 }, { x: -3.547147750854492, y: 3.547147750854492 }, { x: -1.7735652923583984, y: 1.7735652923583984 }, { x: 0, y: 0 }
                ],
              },
              duration: 20, // Animation duration
              ease: "linear", // Easing function
              repeat: -1
            })
          } else if (animations) {
            that.playAnimations(animations)
          }

          /* Out: */
          setTimeout(() => {
            if (direction != 'none' && direction != '') {
              if (Object.keys(that.runningAnimationHandle).length > 0)
                that.runningAnimationHandle?.kill();
              direction == 'none' ? this.playAnimmationSound("drop") : this.playAnimmationSound("swoosh")
              gsap.to(Object(that.$refs.myBox), { duration: 0.3, ease: 'power2.out', x: myX, y: myY })
            } else {
              //@ts-ignore
              this.$refs.myBox.style.setProperty('display', 'none');
            }
          }, (that.item.end - that.item.start) * 1000);
        }
      })

    },
    playAnimmationSound(soundName: string, volume?: number) {
      let audioPlayer;
      if (soundName == 'swoosh') {
        let rand = Math.floor(Math.random() * 5 + 1);
        //console.log("random number for swoosh: ",rand)
        audioPlayer = document.getElementById('audio_common_swoosh' + rand)//@ts-ignore
        audioPlayer.volume = volume ? volume : 0.2;
      } else {
        audioPlayer = document.getElementById('audio_common_' + soundName)
        if (audioPlayer)//@ts-ignore
          audioPlayer.volume = volume ? volume : 0.1;
      }
      //@ts-ignore
      audioPlayer?.play();
    },
    playAnimations(animations: any) {
      //console.log("playAnimations: ", animations)
      if (animations) {
        //console.log("inside-playAnimations: ", animations)
        let that = this;
        animations.forEach((e: any) => {
          setTimeout(() => {
            if (e.ease == 'isaac') {
              that.isaacInStayOutAnimation(e.ease, '')//transition have 'name' but animations have 'ease'
            } else {
              let myAnimation = { duration: Number(Number(e.end - e.start).toFixed(2)), ease: e.ease ? e.ease : 'none', transform: e.transform ? e.transform : '', filter: '' }
              if (e.ease == 'blur') {
                console.log("AnimationStyles: ", e)
                myAnimation.ease = 'none'
                myAnimation.transform = ''
                myAnimation.filter = 'blur(8px)'
              }
              //@ts-ignore
              gsap.to(Object(this.$refs.myBox), myAnimation)
            }
            //zoom center: scale(1.5)
            //zoom certain area: scale(1.5) translate(200px, 200px) (moves to top left corner)
            //3d effect: skew(5deg, 5deg)
          }, e.start * 1000);
        });
      }
    },
    /* play & stop everything inside an item type=page */
    playPageContent(page: PageItemI) {
      page.items.forEach((item: CanvaItemI, index: Number) => {
        item.operation = 'play'
      })
    },
    stopPageContent(page: PageItemI) {
      page.items.forEach((item: CanvaItemI, index: Number) => {
        item.operation = ''
      })
    },

    /* start/end setTimeout: takes impact if currentTime is manually changed */
    startSetTimeout(callback: Function, timeout: number) {
      console.log(this.currentPlayingTime)
      if (this.currentPlayingTime - 1 > 0) {
        //current video not playing from where it 
        if (this.type == 'video' && (this.item.start <= this.currentPlayingTime && this.currentPlayingTime <= this.item.end)) {//@ts-ignore
          console.log("skipping to new currentTime", this.currentPlayingTime - timeout / 1000)//@ts-ignore
          this.$refs.myVideo.currentTime = this.currentPlayingTime - timeout / 1000
        } else if (this.type == 'audio')//@ts-ignore
          this.$refs.myAudio.currentTime = this.currentPlayingTime - timeout / 1000
        this.allTimeouts.push(setTimeout(callback, timeout - this.currentPlayingTime * 1000))
      } else {
        this.allTimeouts.push(setTimeout(callback, timeout))
      }
    },
    endSetTimeout(callback: Function, timeout: number) {
      this.allTimeouts.push(setTimeout(callback, timeout));
    },
    clearAllTimeouts() {
      for (let index = 0; index < this.allTimeouts.length; index++) {
        const element = this.allTimeouts[index];
        clearTimeout(element)
      }
    }
  },
  created() {
    //console.log('created')
    //console.log(this.source)
  },
  mounted() {
    let that = this
    let box = this.$refs.myBox
    //console.log(this.styles)
    if (this.id == this.styles.id && this.pageId == this.styles.pageId) {//@ts-ignore
      box.style = this.styles.styles ? this.styles.styles.parent : '';//@ts-ignore
      box.style.setProperty('z-index', this.styles.zIndex)//@ts-ignore
      box.children[0].children[0].style = this.styles.styles ? this.styles.styles.childchild : '';//@ts-ignore
      this.h = this.$refs.myBoxChildChild.style.height.replace('px', '');//@ts-ignore
      this.w = this.$refs.myBoxChildChild.style.width.replace('px', '');
      this.resizedHeight = this.styles.styles ? this.styles.styles.resizedHeight : 0;
      this.resizedWidth = this.styles.styles ? this.styles.styles.resizedWidth : 0;
    } else {//@ts-ignore
      box.style.setProperty('z-index', this.zIndex)//@ts-ignore
      this.sendUpdatedStylesBack(true)//keep empty
    }

    if (this.item.category == 'video-overlays') {
      console.log("video overlays found")
      /* https://unpkg.com/seethru@4/dist/seeThru.min.js */
    }
  },
  beforeUnmount() {
    console.log("beforeUnmount")
    this.clearAllTimeouts();
  }
}
</script>

<style>
img {
  width: 100%;
  height: 100%;
}

video {
  width: 100%;
  height: 100%;
}

.canva__box {
  overflow: hidden;
}

.box_child {
  width: 100%;
  height: 100%;
}

/* Aniamted Text Styles */
.style1 {
  font-family: 'Red Ring Bold';
  color: white;
  -webkit-text-stroke: 4px black;
  letter-spacing: -3px;
  text-shadow: 2px 2px white;
}

.style2 {
  font-family: 'Red Ring Bold';
  color: white;
  -webkit-text-stroke: 4px black;
  letter-spacing: -3px;
  text-shadow: 2px 2px white;
}


.text3d {
  font-family: 'fortnite' !important;
  margin-left: 20px;
  text-shadow:
    -1px -1px 1px #efede3,
    0px 1px 0 #2e2e2e,
    0px 2px 0 #2c2c2c,
    0px 3px 0 #2a2a2a,
    0px 4px 0 #282828,
    0px 5px 0 #262626,
    0px 6px 0 #242424,
    0px 7px 0 #222,
    0px 8px 0 #202020,
    0px 9px 0 #1e1e1e,
    0px 10px 0 #1c1c1c,
    0px 11px 0 #1a1a1a,
    0px 12px 0 #181818,
    0px 13px 0 #161616,
    0px 14px 0 #141414,
    0px 15px 0 #121212,
    2px 20px 5px rgba(0, 0, 0, 0.9),
    5px 23px 5px rgba(0, 0, 0, 0.3),
    8px 27px 8px rgba(0, 0, 0, 0.5),
    8px 28px 35px yellow;
}

.text3d-sub {
  position: absolute;
  left: 0px;
  text-shadow: none;
}
</style>