import BaseService from "../../service/BaseService";
import Video from "./VideoModel";


class VideoService extends BaseService<Video> {
  constructor() {
    super(Video);
  }
}

export default new VideoService();