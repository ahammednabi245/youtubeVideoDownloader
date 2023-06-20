const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const youtubeDlExec = require('youtube-dl-exec');
const config = require('../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// GET home page
router.get('/', function (req, res, next) {
  res.render('index', { title: config.title, config: config });
});

// POST request to download YouTube video
router.post('/', function (req, res, next) {
  const videoLink = req.body.link;

  // Extract video name from the YouTube URL
  const videoName = extractVideoName(videoLink);

  // Define the output file name as the video name with ".mp4" extension
  const outputFileName = `${videoName}.mp4`;
  const outputOptions = ['-o', outputFileName];

  // Execute youtube-dl with the video URL and output options
  youtubeDlExec([videoLink, ...outputOptions])
    .then(output => {
      console.log('Video downloaded successfully!', output);
      res.render('index', { title: config.title, config: config });
    })
    .catch(error => {
      console.error('Error downloading video:', error);
      res.status(500).send('Error downloading video');
    });
});

// Extract video name from YouTube URL
function extractVideoName(url) {
  const videoId = url.match(/(?<=v=|v\/|vi=|vi\/|youtu.be\/|\/v\/|\/embed\/|\/v=|\/embed=|youtu.be=|\/v=|\/embed=|youtu.be=|\/embed\/|watch\?v=|youtube.com\/user\/[^#]*#([^\/]*?\/)*)[^&#?\/\n]*/);
  if (videoId && videoId.length > 0) {
    return videoId[0];
  }
  return 'output'; // Default video name if extraction fails
}

module.exports = router;
