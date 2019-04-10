const { isEmpty, compact } = require('lodash'),
    axios = require('axios');

const url = process.argv[2],
    enableSubDomain = process.argv[3] === "true" ? true : false;

async function getWaybackURLs(domain = '', subDomain = true) {
    try {
        const wayBackResponse = await axios.get(`https://web.archive.org/cdx/search/cdx?url=${subDomain ? '*.' : ''}${domain}&collapse=urlkey&format=json`);
        let wayBackData = wayBackResponse['data'];
        if(isEmpty(wayBackData)) {
            return [];
        }
        wayBackData = compact(wayBackData.split("\n"));
        return wayBackData.map((data) => data.split(' ')[2]);
    } catch (err) {
        return [];
    }
}

async function getCommonCrawlURLs(domain = '', subDomain = true) {
    try {
        const commonCrawlResponse = await axios.get(`http://index.commoncrawl.org/CC-MAIN-2018-22-index?url=${subDomain ? '*.' : ''}${domain}&fl=url`);
        let commonCrawlData = commonCrawlResponse['data'];
        commonCrawlData = compact(commonCrawlData.split("\n"));
        return commonCrawlData;
    } catch (err) {
        return [];
    }

}

const crawlData = async (url) => {
    const wayBackData = await getWaybackURLs(url, enableSubDomain),
        commonCrawlData = await getCommonCrawlURLs(url, enableSubDomain);
    [...wayBackData, ...commonCrawlData].map(data => console.log(data));
}

crawlData(url);
