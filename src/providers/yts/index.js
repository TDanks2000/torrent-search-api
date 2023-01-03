import axios from "axios";
import { utils } from "../../utils";

class YTS {
  name = "Yify";
  baseUrl = "https://yts.mx";
  proxyUrl = process.env.PROXY_URL;

  async search(query, page = 1) {
    const searchURL = `${this.baseUrl}/api/v2/list_movies.json?query_term=${query}&sort=seeds&order=desc&set=1`;

    const searchResult = {
      currentPage: page,
      results: [],
    };

    try {
      const { data } = await axios.get(`${this.proxyUrl}/${searchURL}`);

      data.data.movies.forEach((item) => {
        const movieResult = {
          title: item.title,
          year: item.year,

          id: item.id,
          time: new Date(parseInt(item.added) * 1000).toUTCString(),
          seeders: item.seeders,
          leechers: item.leechers,
          size: utils.humanizeSize(item.size),
          magnet: this.formatMagnet(item.info_hash, item.name),
          category: item.category,
          status: item.status,
          mappings: {
            imdb: item.imdb_code,
          },
        };
        searchResult.results.push(movieResult);
      });
    } catch (err) {
      throw new Error(err.message);
    }

    return searchResult;
  }

  async fetchMediaInfo(mediaId) {
    const mediaInfoURL = `${this.baseUrl}/api/v2/movie_details.json?imdb_id=${mediaId}&with_images=true&with_cast=true`;
    console.log(mediaInfoURL);

    const mediaInfo = {
      id: mediaId,
      title: "",
    };

    try {
      let { data } = await axios.get(`${this.proxyUrl}/${mediaInfoURL}`);
      data = data.data.movie;

      mediaInfo.id = data?.id;
      mediaInfo.title = data.title;
      mediaInfo.year = data.year;
      mediaInfo.genres = data.genres;
      mediaInfo.cast = !data?.cast
        ? undefined
        : data.cast.map((item) => {
            return {
              name: item.name,
              character: item.character_name,
              image: item.url_small_image,
              mappings: {
                imdb: item.imdb_code,
              },
            };
          });
      mediaInfo.description = data.description_full;
      mediaInfo.mappings = {
        imdb: data.imdb_code,
      };
      mediaInfo.trailer = {
        id: data.yt_trailer_code,
        url: `https://www.youtube.com/watch?v=${data.yt_trailer_code}`,
      };
      mediaInfo.torrents = !data?.torrents
        ? undefined
        : data.torrents.map((item) => {
            return {
              quality: item.quality,
              size: utils.humanizeSize(item.size_bytes),
              type: item.type,
              url: item.url,
              seeders: item.seeds,
              leechers: item.peers,
              magnet: this.formatMagnet(item.hash, data.title),
            };
          });
    } catch (err) {
      throw new Error(err.message);
    }

    return mediaInfo;
  }

  async latest(quality, page = 1) {
    const latestURL = `${this.baseUrl}/api/v2/list_movies.json?quality=${quality}&sort=year&order=desc`;

    const latestResult = {
      currentPage: page,
      results: [],
    };

    try {
      const { data } = await axios.get(`${this.proxyUrl}/${latestURL}`);

      data.data.movies.forEach((item) => {
        const movieResult = {
          title: item.title,
          year: item.year,

          id: item.id,
          time: new Date(parseInt(item.added) * 1000).toUTCString(),
          seeders: item.seeders,
          leechers: item.leechers,
          size: utils.humanizeSize(item.size),
          magnet: this.formatMagnet(item.info_hash, item.name),
          category: item.category,
          status: item.status,
          mappings: {
            imdb: item.imdb_code,
          },
          torrents: !item?.torrents
            ? undefined
            : item.torrents.map((torrent) => {
                return {
                  quality: torrent.quality,
                  size: utils.humanizeSize(torrent.size_bytes),
                  type: torrent.type,
                  url: torrent.url,
                  seeders: torrent.seeds,
                  leechers: torrent.peers,
                  magnet: this.formatMagnet(torrent.hash, item.title),
                };
              }),
        };
        latestResult.results.push(movieResult);
      });
    } catch (err) {
      throw new Error(err.message);
    }

    return latestResult;
  }

  formatMagnet(infoHash, name) {
    const trackers = [
      `udp://glotorrents.pw:6969/announce`,
      `udp://tracker.opentrackr.org:1337/announce`,
      `udp://torrent.gresille.org:80/announce`,
      `udp://tracker.openbittorrent.com:80`,
      `udp://tracker.coppersurfer.tk:6969`,
      `udp://tracker.leechers-paradise.org:6969`,
      `udp://p4p.arenabg.ch:1337`,
      `udp://tracker.internetwarriors.net:1337`,
    ];
    const trackersQueryString = `&tr=${trackers
      .map(encodeURIComponent)
      .join("&tr=")}`;
    return `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(
      name
    )}${trackersQueryString}`;
  }
}

export default YTS;
