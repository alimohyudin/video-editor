//@ts-ignore
import { PageItemI } from './PageItemI'//@ts-ignore
import { CanvaItemI } from './CanvaItemI'
export interface CanvaItemI {
    id: number
    name: string
    type: string
    category: string
    source: any
    start: number
    end: number
    duration: number
    seek?: number
    playbackspeed?: number
    volume?: number
    styles: { id: number, pageId: number, parent: string, childchild: string, zIndex: number }
    operation: string
    animations?: [object]
    transition: {name: string, direction: string}
    page?: PageItemI

    isOld: boolean
}