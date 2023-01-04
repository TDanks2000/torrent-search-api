import axios from "axios";
import { utils, parser } from "../../utils";

class Rarbg {
  name = "Rarbg";
  baseUrl = "https://torrentapi.org";
  proxyUrl = process.env.PROXY_URL;

  lastLoginTime = undefined;
  token = undefined;

  async search(
    query,
    page = 1,
    perPage = 100,
    category = this.category.Movies
  ) {
    await this.ensureLogin();
    await this.sleep(2200);

    if (typeof this.token === "undefined") throw new Error("Token not found");

    // const searchURL = `${this.baseUrl}/pubapi_v2.php?app_id=NodeTorrentSearchApi&search_string=${query}&category=${cat}&mode=search&format=json_extended&sort=seeders&limit=${perPage}&token=${this.token}`;

    const searchQuery = query.split(" ").join("+");

    const searchURL = `${
      this.baseUrl
    }/pubapi_v2.php?mode=search&search_string=${encodeURIComponent(
      searchQuery
    )}&app_id=torrenter${
      category ? "&category=" + category : ""
    }&sort=seeders&limit=${perPage}&format=json_extended&token=${this.token}`;

    const searchResult = {
      currentPage: page,
      results: [],
    };

    try {
      const { data } = await axios.get(searchURL);

      data.torrent_results.forEach((item) => {
        const titleParser = parser.parse(item.title);
        console.log(item);

        const movieResult = {
          provider: this.name,
          title: titleParser?.title || data.name,
          year: titleParser?.year || undefined,
          group: titleParser?.group || undefined,
          quality: titleParser?.quality || undefined,
          resolution: titleParser?.resolution || undefined,
          id: item.id,
          date: new Date(item.pubdate).toUTCString(),
          seeders: item.seeders,
          leechers: item.leechers,
          size: utils.humanizeSize(item.size),
          description: item.info_page,
          category: item.category,
          status: item.status,
          torrents: {
            magnet: item.download,
            hash: item.download.split(":")[3].split("&")[0],
          },
          mappings: {
            imdb: item?.episode_info?.imdb || undefined,
            tvdb: item?.episode_info?.tvdb || undefined,
            tmdb: item?.episode_info?.themoviedb || undefined,
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
    throw new Error("Not implemented");
  }

  async searchFromIMDB(imdbId, page = 1, perPage = 100) {
    await this.ensureLogin();
    await this.sleep(2200);

    if (typeof this.token === "undefined") throw new Error("Token not found");

    const searchURL = `${this.baseUrl}/pubapi_v2.php?mode=search&search_imdb=${imdbId}&app_id=torrenter&sort=seeders&limit=${perPage}&format=json_extended&token=${this.token}`;

    const searchResult = {
      currentPage: page,
      results: [],
    };

    try {
      const { data } = await axios.get(searchURL);

      data?.torrent_results.forEach((item) => {
        const titleParser = parser.parse(item.title);

        const movieResult = {
          provider: this.name,
          title: titleParser?.title || data.name,
          year: titleParser?.year || undefined,
          group: titleParser?.group || undefined,
          quality: titleParser?.quality || undefined,
          resolution: titleParser?.resolution || undefined,
          id: item.id,
          date: new Date(item.pubdate).toUTCString(),
          seeders: item.seeders,
          leechers: item.leechers,
          size: utils.humanizeSize(item.size),
          description: item.info_page,
          category: item.category,
          status: item.status,
          torrents: {
            magnet: item.download,
            hash: item.download.split(":")[3].split("&")[0],
          },
          mappings: {
            imdb: item?.episode_info?.imdb || undefined,
            tvdb: item?.episode_info?.tvdb || undefined,
            tmdb: item?.episode_info?.themoviedb || undefined,
          },
        };
        searchResult.results.push(movieResult);
      });
    } catch (err) {
      throw new Error(err.message);
    }

    return searchResult;
  }

  async ensureLogin() {
    if (!this.lastLoginTime || Date.now() - this.lastLoginTime > 840000) {
      const loginURL = `${this.baseUrl}/pubapi_v2.php?get_token=get_token&app_id=NodeTorrentSearchApi`;
      try {
        const { data } = await axios.get(loginURL);
        //wait 2 seconds to avoid doing more than 1 req per 2 secs
        await this.sleep(2200);

        this.lastLoginTime = Date.now();
        this.token = data.token;
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }

  async sleep(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  category = {
    All: "1;4;14;15;16;17;21;22;42;18;19;41;27;28;29;30;31;32;40;23;24;25;26;33;34;43;44;45;46;47;48;49;50;51;52",
    Movies: "14;17;42;44;45;46;47;48;50;51;52",
    XXX: "1;4",
    Games: "1;27;28;29;30;31;32;40",
    TV: "1;18;41;49",
    Music: "1;23;24;25;26",
    Apps: "1;33;34;43",
    Books: "35",
  };
}

export default Rarbg;
