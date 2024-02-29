<template>
    <div id='timeline'></div>
</template>

<script>
import * as d3 from 'd3'

import timeline from '../graph/timeline'

export default {
    props: {
        data: {
            type: Array
        },
        config: {
            type: Object,
            default: () => { }
        }
    },
    emits: ['eventUpdated'],
    mounted() {
        // console.log("vuetimeline_mounted")
        // console.log(this.data )
        if (this.data == null || (this.data && this.data.length <=0)) {
            //console.log("no data found")
            return;
        } else {
            //console.log()
            d3.select('#timeline')
                .datum(this.data)
                .call(timeline({
                    widthResizable: true,
                    viewHeight: this.config?.height,//150 width is good for 4 subtimelines
                    noOfSubtimelines: this.config?.noOfSubtimelines,
                    margin: {
                        top: 0,
                        bottom: 30,
                        left: 15,
                        right: 15
                    },
                    onEventClick: this.config?.onEventClick,
                    onEventDrag: this.config?.onEventDrag,
                    onEventDragEnd: this.config?.onEventDragEnd,
                    onEventZoom: this.config?.onEventZoom
                }))
        }
    }
}
</script>