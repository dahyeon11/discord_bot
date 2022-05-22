var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const path = require('path')

async function ytDownload(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
    const YD = new YoutubeMp3Downloader({
        "ffmpegPath": path.join(__dirname, "../ffmpeg/bin/ffmpeg.exe"),       // FFmpeg binary location
        "outputPath": path.join(__dirname, "../music"),    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    })
    YD.download(url)
    YD.on("finished", function(err: any, data: any): any {
        //console.log(JSON.stringify(data));
        //console.log(data.file.split('music/')[1])
        const fileName:string = data.file.split('music/')[1]
        resolve(fileName)
    })
    YD.on("error", function(error: any) {
        console.log(error);
        reject(error)
    })
    YD.on("progress", function(progress: any) {
        console.log(JSON.stringify(progress));
    })
})
}

export default ytDownload
