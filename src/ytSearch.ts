import Axios, { AxiosRequestConfig } from 'axios';
require('dotenv').config()

interface YTSearchResultTypes {
    kind: string,
    etag: string,
    id:  {
        kind: string,
        videoId: string,
    },
    snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description: string,
        thumbnails: {
            default: {
                url: string,
                width: number,
                height: number
            },
            medium: {
                url: string,
                width: number,
                height: number
            },
            high: {
                url: string,
                width: number,
                height: number
            }
        },
        channelTitle: string,
        liveBroadcastContent: string,
        publishTime: string
    }
}


async function ytSearch(keyword: string): Promise<YTSearchResultTypes[]> {
    const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        params: {
            key: process.env.GOOGLE_YOUTUBE_API_KEY,
            part: 'snippet',
            q: keyword
        }
        
    }
    
    const res = await Axios(config)

    return res.data.items
}

export default ytSearch;