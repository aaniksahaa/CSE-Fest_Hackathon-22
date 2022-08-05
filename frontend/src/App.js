import React, { useReducer, useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

import { Grid } from '@mui/material';
import Item from './components/Item';
import './styles/styles.css';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MicNoneIcon from '@mui/icons-material/MicNone';
import Button from '@mui/material/Button';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import LoadingButton from '@mui/lab/LoadingButton';
import Timer from './components/Timer';
import { CardActionArea } from '@mui/material';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import { useStopwatch } from 'react-timer-hook';


const google = window.google;

const useTimer = (initialState = 0) => {
  const [timer, setTimer] = React.useState(initialState)
  const [isActive, setIsActive] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const countRef = React.useRef(null)

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
  }

  const handleResume = () => {
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }

  return { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset }
};

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const App = () => {
  const [Lang, setLang] = useState('en-GB');
  const { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0);
  const [result, setResult] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [music, setMusic] = useState([]);
  const [directions, setDirections] = useState([]);
  const [sss, setsss] = useState('');
  const [ddd, setddd] = useState('');

  useEffect(() => {
    console.log(music);
  }, [music]);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset_t = () => {
    setActiveStep(0);
  };


  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const getMusic = (query) => {
    const axios = require("axios");

    const options = {
      method: 'GET',
      url: 'https://youtube138.p.rapidapi.com/search/',
      params: { q: query, hl: 'en', gl: 'US' },
      headers: {
        'X-RapidAPI-Key': '683351e6d6msh5280d130f8100c4p1b86d2jsn83e8d30556e0',
        'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
      }
    };
    axios.request(options).then(function (response) {
      console.log(response.data.contents);
      for (var i = 0; i < response.data.contents.length; i++) response.data.contents[i].playing = 0;
      setMusic(response.data.contents);
    }).catch(function (error) {
      text_to_speech('an error occurred. sorry.');
    });
  }
  const getDirections = (source, dest) => {
    const axios = require("axios");

    let slon = "0"
    let slat = "0"
    let dlon = "0"
    let dlat = "0"

    const options = {
      method: 'GET',
      url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search',
      params: { q: source, 'accept-language': 'en', polygon_threshold: '0.0' },
      headers: {
        'X-RapidAPI-Key': '683351e6d6msh5280d130f8100c4p1b86d2jsn83e8d30556e0',
        'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      //console.log(response.data);
      let data = response.data
      slon = response.data[0].lon;
      slat = response.data[0].lat;

      const options2 = {
        method: 'GET',
        url: 'https://forward-reverse-geocoding.p.rapidapi.com/v1/search',
        params: { q: dest, 'accept-language': 'en', polygon_threshold: '0.0' },
        headers: {
          'X-RapidAPI-Key': '683351e6d6msh5280d130f8100c4p1b86d2jsn83e8d30556e0',
          'X-RapidAPI-Host': 'forward-reverse-geocoding.p.rapidapi.com'
        }
      };

      axios.request(options2).then(function (response) {
        //console.log(response.data);
        let data = response.data

        dlon = response.data[0].lon;
        dlat = response.data[0].lat;

        //res.render('directions.ejs',{longitude,latitude})
        forceUpdate();
        console.log(slon + ',' + slat + ';' + dlon + ',' + dlat)
        let str = slon + ',' + slat + ';' + dlon + ',' + dlat
        setsss(slon + ',' + slat);
        setddd(dlon + ',' + dlat);
        const options3 = {
          method: 'GET',
          url: 'https://fast-routing.p.rapidapi.com/route/v1/driving/' + str,
          params: { steps: 'true' },
          headers: {
            'X-RapidAPI-Key': '683351e6d6msh5280d130f8100c4p1b86d2jsn83e8d30556e0',
            'X-RapidAPI-Host': 'fast-routing.p.rapidapi.com'
          }
        };
        axios.request(options3).then(function (response) {
          console.log(response.data);
          let data = response.data.routes[0].legs[0].steps;
          setDirections(data);
        }).catch(function (error) {
          text_to_speech('an error occurred. sorry.');
        });
      }).catch(function (error) {
        text_to_speech('an error occurred. sorry.');
      });
    }).catch(function (error) {
      text_to_speech('an error occurred. sorry.');
    });
  }
  const getResponse = (msg) => {
    const options = {
      method: 'GET',
      url: 'https://aeona3.p.rapidapi.com/',
      params: { text: msg, userId: '12312312312' },
      headers: {
        'X-RapidAPI-Key': '683351e6d6msh5280d130f8100c4p1b86d2jsn83e8d30556e0',
        'X-RapidAPI-Host': 'aeona3.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      setMessage(response.data);
      text_to_speech(response.data);
      return;

    }).catch(function (error) {
      text_to_speech('an error occurred. sorry.');
    });
  };
  const getAllNews = (query) => {
    const options = {
      method: 'GET',
      url: 'https://bing-news-search1.p.rapidapi.com/news/search',
      params: {
        q: query,
        count: '20',
        freshness: 'Day',
        textFormat: 'Raw',
        originalImg: 'true',
        safeSearch: 'Off'
      },
      headers: {
        'X-BingApis-SDK': 'true',
        'X-RapidAPI-Key': '683351e6d6msh5280d130f8100c4p1b86d2jsn83e8d30556e0',
        'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
      }
    };

    axios.request(options).then(function (response) {
      console.log(response.data.value);
      var titles = "";
      for (var i = 0; i < response.data.value.length; i++) {
        response.data.value[i].type = 0;
        titles += response.data.value[i].name;
        titles += ". ; -";
      }
      setResult(response.data.value);
      text_to_speech(titles);
    }).catch(function (error) {
      text_to_speech('an error occurred. sorry.');
    });
  };
  const [message, setMessage] = useState('');
  const [Status, setStatus] = useState('default');
  const [notetitle, setnotetitle] = useState('');
  const [notetext, setnotetext] = useState('');
  const [ispinned, setpinned] = useState(false);
  const [Notes, setNotes] = useState([]);

  const commands = [
    {
      command: 'shut up',
      callback: () => Stop()
    },
  ]
  const base_url = 'https://noteapiii.herokuapp.com';
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  var prepositions = ['of', 'about', 'in', 'from'];

  var sayTimeout = null;

  function text_to_speech(text) {
    if (speechSynthesis.speaking) {
      // SpeechSyn is currently speaking, cancel the current utterance(s)
      speechSynthesis.cancel();

      // Make sure we don't create more than one timeout...
      if (sayTimeout !== null)
        clearTimeout(sayTimeout);

      sayTimeout = setTimeout(function () { text_to_speech(text); }, 250);
    }
    else {
      // Good to go
      var message = new SpeechSynthesisUtterance(text);
      message.lang = "en-US";
      speechSynthesis.speak(message);
    }
  }

  useEffect(() => {
    var txt = finalTranscript.toLowerCase();
    if (txt !== '') {
      var prep = '-_-';
      if (txt === 'switch to bangla') {
        setLang('bn-bd');
        setMessage('Language changed to Bangla');
        resetTranscript();
        return;
      }
      else if (txt === 'ইংলিশ') {
        setLang('en-GB');
        setMessage('Language changed to English');
        resetTranscript();
        return;
      }
      if (Status === 'note-title') {
        setnotetitle(txt);
        text_to_speech('now tell me the note');
        setMessage('now tell me the note');

        setStatus('note-text');
        resetTranscript();
        return;
      }
      if (Status === 'note-text') {
        if (txt.includes('stop')) {
          // upload
          const options = {
            method: 'POST',
            url: base_url + '/notes/?id=62ebdd2e764657ca2021f99c',
            data: {
              "title": notetitle,
              "text": notetext,
              "is_pinned": ispinned,
            },
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          };
          axios.request(options).then(function (response) {
            text_to_speech('note has been saved');
            setMessage('note has been saved');
            setStatus('default');
            setnotetext('');
            setnotetitle('');
            resetTranscript();
          }).catch(function (error) {
            text_to_speech('note saving failed');
            setMessage('note saving failed');
            resetTranscript();
          });
          return;
        }
        else if (txt.includes('pin')) {
          setpinned(true);
          text_to_speech('note is pinned');
          setMessage('note is pinned');
          resetTranscript();
          return;
        }
        else {
          setnotetext(notetext + txt + '.');
          text_to_speech('then?');
          setMessage('then?');
          resetTranscript();
          return;
        }
      }
      if (txt.includes('start note') || txt.includes('স্টার্ট নোট')) {
        text_to_speech('tell me the note title');
        setStatus('note-title');
        resetTranscript();
        return;
      }
      if (txt.includes('show note') || txt.includes('শো নোট')) {
        const options = {
          method: 'GET',
          url: base_url + '/notes/?id=62ebdd2e764657ca2021f99c',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        };
        axios.request(options).then(function (response) {
          setNotes(response.data);
          resetTranscript();
        }).catch(function (error) {
          text_to_speech('notes could not be fetched');
          setMessage('notes could not be fetched');

          resetTranscript();
        });
        return;
      }
      if (txt.includes('show pin note') || txt.includes('শো পিন নোট')) {
        const options = {
          method: 'GET',
          url: base_url + '/notes/?id=62ebdd2e764657ca2021f99c&is_pinned=1',
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        };
        axios.request(options).then(function (response) {
          setNotes(response.data);
          resetTranscript();
        }).catch(function (error) {
          text_to_speech('notes could not be fetched');
          setMessage('notes could not be fetched');
          resetTranscript();
        });
        return;
      }
      if (txt.includes('find note') || txt.includes('ফাইন্ড নোট')) {
        const options = {
          method: 'GET',
          url: base_url + '/notes/?id=62ebdd2e764657ca2021f99c&title=' + txt.replace('find note ', ''),
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        };
        axios.request(options).then(function (response) {
          setNotes(response.data);
          resetTranscript();
        }).catch(function (error) {
          text_to_speech('notes could not be fetched');
          setMessage('notes could not be fetched');
          resetTranscript();
        });
        return;
      }

      if (Lang === 'en-GB') {
        for (var i = 0; i < 4; i++) {
          if (txt.includes(prepositions[i])) {
            prep = prepositions[i];
          }
        }
        if (prep == '-_-') {
          getResponse(txt);
          resetTranscript();
          return;
        }
        if (txt.includes('news')) {
          setMessage('searching news: ' + txt.split(prep)[1]);
          text_to_speech('searching news: ' + txt.split(prep)[1]);
          getAllNews(txt.split(prep)[1]);
          resetTranscript();
          return;
        }
        else if (txt.includes('music')) {
          setMessage('searching music: ' + txt.split(prep)[1]);
          text_to_speech('searching news: ' + txt.split(prep)[1]);
          getMusic(txt.split(prep)[1]);
          resetTranscript();
          return;
        }
        else if (txt.includes('direction')) {
          var q = txt.split(prep)[1];
          if (q.includes('to')) {
            var source = q.split('to')[0];
            var dest = q.split('to')[1];
            setMessage('searching direction from '+source+' to '+dest);
            text_to_speech('searching direction from '+source+' to '+dest);
            getDirections(source, dest);
            resetTranscript();
            return;
          }
          else {
            text_to_speech('Please include "to" in the direction command');
            setMessage('Please include "to" in the direction command');
            resetTranscript();
            return;
          }
        }
        else {
          getResponse(txt);
          resetTranscript();
          return;
        }
      }
      else {
        alert(':D');
        //getMusic(txt);
        resetTranscript();
        return;
      }

    }
  }, [interimTranscript, finalTranscript]);
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log('Your browser does not support speech recognition software! Try Chrome desktop, maybe?');
  }
  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: Lang,
    });
  };
  //////////////////////////
  const getImage = (obj) => {
    if ("image" in obj) {
      //  if("thumbnail" in obj.image) {
      return <CardMedia
        component="img"
        height="194"
        image={obj.image.contentUrl}
        alt="image-alt"
      />
      // }
    }
    return <CardMedia
      component="img"
      height="194"
      image={""}
      alt="Paella dish"
    />
  };

  const Stop = () => {
    // resetTranscript();
    text_to_speech('ok');
    handlePause();
    handleReset();
    SpeechRecognition.stopListening();
    resetTranscript();
  }
  const Start = () => {
    setMusic([]);
    setResult([]);
    setDirections([]);
    setNotes([]);

    handleStart();
    listenContinuously();
  }


  const formatTime = (timer) => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getMinutes} : ${getSeconds}`
  }
  const get = () => {
    return (
      <div>
        {formatTime(timer)}
        <div style={{ fontSize: "12px" }}>
          {transcript}
        </div>
      </div>
    )
  };
  const redirect = (url) => {
    window.open(url, '_blank').focus();
  };

  const Convert = (idx) => {
    console.log(idx);
    var mz = music;
    mz[idx].type = 'playing';
    setMusic(mz);
    forceUpdate();
  };
  const Convert2 = (idx) => {
    console.log(idx);
    var ne = result;
    ne[idx].type = 1;
    setMusic(ne);
    forceUpdate();
  }

  const gettNews = (obj, index) => {
    if (obj.type === 0) {
      return (
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ maxWidth: 500 }} onClick={() => redirect(obj.url)}>
            <CardActionArea>
              {getImage(obj)}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {obj.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {obj.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>

            </CardActions>
          </Card>
        </Grid>
      );
    }
    else {
      return (
        <Grid item xs={12}>
          <iframe type="text/html" height="400" width="100%"
            src={obj.url}>
          </iframe>
        </Grid>
      );
    }
  }
  const dummy = (txt) => {
    return txt;
  }
  const gettMusic = (obj, index) => {
    if (obj.type === 'video') {
      return <Grid item xs={12}>
        <Card variant="outlined" sx={{ maxWidth: 500 }} onClick={() => Convert(index)}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="194"
              image={obj.video.thumbnails[0].url}
              alt="image-alt"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {obj.video.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {obj.video.descriptionSnippet}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>

          </CardActions>
        </Card>
      </Grid>
    }
    else if (obj.type == 'playing') {
      return <div className='center_div'><iframe id="ytplayer" style={{display: "block"}} type="text/html" height="390" width="100%"
        src={"http://www.youtube.com/embed/" + obj.video.videoId + "?autoplay=1"}>
      </iframe></div>

    }
    else return <div></div>
  };

  return (

    <div>
      <style type="text/css">
        {`
          .btn-flat {
            background-color: purple;
            color: white;
          }

          .btn-huge {
            padding: 5rem 10rem;
            font-size: 1.5rem;
          }

          .btn-small {
            padding: 0.2rem 0.2rem;
            font-size: 12px;
          }
        `}
      </style>
      <div>
        <div>
          <center>

            {
              listening ? <Button onClick={Stop} color="primary" size="large" className="buttonW" variant="contained">{get()}</Button> : <Button className="buttonW" size="large" onClick={Start} variant="outlined" color="primary" startIcon={<KeyboardVoiceIcon className="svg_icons" size="large" />}>Listen</Button>
            }<br />
            {
              message
            }
          </center>
        </div>
      </div>
      <div>
        <center>
          <Grid container spacing={4}>
            {
              result.length > 0 && result.map((obj, index) => {
                return (
                  <>
                    {gettNews(obj, index)}
                  </>
                )
              })
            }
            {
              music.length > 0 && music.map((obj, index) => {
                return (
                  <>
                    {gettMusic(obj, index)}
                  </>
                )
              })
            }
            {
              Notes.length > 0 && Notes.map((obj, index) => {
                return <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ maxWidth: 500 }} onClick={() => Convert(index)}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {obj.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {obj.text}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              })
            }

          </Grid>
          <center style={{marginTop: "100px"}}>
            <Box sx={{ maxWidth: 400 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {directions.map((obj, index) => (
                  <Step key={"drive " + obj.driving_side + " along " + obj.name + " for " + obj.distance + " meters "}>
                    <StepLabel
                      optional={
                        index === 2 ? (
                          <Typography variant="caption">Last step</Typography>
                        ) : null
                      }
                    >
                      {dummy("drive " + obj.driving_side + " along " + obj.name + " for " + obj.distance + " meters ")}
                    </StepLabel>
                    <StepContent>
                      <Typography></Typography>
                      <Box sx={{ mb: 2 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === directions.length - 1 ? 'Finish' : 'Continue'}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              { }
            </Box>
          </center>
        </center>
      </div>
    </div>
  );
};

export default App;