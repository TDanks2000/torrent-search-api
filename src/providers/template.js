import axios from "axios";

class $Name {
  name = "";
  baseUrl = "";
  proxyUrl = process.env.PROXY_URL;

  async search(query, page = 1) {}

  async fetchMediaInfo(mediaId) {}

  formatMagnet(infoHash, name) {}
}

export default $Name;
