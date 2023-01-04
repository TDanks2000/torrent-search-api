import express from "express";
import WebTorrent from "webtorrent";

let router = express.Router();

let client = new WebTorrent();

let stats = {
  progress: 0,
  downloadSpeed: 0,
  ratio: 0,
};

let error_message = "";

client.on("error", function (err) {
  error_message = err.message;
});

client.on("download", function (bytes) {
  stats = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio,
  };
});

router.get("/add/:magnet", function (req, res) {
  let magnet = req.params.magnet;

  client.add(magnet, function (torrent) {
    let files = [];

    torrent.files.forEach(function (data) {
      files.push({
        name: data.name,
        length: data.length,
      });
    });

    res.status(200);
    res.json(files);
  });
});

router.get("/stream/:magnet/:file_name", function (req, res, next) {
  let magnet = req.params.magnet;

  var tor = client.get(magnet);

  let file = {};

  for (let i = 0; i < tor.files.length; i++) {
    if (tor.files[i].name == req.params.file_name) {
      file = tor.files[i];
    }
  }

  let range = req.headers.range;

  console.log(range);

  if (!range) {
    let err = new Error("Wrong range");
    err.status = 416;

    return next(err);
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
    return next(err);
  });
});

router.get("/list", function (req, res, next) {
  let torrent = client.torrents.reduce(function (array, data) {
    array.push({
      hash: data.infoHash,
    });

    return array;
  }, []);

  res.status(200);
  res.json(torrent);
});

router.get("/stats", function (req, res, next) {
  res.status(200);
  res.json(stats);
});

router.get("/errors", function (req, res, next) {
  res.status(200);
  res.json(error_message);
});

router.get("/delete/:magnet", function (req, res, next) {
  let magnet = req.params.magnet;

  client.remove(magnet, function () {
    res.status(200);
    res.end();
  });
});

export default router;
