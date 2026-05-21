const { convert } = require('html-to-text');

class ChunkingServices {
    /** 
@param { string } htmlContent
@param { number } maxWords
@param { number } overlapWords
@returns { Array < string >}
  */

    //max words of chunk to limit chunk sizes for performance and overlap is grabbing the context around
    static chunkTipTapContent(htmlContent, maxWords = 200, overlapWords = 20) {

        //ignore images and links
        const plainText = convert(htmlContent, {
            wordwrap: false,
            selectors: [
                { selector: 'a', options: { ignoreHref: true } },
                { selector: 'img', format: 'skip' }
            ]
        });

        //regex to get clean words without spaces
        const words = plainText.replace(/\s+/g, ' ').trim().split(' ');
        const chunks = [];

        //skip the work if there are no words
        if (words.length === 0 || words[0] === "") return chunks;

        let i = 0
        while (i < words.length) {
            const chunk = words.slice(i, i + maxWords).join(' ');
            chunks.push(chunk);
            i += (maxWords - overlapWords);

        }

        return chunks;
    }
}

module.exports = ChunkingServices;