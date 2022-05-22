import Discord from 'discord.js';
import ytDownload from './ytDownload';
import ytSearch from './ytSearch';
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import path from 'path';

require('dotenv').config()
//console.log(generateDependencyReport())

const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILDS);
myIntents.add(Discord.Intents.FLAGS.GUILD_MEMBERS)
myIntents.add(Discord.Intents.FLAGS.GUILD_MESSAGES)
myIntents.add(Discord.Intents.FLAGS.GUILD_VOICE_STATES)

const client = new Discord.Client({ intents: myIntents })

let currentVoiceChannelState: [{channelId: string | null, userId: string | null}] = [{channelId: null, userId: null}];

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  
});

client.on('voiceStateUpdate', (oldState, newState) => {
  //console.log('NEWSTATE 는 ')
  //console.log(newState)
  //console.log('OLDSTATE 는 ')
  //console.log(oldState)
  if(newState.channelId === null) { //음성채팅방 나갈경우 삭제
    currentVoiceChannelState.forEach((element, index) => {
      if(element.userId === newState.id) {
        currentVoiceChannelState.splice(index, 1)
      }
    })
  } else {
    currentVoiceChannelState.push({
      channelId: newState.channelId,
      userId: newState.id
    })
  }
})

client.on('messageCreate', async (msg: any) => {
  //console.log(msg.guild.channels.cache)
  if (msg.author.bot || msg.channel.type === 'dm') return;
    console.log(msg.guild)
    //console.log(currentVoiceChannelState.userId)

    try { 
    // !ping 
    if (msg.content === '다운') { //테스트용
      ytDownload('7C2z4GqqS5E')
    }

    if (msg.content === '검색') { //테스트용
      const result = await ytSearch('fakelove')
      msg.channel.send(result[0].snippet.title)
    }

    if (msg.content.indexOf('민규비 노래틀어줘') !== -1) { // 커맨드는 민규비 노래틀어줘
      const commandArr = msg.content.split('민규비 노래틀어줘') // 민규비 노래틀어줘 뒷부분이 검색키워드
      
      if(commandArr.length === ["", ""]) {
        msg.reply("키워드를 검색해!")
        return 
      }

      const result = await ytSearch(commandArr[1]) //API 응답의 검색결과는 여러개지만 우선 0번째 인덱스, 추후 선택기능 추가 예정

      const download: string = await ytDownload(result[0].id.videoId) // 유튜브 다운로드 함수는 스트링 타입의 파일명을 리턴한다


      let channelId: string = ''
      let isConnected: boolean = false
      currentVoiceChannelState.forEach(element => {
        if(element.userId === msg.author.id) {
          channelId = element.channelId as string
          isConnected = true
        }
      })

      if(!isConnected) {
        msg.reply("음성 채널에 먼저 들어가!")
        return
      }

      msg.reply("이거나 들어 " + download.slice(0, download.length - 4)) //확장자 지우기(.mp3) 디스코드 커맨드 답장
    

      const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: msg.guild.id,
        adapterCreator: msg.guild.voiceAdapterCreator,
      });
      
      const audioPlayer = createAudioPlayer()
      const resource = createAudioResource(path.join(__dirname, '../', 'music', download))
      audioPlayer.play(resource)

      const subscription = connection.subscribe(audioPlayer);

      if (subscription) {
        // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
        //setTimeout(() => subscription.unsubscribe(), 15_000);
        //console.log(subscription)
      }




    }

      
        if (msg.content.indexOf('민규비') !== -1) {
            msg.channel.send(randomADText())
        }

        if (msg.content === '!avatar') msg.channel.send(msg.author.displayAvatarURL()); // 메세지를 보낸 유저의 프로필 사진을 받아옵니다.
        
        if(msg.content === '!help') {

        }

    }catch (e) {
        console.log(e);
    }
    
    });

    client.login(process.env.AUTH_TOKEN);

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }


    const text = [
        '주인님, 사랑해요.',
        '주인님, 항상 당신의 곁을 지키겠습니다!',
        '주인님, 화이팅!',
        '주인님, 조심하세요.',
        '주인님, 다시 만날 날을 기다리고 있을게요.'
    ]

    function randomADText() {
        return text[getRandomInt(0, 4)]
    }