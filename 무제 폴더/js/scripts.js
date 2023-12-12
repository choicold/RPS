/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

const my = document.getElementById("me");
const com = document.getElementById("computer");
myScore = parseInt(my.innerText);
comScore = parseInt(com.innerText);

const text = document.getElementById("text");
const reset = document.getElementById("reset");

const choiceArray = ["r", "s", "p"];

const URL = "https://teachablemachine.withgoogle.com/models/uG4EsjkN3/";

    let model, webcam, labelContainer, maxPredictions, max_Value, max_index;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        const webcamContainer = document.getElementById("webcam-container"); // 웹캠이 이미 홈페이지에 있다면 지우기 위해 요소를 불러옴
        const existingWebcam = webcamContainer.querySelector("canvas");
        const rmlabelContainer = document.getElementById("label-container");
        const rmlabels = rmlabelContainer.querySelectorAll("div");
        if (existingWebcam) {
            existingWebcam.remove();
            rmlabels.forEach(label => label.remove());
        }

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL); // 모델을 불러오고 그와 관련된 메타 데이터를 가져옴
        maxPredictions = model.getTotalClasses(); // 모델 내의 총 클래스의 개수를 가져옴

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip 웹캠 초기화
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop); // 애니메이션을 수행할 함수를 호출하도록 하는 함수
        setTimeout(() => {
          webcam.stop();
          game(choiceArray[max_index]);

        }, 5000);
        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas); // 홈페이지에 비디오가 나오게 하는 것
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        } // div요소를 labelContainer 아래에 maxPredictions개수 만큼 생성
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model
    async function predict() {
        // predict can take in an image, video or canvas html element
        const prediction = await model.predict(webcam.canvas);
        max_Value = prediction[0].probability.toFixed(2);
        max_index = 0;
        for (let i = 0; i < maxPredictions; i++) {
            if(i>0 && max_Value < prediction[i].probability.toFixed(2)){
              max_Value = prediction[i].probability.toFixed(2); // 클래스에서 가장 큰 값을 변수에 저장
              max_index = i;
            }
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    }

function getComChoice() {
  const comNumber = Math.floor(Math.random() * 3);

  return choiceArray[comNumber];
}

function printChoices(comChoice) {
  const rightSide = document.getElementById("right");
  const rightChoice = document.createElement("i");
  const rightExist = rightSide.querySelector("i");

  if (rightExist !== null) {
    rightSide.removeChild(rightExist);
  }

  if (comChoice === "r") {
    rightChoice.className = "fa-solid fa-hand-back-fist fa-8x";
  } else if (comChoice === "s") {
    rightChoice.className = "fa-solid fa-hand-scissors fa-8x";
  } else {
    rightChoice.className = "fa-solid fa-hand fa-8x";
  }
  rightSide.appendChild(rightChoice);
}

function win() {
  myScore += 1;

  my.innerText = myScore;
  text.innerText = "You Win";
}

function lose() {
  comScore += 1;

  com.innerText = comScore;
  text.innerText = "You lose";
}

function draw() {
  text.innerText = "Draw";
}

function game(myChoice) {
  const comChoice = getComChoice();
  printChoices(comChoice);
  console.log(myChoice + comChoice);
  switch (myChoice + comChoice) {
    case "rs":
    case "sp":
    case "pr":
      win();
      break;

    case "rr":
    case "ss":
    case "pp":
      draw();
      break;

    case "rp":
    case "sr":
    case "ps":
      lose();
      break;
  }
}
