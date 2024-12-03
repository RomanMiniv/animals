import * as LittleJS from "littlejsengine";


function gameInit() {
  
}

function gameUpdate() {
  
}

function gameUpdatePost() {
  
}

function gameRender() {
  
}

function gameRenderPost() {
  LittleJS.drawTextScreen("Here we go again :).", LittleJS.vec2(LittleJS.mainCanvas.width / 2, LittleJS.mainCanvas.height / 2), 48, LittleJS.RED);
}

LittleJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
