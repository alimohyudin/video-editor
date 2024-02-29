import * as d3 from 'd3'

export default (config) => {
    let {
        timeScale,
        view,
        draw,
    } = config

    return d3.zoom()
        //.translateExtent([[ -1200, -700 ], [ 800, 800 ]])
        .on('zoom', (event, d) => {
            //console.log("event: ")
            //console.log(event.transform)
            let { k, x, y } = event.transform

            let scale = d3.zoomIdentity
                            .translate(x,y)
                            .scale(k)
                            .rescaleX(timeScale)

            view.call(draw(scale))
        })
}