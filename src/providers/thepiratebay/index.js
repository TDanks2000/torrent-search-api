import axios from "axios";
import { utils, parser } from "../../utils";

class thePirateBay {
  name = "ThePirateBay";
  baseUrl = "https://apibay.org";
  proxyUrl = process.env.PROXY_URL;

  async search(query, page = 1) {
    const searchURL = `${this.baseUrl}/q.php?q=${query}&cat=&page=${page}`;

    const searchResult = {
      currentPage: page,
      results: [],
    };

    try {
      const { data } = await axios.get(`${this.proxyUrl}/${searchURL}`);

      data.forEach((item) => {
        const titleParser = parser.parse(item.name);
        const movieResult = {
          provider: this.name,
          title: titleParser?.title || data.name,
          year: titleParser?.year || undefined,
          group: titleParser?.group || undefined,
          quality: titleParser?.quality || undefined,
          resolution: titleParser?.resolution || undefined,
          id: item.id,
          time: new Date(parseInt(item.added) * 1000).toUTCString(),
          seeders: item.seeders,
          leechers: item.leechers,
          size: utils.humanizeSize(item.size),
          category: item.category,
          status: item.status,
          torrents: {
            magnet: this.formatMagnet(item.info_hash, item.name),
            hash: item.info_hash,
          },
          mappings: {
            imdb: item.imdb,
          },
        };
        searchResult.results.push(movieResult);
      });
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }

    return searchResult;
  }

  async fetchMediaInfo(mediaId) {
    const mediaInfoURL = `${this.baseUrl}/t.php?id=${mediaId}`;

    const mediaInfo = {
      id: mediaId,
      title: "",
    };

    try {
      const { data } = await axios.get(`${this.proxyUrl}/${mediaInfoURL}`);

      const titleParser = parser.parse(data.name);

      mediaInfo.provider = this.name;
      mediaInfo.id = data.id;
      mediaInfo.title = titleParser?.title || data.name;
      mediaInfo.year = titleParser?.year || undefined;
      mediaInfo.group = titleParser?.group || undefined;
      mediaInfo.quality = titleParser?.quality || undefined;
      mediaInfo.resolution = titleParser?.resolution || undefined;

      mediaInfo.audio = titleParser?.audio || undefined;
      mediaInfo.seeders = data.seeders;
      mediaInfo.leechers = data.leechers;
      mediaInfo.time = new Date(parseInt(data.added) * 1000).toUTCString();
      mediaInfo.category = data.category;
      mediaInfo.status = data.status;
      mediaInfo.torrents = {
        magnet: this.formatMagnet(data.info_hash, data.name),
        hash: data.info_hash,
      };
      mediaInfo.mappings = {
        imdb: data.imdb,
      };
      mediaInfo.size = utils.humanizeSize(data.size);
      mediaInfo.description = data.descr;
    } catch (err) {
      throw new Error(err.message);
    }
    return mediaInfo;
  }

  formatMagnet(infoHash, name) {
    const trackers = [
      "udp://tracker.coppersurfer.tk:6969/announce",
      "udp://9.rarbg.to:2920/announce",
      "udp://tracker.opentrackr.org:1337",
      "udp://tracker.internetwarriors.net:1337/announce",
      "udp://tracker.leechers-paradise.org:6969/announce",
      "udp://tracker.pirateparty.gr:6969/announce",
      "udp://tracker.cyberia.is:6969/announce",
    ];
    const trackersQueryString = `&tr=${trackers
      .map(encodeURIComponent)
      .join("&tr=")}`;
    return `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(
      name
    )}${trackersQueryString}`;
  }
}

export default thePirateBay;
