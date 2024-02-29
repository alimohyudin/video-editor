export default config => selection => {
    let {
        d3,
        timeScale,
        onEventClick,
        onEventDragStart,
        onEventDrag,
        onEventDragEnd,
        onEventZoom
    } = config

    let events = selection.selectAll('g.event').data(selection.data()[0][0])




    let g = events
        .enter()
        .append('g')
        .classed('event', true)
        .attr('transform', d => `translate(${timeScale(d.start)} ${d.position * 22})`)
        .on('click', (e, d) => {
            console.log(e)
            console.log(d)
        })

    g.call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

    g.call(d3.zoom()
        .on("zoom", (e, d) => {
            // console.log("zoom called")
            // console.log(e)
            // console.log(d)
            if (e.sourceEvent.ctrlKey) {

                if (e.sourceEvent.deltaY < 0) {
                    //console.log("Expand the element")
                    let x = d.end + 0.1;
                    d3.select(this).attr('width', d => timeScale(x) - timeScale(d.start));
                    d.end += 0.1;
                    onEventZoom({ id: d.id, start: d.start, end: d.end })
                } else if (e.sourceEvent.deltaY > 0) {
                    //console.log("Shrink the event")
                    let x = d.end - 0.1;
                    d3.select(this).attr('width', d => timeScale(x) - timeScale(d.start));
                    d.end -= 0.1;
                    onEventZoom({ id: d.id, start: d.start, end: d.end })
                }
            }
        }));

    function dragStarted(event, d) {
        // console.log('drag started')
    }

    function dragging(event, d) {
        //console.log('dragging')
        if (event.dx > 0) {

            let x = timeScale(d.start + 0.025)
            d3.select(this).attr('transform', d => `translate(${x}, ${d.position * 22})`)
            onEventDrag({ id: d.id, start: d.start, end: d.end })
            d.start = d.start + 0.025
            d.end = d.end + 0.025
        } else if (event.dx < 0) {

            if ((d.start - 0.025).toFixed(3) >= 0) {

                let x = timeScale(d.start - 0.025)
                d.start = d.start - 0.025
                d.end = d.end - 0.025
                d3.select(this).attr('transform', d => `translate(${x}, ${d.position * 22})`)
                onEventDrag({ id: d.id, start: d.start, end: d.end })
            }
        }
        //console.log(d)
    }

    function dragEnded(event, d) {
        //console.log("dragEnded")
    }



    g.append('rect')
        .attr('width', d => d.end ? timeScale(d.end) - timeScale(d.start) : 10)
        .attr('height', 20)
        .attr('fill', 'rgba(85, 187, 238, 0.2)')
        .attr('ry', 6)

    g.append('text')
        .attr('dy', '1em')
        .style('pointer-events', 'none')
        .text(d => d.type+": "+d.name)

    events
        .attr('transform', d => `translate(${timeScale(d.start)} ${d.position * 22})`)
        .selectAll('rect')
        .attr('width', d => d.end ? timeScale(d.end) - timeScale(d.start) : 10)

    // events
    //     .exit()
    //     .on('click', null)
    //     .remove()


}