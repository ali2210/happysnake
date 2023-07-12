import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import CircumIcon from "@klarr-agency/circum-icons-react";
import useSound from 'use-sound';
import popUp from './stories_sounds_pop-up-on.mp3';
import playback from './stories_sounds_rising-pops.mp3';
import epicFail from './epic-Fail.mp3';
import victory from './victory.mp3';
import startOn from './chime .mp3';
import snakeRattle from './snake-rattling.mp3';


function App() {


  const scoreBoard = new Map();
  const [serial , setSerial] = useState(0);

  const [playGame, setPlayGame] = useState(false);
  const [stepLeftTakes, setStepLeftTakes] = useState(0);
  const [stepRightTakes, setStepRightTakes] = useState(0);
  const [stepUpTakes, setStepUpTakes] = useState(0);
  const [stepDownTakes, setStepDownTakes] = useState(0);


  const [foodAllocate, setFoodAllocate] = useState(false);
  const [isStomachFull, setIsStomachFull] = useState(0);
  const [isAlive , setIsAlive] = useState(false);

  const [totalArea, setTotalArea] = useState(0);
  const [highScore, setHighScore] = useState(5);
  const [Score,setScore] = useState(0);
  const [Status, setStatus] = useState(" ");



  const [MusicOn, setMusicOn] = useState(false);
  const [popUpMusic] = useSound(popUp, {volume : 0.75});
  const [playbackRate, setPlayBackRate] = useState(0);
  const [heart] = useSound(playback, {volume : 0.75, playbackRate});
  const [epic] = useSound(epicFail, {volume : 0.75});
  const [legend] = useSound(victory, {volume : 0.75});
  const [backgroundOn] = useSound(startOn, {volume : 0.75});

  const [beatPerSec , setBeatPerSec] = useState(0);
  const [Rattle] = useSound(snakeRattle, {volume : 1, beatPerSec});

  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true);
  const [metamaskAddress, setMetaMaskAddress] = useState(null);
  const [isConnect, setIsConnect] =  useState(false);
  const [zeroBalance, setZeroBalance] = useState(false);
  const [makeTnxState, setMakeTnxState] = useState(false);

  const { ethereum } = window;

  useEffect(() => {
    const {ethereum} = window;
    const MetaMaskStatus = async() => {

        if (!ethereum){
            setIsMetaMaskInstalled(false);
        }
         setIsMetaMaskInstalled(true);
         console.log("MetaMask Active" );
    };
    MetaMaskStatus();
  }, []);



    const ConnectMetamaskInterface = async() => {

        try{

                    const {ethereum} = window;
                    if (!isMetaMaskInstalled && !ethereum){
                        alert("MetaMask not installed on your browser ... Visit metamask.io");
                    }

                    const accounts = await ethereum.request({
                        method : 'eth_requestAccounts'
                    });

                    console.log("Account =", accounts[0]);

                    setMetaMaskAddress(accounts[0]);
                    setIsConnect(true);

                    const balance = await ethereum.request({
                        method: "eth_getBalance",                                      /* New */
                        params: [accounts[0], "latest"],
                    });

                    console.log(" Balance = ", balance[0]);
                    balance[0] > 0 ? setZeroBalance(balance[0]) : setZeroBalance(setZeroBalance);

                    if (zeroBalance - (0.16+0.01) > 0) {

                        alert('Make transaction @ 0x55057eb78fDbF783C961b4AAd6A5f8BC60cab44B');
                        document.body.children[1].children[0].children[8].style.visibility = 'visible';
                        const etherscan_api = require('etherscan-api').init('2TPR8SBVTATJPZR9QFY26216XBCKWAYNFB');
                        const recBal = etherscan_api.account.balance('0x55057eb78fDbF783C961b4AAd6A5f8BC60cab44B');
                        recBal.then(function(balanceData){
                                 console.log(balanceData);
                        });


                    }else{
                        alert('Your Account have low balance ... Buy some ethereum then try...');
                    }


        }catch(error){
            setIsConnect(false);
        }




    };

  return (
    <div className="App">
      <header className="App-header">
           <div className="Ui-menu">
                <h2> HappySnake </h2>
           </div>
           <Toolbar onPlayGame = {() => {

                    if (!playGame){
                        alert('game started ..');
                        backgroundOn();


                        document.body.children[1].children[0].children[1].style.visibility = 'visible';
                        document.body.children[1].children[0].children[0].children[1].style.visibility = 'hidden';
                        document.body.children[1].children[0].children[0].style.background = 'green';
                        document.body.children[1].children[0].children[2].style.visibility = 'visible';
                        document.body.children[1].children[0].children[3].style.visibility = 'visible';
                        document.body.children[1].children[0].children[5].style.visibility = 'hidden';
                        document.body.children[1].children[0].children[6].style.visibility = 'hidden';
                        document.body.children[1].children[0].children[7].style.visibility = 'hidden';
                        document.body.children[1].children[0].children[8].style.visibility = 'hidden';
                        document.body.children[1].children[0].children[9].style.visibility = 'hidden';



                        setPlayGame(true);
                    }
                  }}
           />
      </header>
      <div className="Snake" onDrag = {
        (e) => {
            if (e.clientX > 0 && !WallsCollisionScript(document.body.children[1].children[0].children[1])){

                setBeatPerSec(beatPerSec *2);
                Rattle();
                setStepLeftTakes(stepLeftTakes+1);
                document.body.children[1].children[0].children[1].style.left = (stepLeftTakes +0 ).toString() + 'pc';
                setTotalArea(totalArea+stepLeftTakes);
                document.body.children[1].children[0].children[1].style.transform = '0deg';

                Food_PosXY(document.body.children[1].children[0].children[4].children[0], foodAllocate);
                setFoodAllocate(true);
                setFoodAllocate(LunchTime(document.body.children[1].children[0].children[1], document.body.children[1].children[0].children[4].children[0]));

                if(!foodAllocate){

                        setPlayBackRate(playbackRate+1);
                        heart();
                        setStatus("Yummmm ...");
                        setIsStomachFull(isStomachFull+1);
                        setScore(Score+2);

                        if (!SnakeAnalysis(isStomachFull)){

                                            setIsAlive(false);
                                            epic();
                                              if (Score > highScore) {
                                                    legend();  setHighScore(Score);
                                                       scoreBoard.set(serial+1,highScore );
                                                    console.log("Value =", scoreBoard.get(serial));
                                              }else{
                                                        setHighScore(Score);

                                              }
                        }else {
                                            setIsAlive(true);
                        }
                        console.log("Status =", Status);

                }else{
                    setStatus("You Miss the chance ...");
                }

                console.log("Left =", stepLeftTakes);

            }else if (e.clientY > 0 && !WallsCollisionScript(document.body.children[1].children[0].children[1])) {

                setBeatPerSec(beatPerSec *2);
                                Rattle();
                setStepUpTakes(stepUpTakes+1);
                document.body.children[1].children[0].children[1].style.transform = '90deg';
                document.body.children[1].children[0].children[1].style.top = (stepUpTakes - 19).toString() + 'pc';
                console.log("Up =", stepUpTakes);
                setTotalArea(totalArea+stepUpTakes);
                Food_PosXY(document.body.children[1].children[0].children[4].children[0], foodAllocate);
                setFoodAllocate(true);
                setFoodAllocate(LunchTime(document.body.children[1].children[0].children[1], document.body.children[1].children[0].children[4].children[0]));
                if(!foodAllocate){

                          setPlayBackRate(playbackRate+1);
                                                  heart();
                          setStatus("Yummmm ...");
                          setScore(Score+2);
                          setIsStomachFull(isStomachFull+1);
                          if (!SnakeAnalysis(isStomachFull)){

                                              setIsAlive(false);
                                              epic();

                                              if (Score > highScore) {
                                                        legend();
                                                  setHighScore(Score);
                                                        scoreBoard.set(serial+1,highScore );
                                                    console.log("Value =", scoreBoard.get(serial));
                                              }else{
                                                    setHighScore(Score);
                                              }
                          }else {
                                setIsAlive(true);
                          }

                }else{
                                     setStatus("You Miss the chance ...");
                }

            }else if (e.clientX <= 0 && !WallsCollisionScript(document.body.children[1].children[0].children[1])){

                setBeatPerSec(beatPerSec *2);
                                Rattle();
                setStepRightTakes(stepRightTakes+1);
                document.body.children[1].children[0].children[1].style.transform = '180deg';
                document.body.children[1].children[0].children[1].style.left = (stepRightTakes - 36).toString() + 'pc';
                console.log("Right =", stepRightTakes);
                setTotalArea(totalArea+stepRightTakes);
                Food_PosXY(document.body.children[1].children[0].children[4].children[0], foodAllocate);
                setFoodAllocate(true);
                setFoodAllocate(LunchTime(document.body.children[1].children[0].children[1], document.body.children[1].children[0].children[4].children[0]));
                if(!foodAllocate){

                    setPlayBackRate(playbackRate+1);
                                            heart();
                    setStatus("Yummmm ...");
                    setScore(Score+2);
                    setIsStomachFull(isStomachFull+1);
                    if (!SnakeAnalysis(isStomachFull)){

                                        setIsAlive(false);
                                        epic();
                                        if (Score > highScore) {
                                                    legend();
                                                   setHighScore(Score);
                                                scoreBoard.set(serial+1,highScore );
                                                console.log("Value =", scoreBoard.get(serial));
                                        }else{
                                                setHighScore(Score);
                                        }
                    }else {
                          setIsAlive(true);
                    }
                }else{
                                     setStatus("You Miss the chance ...");
                }

            }else if (e.clientY <= 0 && !WallsCollisionScript(document.body.children[1].children[0].children[1])) {

                setBeatPerSec(beatPerSec *2);
                                Rattle();
                 setStepDownTakes(stepDownTakes+1);
                 document.body.children[1].children[0].children[1].style.transform = '-90deg';
                 document.body.children[1].children[0].children[1].style.top = (stepDownTakes - 52).toString() + 'pc';
                 console.log("Down =", stepDownTakes);
                 setTotalArea(totalArea+stepDownTakes);
                 Food_PosXY(document.body.children[1].children[0].children[4].children[0], foodAllocate);
                 setFoodAllocate(true);
                 setFoodAllocate(LunchTime(document.body.children[1].children[0].children[1], document.body.children[1].children[0].children[4].children[0]));
                 if(!foodAllocate){

                                setPlayBackRate(playbackRate+1);
                                                        heart();
                                setStatus("Yummmm ...");
                                  setScore(Score+2);
                                  setIsStomachFull(isStomachFull+1);

                                  if (!SnakeAnalysis(isStomachFull)){

                                        setIsAlive(false);
                                        epic();
                                        if (Score > highScore) {
                                            legend();
                                            setHighScore(Score);
                                            scoreBoard.set(serial+1,highScore );
                                             console.log("Value =", scoreBoard.get(serial));
                                        }else{

                                            setHighScore(Score);
                                        }
                                  }else {
                                                                          setIsAlive(true);
                                  }

                 }else{
                                      setStatus("You Miss the chance ...");
                 }

            }
        }}>
        <div className="S-Head"></div>
        <div className="S-Body">
            <div className="L-Eye"></div>
            <div className="R-Eye"></div>
            <div className="Tongue"></div>
        </div>
        <div className="Stomach"></div>
        <div className="Tail">
            <div className="Tail-0"></div>
            <div className="Tail-1"></div>
            <div className="Tail-2"></div>
            <div className="Tail-3"></div>
            <div className="Tail-4"></div>
        </div>
      </div>
      <div className="Area">
            <h3 className="Distance"> {totalArea} kps </h3>
      </div>
      <div className="Extras">
            <h3 className="HighScore"> {highScore} </h3>
            <h3 className="Score"> {Score} </h3>
            <h2 className="Status"> {Status} </h2>
            <h4 className="Collect"> {isStomachFull} </h4>
      </div>
      <div className="Food-Place">
            <div className="F1"></div>
      </div>
        <button className="Sound" onClick = {() => {
            if(MusicOn){
                setMusicOn(false);
                alert("Be Silent ...");
            }else{
                setMusicOn(true);
                alert("Fun Time ...");
            }
        }} onMouseDown = {popUpMusic}
        ><CircumIcon name="music_note_1"/></button>
        <button className="Help" onClick = {() => {
            alert("Snake : I'm quite hungry for a week. Instruction : Will you please help me to find my food. Don't try to press A,W,S,D for movement. Place your mouse on me and drag it any direction. Don't eat too much ...");
        }} onMouseDown = {popUpMusic} ><CircumIcon name="circle_question"/></button>
        <button className="Quit" onClick = {() => {
            alert('Good bye ! ');
            setPlayGame(false);
        }} onMouseDown = {popUpMusic}><CircumIcon name="logout"/></button>
        <button className="Top10" onClick={ConnectMetamaskInterface}>
            <CircumIcon name="view_board"/>
        </button>
        <div className="Results">
               <h2> {scoreBoard.get(serial)} </h2>
        </div>
    </div>
  );
}

function Toolbar({ onPlayGame }){
    return(
        <Button onClick={onPlayGame}>
        </Button>
    );
}

function Button({onClick, children}) {
    return(
        <button className="Launch-btn" onClick={onClick}>
            {children} <CircumIcon name="play_1"/>
        </button>


    );
}

function Food_PosXY(food, allocate){

    console.log("Allocate =", allocate)
    if (!allocate){

        food.style.top =  numberInRange(-15,-52).toString() + 'pc';
        food.style.left = numberInRange(0,15).toString() + 'pc';
        food.style.visibility = 'visible';
    }

//    food.style.visibility = 'hidden';

    console.log("Food ==", food);
}

function LunchTime(snake, food, allocate) {

    if (food.style.top - snake.style.top <= 0 && food.style.left - snake.style.left <= 0 && allocate){

        food.style.visibility = 'hidden';
    }

    return false;
}

function WallsCollisionScript(snake) {

    if (snake.style.top === '-15pc' || snake.style.top === '-52pc'){
            return true;
    }

    if (snake.style.left === '0pc' || snake.style.top === '15pc'){
        return true;
    }

    return false;
}

function numberInRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function SnakeAnalysis(count) {

//    healthy
    if (count >= 0 && count < 1000){
        return true;
    }

//    strave
    if (count <0) {

        return false;

    }
//    overeat
    if (count > 1000){

        return false;
    }
}






export default App;
