import * as d3 from 'd3'

import events from './events'
import axis from './axis'
import zoom from './zoom'
import cursor from './cursor'
import layout from './layout'

//import { toRoman } from 'roman-numerals'

export default (config) => {
    function init(selection) {
        console.log('timeline init')
        selection.selectAll('svg').remove()

        let {
            viewWidth = 900,
            viewHeight = 140,
            widthResizable = true,
            margin,
            onEventClick,
            onEventDragStart,
            onEventDrag,
            onEventDragEnd,
            onEventZoom,
            showCursor = true,
            noOfSubtimelines = 4
        } = config

        let data = selection.data()

        let events = data[0]
        layout.generate(events, noOfSubtimelines)
        //console.table(events)

        

        if (widthResizable) {
            console.log(selection.node().clientWidth)
            viewWidth = selection.node().clientWidth
        }

        let width = viewWidth - margin.right - margin.left
        let height = viewHeight - margin.top - margin.bottom

        //console.log(width)

        let svg = selection
            .append('svg')
            .datum(data)
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)

        let timeScale = d3.scaleLinear()
            .domain([
                d3.min(events.map(e => e.start)),
                d3.max(events.map(e => e.end))
            ])
            .range([0, width])

        let graph = svg
            .append('g')
            .classed('graph', true)
            .attr('transform', `translate(${margin.left},${margin.top})`)

        let view = graph.append('g')
            .classed('view', true)

        // svg.call(zoom({
        //     timeScale,
        //     view,
        //     draw,
        // }))

        view.call(draw(timeScale, onEventClick, onEventDragStart, onEventDrag, onEventDragEnd, onEventZoom, height, showCursor))
    }

    function chart(selection) {
        //console.log('timeline constructor')
        chart._init = () => init(selection)
        chart._init()

        if (config.widthResizable) {
            //window.addEventListener('resize', (e)=>{console.log(e)}, true)
        }
    }

    function draw(timeScale, onEventClick, onEventDragStart, onEventDrag, onEventDragEnd, onEventZoom, height, showCursor) {
        return selection => {
            selection
                .data(selection.data())
                .call(events({
                    d3,
                    timeScale,
                    onEventClick,
                    onEventDragStart,
                    onEventDrag,
                    onEventDragEnd,
                    onEventZoom
                }))
                .call(axis({
                    timeScale,
                    height
                }))
                .call(cursor({
                    showCursor,
                    timeScale,
                    height,
                }))
        }
    }

    return chart

}