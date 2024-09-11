import compress from 'koa-compress';
const options = {
    filter: (contentType: string) => /text|application\/json/i.test(contentType),
    threshold: 1024,
    flush: require('zlib').Z_SYNC_FLUSH
}
export default compress(options)