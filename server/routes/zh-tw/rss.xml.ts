import {buildRss} from '../../utils/rss'

export default defineEventHandler(event => buildRss(event, 'zh-tw'))
