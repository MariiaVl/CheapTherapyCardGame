let uploadedImages = [];
let originalImages = [];
let fileInput, makeFamilyButton, randomizeButton, newFamilyButton;
let currentScreen = "upload";
let familyImage, logo;
let randomizedFaces = [];
let score = 0;
let faceIndex = 0;
let showCongrats = false;
let congratsTimer = 0;
let customFont;
let faceAppearProgress = [0, 0, 0, 0, 0]; 
let scoreX, scoreY;
let scoreDirection = 1;
let scoreWave = 0;
let celebrationSound; 
let congratsScale = 0; 
let congratsAngle = 0;
let angleDirection = 1; 
let requiredScore; 
let customFont2;
let appearSound;

let positions = [
  { x: 145, y: 78, w: 66, h: 66 }, // Mom
  { x: 188, y: 33, w: 76, h: 76 }, // Dad
  { x: 80, y: 157, w: 66, h: 66 },  // Daughter
  { x: 173, y: 228, w: 63, h: 63 }, // Son
  { x: 138, y: 393, w: 67, h: 67 }  // Dog
];

function preload() {
  customFont = loadFont("Helvetica-Bold.ttf");
  familyImage = loadImage("assets/family.png");
  logo = loadImage("assets/logo_for_the_app.png"); 
  celebrationSound = loadSound("assets/final_sound.mp3");
  customFont2 = loadFont("Anton.ttf");
  appearSound = loadSound("assets/appearing.mp3");
}

function setup() {
  createCanvas(400, 600);
  textAlign(CENTER, CENTER);

  fileInput = createFileInput(handleFiles);
  fileInput.attribute("multiple", "");
  fileInput.position(width / 2 - 75, 300);

  makeFamilyButton = createButton("Make My Family");
  makeFamilyButton.position(width / 2 - 50, 450);
  makeFamilyButton.mousePressed(startFamilyBuilder);
  makeFamilyButton.hide();

  randomizeButton = createButton("Randomize");
  randomizeButton.position(width / 2 - 50, height - 50);
  randomizeButton.mousePressed(assignNextFace);
  randomizeButton.hide();

  newFamilyButton = createButton("Make New Family");
  newFamilyButton.position(width / 2 - 60, height - 100);
  newFamilyButton.mousePressed(startNewGame);
  newFamilyButton.hide();

  scoreX = width - 10;
  scoreY = 20;
}

function draw() {
  background(255);

  if (currentScreen === "upload") {
    showUploadScreen();
  } else if (currentScreen === "family") {
    showFamilyScreen();
  }

  if (showCongrats && millis() - congratsTimer > 4000) {
    showCongratulationsScreen();
  }
}

function showUploadScreen() {
  background(0);

  imageMode(CENTER);
  image(logo, width / 2, 150, 350, 150); 

  textSize(24);
  textFont(customFont);

  textSize(14);
  fill(255);
  text("Upload at least 5 pictures to make your own family", width / 2, 360);
  
  textSize(12);
  text(`Images uploaded: ${uploadedImages.length}`, width / 2, 400);

  for (let i = 0; i < uploadedImages.length; i++) {
    image(uploadedImages[i], 50 + (i % 5) * 60, 450 + floor(i / 5) * 60, 50, 50);
  }

  if (uploadedImages.length >= 5) {
    makeFamilyButton.show();
  }
}

function handleFiles(file) {
  if (file.type.startsWith("image")) {
    let img = loadImage(file.data, (loadedImg) => {
      uploadedImages.push(loadedImg);
      originalImages.push(loadedImg); 
    });
  }
}

function startFamilyBuilder() {
  if (originalImages.length < 5) return;

  currentScreen = "family";
  makeFamilyButton.hide();
  fileInput.hide();
  randomizeButton.show();

  uploadedImages = [...originalImages];

  randomizedFaces = [];
  faceAppearProgress = [0, 0, 0, 0, 0];
  score = 0;
  faceIndex = 0;
  showCongrats = false;
}

function showFamilyScreen() {
  imageMode(CORNER);
  image(familyImage, 0, 0, width, height);

  for (let i = 0; i < randomizedFaces.length; i++) {
    if (faceAppearProgress[i] < 1) {
      faceAppearProgress[i] += 0.05;
    }

    let fade = map(faceAppearProgress[i], 0, 1, 0, 255);
    tint(255, fade);
    image(randomizedFaces[i], positions[i].x, positions[i].y, positions[i].w, positions[i].h);
    noTint();
  }

  if (faceIndex < 5) {
    scoreX += 0.5 * scoreDirection; 
    scoreWave += 0.05;
    scoreY = 20 + sin(scoreWave) * 5;

    if (scoreX > width - 10 || scoreX < 10) {
      scoreDirection *= -1;
    }
  }

  fill(0);
  textSize(18);
  textAlign(RIGHT);
  text(`Score: ${score}`, scoreX, scoreY);
}

function assignNextFace() {
  if (faceIndex < 5 && uploadedImages.length > 0) {
    let randIndex = floor(random(uploadedImages.length));
    let selectedImage = uploadedImages[randIndex];

    randomizedFaces.push(selectedImage);
    
    faceAppearProgress[faceIndex] = 0;
    score += 5;
    faceIndex++;
    appearSound.play();

    if (faceIndex === 5) {
      showCongrats = true;
      congratsTimer = millis();
      congratsScale = 0;
      requiredScore = floor(random(26, 31)); 
      celebrationSound.play();
      scoreX = width - 10;
      scoreY = 20;
      randomizeButton.hide();
      newFamilyButton.show();
    }
  }
}

function showCongratulationsScreen() {
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);
  
  push();
  translate(width / 2, height / 2);
  
  let targetScale = 1;
  congratsScale = lerp(congratsScale, targetScale, 0.1);
  scale(congratsScale);

  congratsAngle += 0.05 * angleDirection; 
  if (abs(congratsAngle) > 5) angleDirection *= -1; 
  rotate(radians(congratsAngle));

  fill(255, 255, 0);
  textSize(32);
  textFont(customFont2);
  textAlign(CENTER, CENTER);
  text("Congratulations!!!", 0, -20);
  fill(255, 255, 255);
  textSize(24);
  text("You made your family", 0, 20);

  textSize(14);
  textFont(customFont);
  fill(255, 255, 255);
  text("To make a new family you need to get", -30, 60);

  fill(255, 255, 0);
  text(requiredScore, 110, 60);

  fill(255, 255, 255); 
  text("points", 145, 60);
  //textSize(14);
  //textFont(customFont);
  //fill(255, 255, 255);
  //text(`To make a new family you need to get ${requiredScore} points`, 0, 60);
  
  pop();
}

function startNewGame() {
  
  currentScreen = "family";
  showCongrats = false;
  faceIndex = 0;
  score = 0;
  randomizedFaces = [];
  faceAppearProgress = [0, 0, 0, 0, 0];

  uploadedImages = [...originalImages];

  newFamilyButton.hide();
  randomizeButton.show();
}
