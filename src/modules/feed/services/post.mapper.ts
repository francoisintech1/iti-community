import { MessageAudioElement, MessageElement, MessageImageElement, MessageTextElement, MessageVideoElement, MessageYoutubeElement, Post, PostData, PostMessage } from '../post.model';

export class PostMapper {
  map(data: PostData): Post {
    let date = new Date(data.createdAt);
    return {
      ...data,
      message: this.parseMessage(`${data.message} ${data.attachementUrl ? data.attachementUrl : ''}`.trim()),
    }
  }
  private parseMessage(message: string): PostMessage {
    
    // TODO rajouter png jpg et gif
    const pictureRegex = /http[s]?:\/\/\S+?\.(jpeg|jpg|png|gif)/gmi;

     // TODO mp4,wmv,flv,avi|wav,wav
    const videoRegex = /http[s]?:\/\/\S+?\.(?:mp4|wmv|flv|avi|wav)/gmi;

     // TODO mp3,ogg,wav
    const audioRegex = /http[s]?:\/\/\S+?\.(?:mp3|ogg|wav)/gmi;

    const youtubeRegex = /(http[s]?:\/\/)?www\.(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/gmi;
    const attachements: MessageElement[] = [];

    let youtubeList = message.match(youtubeRegex);
    let audioList = message.match(audioRegex);
    let videoList = message.match(videoRegex);
    let pictureList = message.match(pictureRegex);

    youtubeList?.forEach(element => {
      let id = element.split('=')[1];
      attachements.push({
        type: 'youtube',
        videoId: id
      } as MessageYoutubeElement);
    });

    audioList?.forEach(element => {
      attachements.push({
        type: 'audio',
        url: element
      } as MessageAudioElement);
    });

    videoList?.forEach(element => {
      attachements.push({
        type: 'video',
        url: element
      } as MessageVideoElement);
    });

    pictureList?.forEach(element => {
      attachements.push({
        type: 'image',
        url: element
      } as MessageImageElement);
    });

    return {
      text: {
        type: 'text',
        content: message
      } as MessageTextElement,
      attachements
    };
  }
}
