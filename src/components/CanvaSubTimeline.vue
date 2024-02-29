<template>
    <div id="canva__subtimeline" ref="canva__subtimeline">
        <!-- <vue-timeline :data="items"
            :config="{ onEventClick, onEventDragStart, onEventDrag, onEventZoom, height: calcHeight, noOfSubtimelines: items ? (items.length) : 4, currentPlayingTime: currentPlayingTime?currentPlayingTime:0 , onTimelineItemClicked: config?.onTimelineItemClicked }"
            :key="myKey + 'a' + (items ? items.length : 0)"></vue-timeline> -->

        <div class="timeline" ref="timeline" style="cursor: col-resize">
            <div class="timeline__drag" ref="drag"></div>
            <!-- <span class="timeline__progress" ref="progress"></span> -->
            <template v-for="item, index in items" v-bind:key="index">
                <div class="timeline__item" :ref="'item' + index" :id="'item' + index"
                    :class="'type_' + item.type + ' item' + index" :title="item.name" @click="onTimelineItemClicked(item)">
                    <!-- <div style="position: absolute; left: 0px; border-left: 5px solid orange; height: 20px; cursor: pointer;"></div>
                    <div style="position: absolute; right: 0px; border-left: 5px solid orange; height: 20px; cursor: pointer;"></div> -->
                    <span class="timeline__item_text" :ref="'itemText' + index">{{ item.name }}</span>
                </div>
            </template>
            <div class="timeline__time" ref="time">
            </div>

        </div>


        <!-- <div style="position: relative;">
            <button class="btn btn-sm btn-danger timeline__remove" style="display: none;">X</button>
            <button class="btn btn-sm btn-danger timeline__seekLeft">&#8592;</button>
            <button class="btn btn-sm btn-danger timeline__seekRight">&#8594;</button>
            <input type="number" class="form-control timeline__currentTime">
        </div> -->

    </div>
</template>
  
<script lang="ts">//@ts-ignore
import type { MarkerItemI } from '@/interfaces/MarkerItemI'
import gsap from 'gsap'
import { Draggable } from 'gsap/all'


export default {
    name: "CanvaSubTimeline",
    props: ['items', 'currentPlayingTime', 'config', 'timelineMarkers'],
    emits: ['deleteMarker'],
    components: {
        //VueDragResize,
        //VueTimeline
    },
    data() {
        return {
            selectedItemId: null,
            myKey: 0,
            height: 140,//this should go inside vue-timeline//140 width is good for 4 subtimelines
            noOfSubtimelines: 4,
            perTimeX: 0,
        }
    },
    setup(props) {
        let that = this
        //console.log("props")
        //console.log(props)
    },
    computed: {
        calcHeight() {
            return this.items && this.items.length > 3 ? (140 / 4 * this.items.length) : 140
        }
    },
    watch: {
        items(newValue, oldValue) {
            console.log("items changed")
            if (this.items.length > 2) {
                this.noOfSubtimelines = this.items.length;
                this.height = 140 / 4 * this.items.length;

                console.log("===changing height of timeline===")
            }
            this.myKey++;
        }
    },
    methods: {
        onTimelineItemClicked(item: any) {
            //console.log('subTimeline: item clicked')
            if (this.config && this.config.onTimelineItemClicked) {
                this.config.onTimelineItemClicked(item)
            }
        },
        itemUpdated(myTime?: any) {
            console.log('subTimeline: item updated')
            if (this.config && this.config.onItemUpdate) {
                this.config.onItemUpdate(myTime)
            }
        },
        addMarker(text: string, myTime: number) {
            let that = this;
            let spanE = document.createElement('span')
            spanE.setAttribute('title', text+": "+myTime)
            spanE.setAttribute('style', 'display:inline-block; border-left: solid skyblue 4px; \
                    height: 38px; max-height:38px; max-width: 60px;\
                    overflow: hidden; white-space: nowrap;\
                      position: absolute; font-size: 1em; \
                      color: #4e92af; top:-30px; left:' + myTime * this.perTimeX + 'px')
            spanE.innerText = text;
            spanE.addEventListener("contextmenu", function(e:any){
                console.log("marker clicked",e)
                that.$emit('deleteMarker', myTime)
            })
            //@ts-ignore
            this.$refs.time.append(spanE)
        },

        stackEvents(events: any) {
            // Sort events by start time
            //@ts-ignore
            events.sort((a, b) => a.start - b.start);

            // Define a function to check if two events overlap vertically
            //@ts-ignore
            function doEventsOverlap(stackEvent, event, vPosition) {
                /* if (event.id == 4) {
                    console.log("overlap: ", event.name, stackEvent.name, event.start, stackEvent.end, stackEvent.verticalPosition, vPosition)
                    console.log(event.start < stackEvent.end && stackEvent.verticalPosition == vPosition)
                } */
                return event.start < stackEvent.end && stackEvent.verticalPosition == vPosition;
            }
            const stackedEvents = [];

            for (const event of events) {
                let verticalPosition = 0;
                let sortedStackedEvents = [...stackedEvents];
                sortedStackedEvents.sort((a, b) => a.verticalPosition - b.verticalPosition)

                for (const stackEvent of sortedStackedEvents) {
                    if (doEventsOverlap(stackEvent, event, verticalPosition)) {
                        verticalPosition++;
                    }
                }

                event.verticalPosition = verticalPosition;
                stackedEvents.push(event);
            }

            return stackedEvents;
        }



    },
    created() {
        //console.log('created')
        //console.log(this.source)
    },
    mounted() {
        let that = this
        //console.log('mounted')
        let totalTime = Math.max(...this.items.map((o: any) => { return o.end }));
        if (totalTime > 100) {//@ts-ignore
            that.$refs.timeline.style.width = totalTime * 1.5 + '%';
        }//@ts-ignore
        let perTimeX = that.$refs.timeline.offsetWidth / totalTime
        this.perTimeX = perTimeX;
        /* Custom Timeline */
        gsap.registerPlugin(Draggable)//@ts-ignore
        let dragHead = Draggable.create(that.$refs.drag, {
            type: 'x',
            zIndexBoost: true,
            trigger: that.$refs.timeline,
            bounds: that.$refs.timeline,
            onPress: function (e: any) {
                console.log('press')
                gsap.set(this.target, {//@ts-ignore
                    x: this.pointerX - that.$refs.timeline.getBoundingClientRect().left
                });//@ts-ignore
                let myTime = ((this.pointerX - that.$refs.timeline.getBoundingClientRect().left) / perTimeX).toFixed(2);
                //console.log(myTime)
                that.itemUpdated(myTime)
                this.update();//@ts-ignore
            },
            onDrag: function () {
                console.log('onTimelineDrag', this.pointerX)
                //@ts-ignore
                let myTime = ((this.pointerX - that.$refs.timeline.getBoundingClientRect().left) / perTimeX).toFixed(2);
                //console.log(myTime)
                that.itemUpdated(myTime)
            },
            onRelease: function (e: any) {
                //console.log('onRelease')
                e.preventDefault();
            }
        });

        if (this.items && this.items.length > 0) {
            //console.log(this.items)
            const stackedEvents = this.stackEvents(this.items)

            /* else {//@ts-ignore
                that.$refs.timeline.style.width = '110%';
            } *///@ts-ignore

            let maxZIndex = 1000;

            stackedEvents.forEach((item: any, index: number) => {
                if (item.type !== 'timelineMarker') {


                    let duration = 0;
                    let heightMultiplyer = item.verticalPosition; //index%5;
                    //@ts-ignore
                    gsap.set(that.$refs['item' + index], {
                        x: perTimeX * item.start,
                        y: 20 + 25 * heightMultiplyer,
                        width: ((item.end * 1 - item.start) * perTimeX).toFixed(5),
                        zIndex: item.styles.zIndex * 1 + index
                    });//@ts-ignore
                    gsap.set(that.$refs['itemText' + index], {
                        x: perTimeX * item.start,
                        y: 20 + 25 * heightMultiplyer,
                        zIndex: item.styles.zIndex * 1 + index
                    });//@ts-ignore
                    Draggable.create(that.$refs['item' + index], {
                        type: 'x',// trigger: that.$refs.timeline,
                        bounds: that.$refs.timeline,

                        onPress: function (e) {
                            dragHead[0].disable();
                            console.log("onItemPressed")//@ts-ignore
                            let myTime = ((this.pointerX - that.$refs.timeline.getBoundingClientRect().left) / perTimeX).toFixed(2);
                            console.log(myTime)
                        },
                        onDrag: function (e) {
                            dragHead[0].disable();
                            console.log("onItemDrag")//@ts-ignore//console.log(this.endX, this)//@ts-ignore
                            var myTime = ((this.endX) / perTimeX).toFixed(2);//console.log(myTime)
                            let myId = this.target.classList[this.target.classList.length - 1].replace('item', '')//@ts-ignore
                            let start = Number(myTime);
                            let end = Number((Number(myTime) + that.items[myId].duration).toFixed(2))
                            that.items[myId].start = start;
                            that.items[myId].end = end;

                        },
                        onRelease: function () {
                            dragHead[0].enable();
                        }
                    });

                    if (item.styles.zIndex * 1 > maxZIndex)
                        maxZIndex = item.styles.zIndex * 1

                    /* Ctrl+Scroll = increase duration *///@ts-ignore
                    document.getElementById('item' + index).addEventListener('wheel', function (e) {
                        if (e.ctrlKey) {
                            e.preventDefault();
                            console.log('wheel moved', e)//@ts-ignore
                            let myId = e.target.classList[e.target.classList.length - 1].replace('item', '')//@ts-ignore
                            console.log(myId)
                            console.log(e.target)
                            if (myId == "timeline___text") {//@ts-ignore
                                myId = e.target.parentElement.classList[e.target.parentElement.classList.length - 1].replace('item', '')//@ts-ignore

                            }
                            console.log(myId)
                            if (e.deltaY < 0) {
                                //increase
                                that.items[myId].duration = Number(that.items[myId].duration + 0.5);
                                that.items[myId].end = Number(that.items[myId].end + 0.5);
                                console.log('increase')
                            } else {
                                //decrease
                                that.items[myId].duration = Number(that.items[myId].duration - 0.5);
                                that.items[myId].end = Number(that.items[myId].end - 0.5);
                                console.log('decrease')

                            }
                            console.log(that.items[myId])
                            that.itemUpdated();
                        }
                    })
                    console.log()
                }
                // end: forEach
            });

            let minItems = this.items.length > 4 ? this.items.length : 4;

            //@ts-ignore
            gsap.set(that.$refs.timeline, {
                height: minItems * (20 + 10),
            })

            //@ts-ignore
            gsap.set(that.$refs.drag, {
                zIndex: maxZIndex + 1,
            })

            //@ts-ignore
            gsap.set(that.$refs.time, {
                y: 0,
            })

            /* construct time */
            for (let index = 0; index < totalTime + 1; index++) {

                if (index % 5 == 0 || totalTime < 30) {
                    let spanE = document.createElement('span')
                    spanE.setAttribute('style', 'position: absolute; color: white; left:' + index * perTimeX + 'px')
                    spanE.innerText = index + '';//@ts-ignore
                    that.$refs.time.append(spanE)
                } else {
                    let spanE = document.createElement('span')
                    spanE.setAttribute('style', 'position: absolute; font-size: 0.6em; color: white; left:' + index * perTimeX + 'px')
                    spanE.innerText = '|';//@ts-ignore
                    that.$refs.time.append(spanE)
                }
            }

            //this.addMarker(13.2)

            //construct marking above time
            /* let spanE = document.createElement('div')
            spanE.setAttribute('style', 'position: absolute; font-size: 12px; color: orange; left:' + 2 * perTimeX + 'px; background-color: rgba(255, 255, 255, 0.5); width:' + 5 * perTimeX + 'px')
            spanE.innerText = '|';
            spanE.title = 'some information that is lengthy';//@ts-ignore
            that.$refs.time.append(spanE) */
        }

        if(this.timelineMarkers && this.timelineMarkers.length > 0){
            this.timelineMarkers.forEach((e:MarkerItemI) => {
                that.addMarker(e.text, e.start)
            });
        }
    }
}
</script>
  
<style>
.timeline__item_text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
}
</style>