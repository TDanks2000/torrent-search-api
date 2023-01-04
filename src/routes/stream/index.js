import fs from "fs";
import path from "path";
import WebTorrent from "webtorrent";

let client = new WebTorrent();

let stats = {
  progress: 0,
  downloadSpeed: 0,
  ratio: 0,
};

let error_message = "";

client.on("error", (err) => {
  error_message = err.message;
});

client.on("download", (bytes) => {
  stats.progress = Math.round(client.progress * 100 * 100) / 100;
  stats.downloadSpeed = client.downloadSpeed;
  stats.ratio = client.ratio;
});

const routes = async (fastify, options) => {
  fastify.get("/add/:magnet", async (req, res) => {
    let { magnet } = req.params;

    client.add(magnet, function (torrent) {
      let files = [];

      torrent.files.forEach(function (data) {
        files.push({
          name: data.name,
          length: data.length,
        });
      });

      res.status(200).send(files);
    });
  });

  fastify.get("/stream/:magnet/:fileName", async (req, res, next) => {
    let { magnet } = req.params;
    let tor = client.get(magnet);
    let file = {};

    for (let i = 0; i < tor.files.length; i++) {
      console.log({ file: tor.files[i] });
      if (tor.files[i].name == req.params.fileName) {
        file = tor.files[i];
      }
    }

    let range = req.headers.range;

    console.log(range);

    if (!range) {
      let err = new Error("Wrong range");
      err.status = 416;

      throw err;
    }

    let positions = range.replace(/bytes=/, "").split("-");
    let start = parseInt(positions[0], 10);
    let file_size = file.length;
    let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;
    let chunksize = end - start + 1;

    let head = {
      "Content-Range": `bytes ${start}-${end}/${file_size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);

    let stream_position = {
      start: start,
      end: end,
    };

    let stream = file.createReadStream(stream_position);

    stream.pipe(res);
    stream.on("error", function (err) {
      console.log(err);
    });
  });

  fastify.get("/list", async (req, res) => {
    let torrent = client.torrents.reduce((array, data) => {
      array.push({
        hash: data.infoHash,
      });

      return array;
    }, []);

    res.status(200).send(torrent);
  });

  fastify.get("/stats", async (req, res) => {
    res.status(200).send(stats);
  });

  fastify.get("/errors", async (req, res) => {
    res.status(200).send(error_message);
  });

  fastify.get("/remove/:magnet", async (req, res) => {
    let magnet = req.params.magnet;

    client.remove(magnet, (err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({ message: "Torrent removed" });
      }
    });
  });
};

export default routes;
