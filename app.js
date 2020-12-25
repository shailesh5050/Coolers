

//Global Selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const slidersContainers = document.querySelectorAll('.sliders');
const adjustmentButton = document.querySelectorAll('.adjust');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const lock =document.querySelectorAll('.lock');


//generate Button
generateBtn.addEventListener('click',randomColor);
//random color generator 
function generatHex(){
    let hash = chroma.random();
    
    return hash;
}
//add event listener to the sliders
sliders.forEach(slider =>{
    slider.addEventListener("input",hslControl);
})
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
      updateTextUI(index);
     
    });
  });

lock.forEach((button,index)=>{
    button.addEventListener('click',(e)=>{
        layerLock(e,index);
    })
})
//random color seting to the color boxes

function randomColor(){
    initialColors = [];
    colorDivs.forEach(function(div,index){
        let hexText = div.children[0];
        let randomColor = generatHex();
        //adding to the array 
        if(div.classList.contains("locked")){
            initialColors.push(hexText.innerText);
            return;
        }else{
            initialColors.push(chroma(randomColor).hex());
        }
        
      //add color to the bg
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        checkTextContrast(randomColor,hexText)
        //Initial color slider
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const staturation = sliders[2];
        const brightness = sliders[1];
    
        colorizeSliders(color,hue,staturation,brightness);
        //reset inputs
        
    
    });

    resetInputs();
    //adjustment button color
    adjustmentButton.forEach((button,index)=>{
        checkTextContrast(initialColors[index],button)
    })
     //adjustment button color
     lock.forEach((button,index)=>{
        checkTextContrast(initialColors[index],button)
    })

}
//contrast checker
function checkTextContrast(color,text){
    const luminance = chroma(color).luminance();
   
    if(luminance > 0.5){
        text.style.color="black"
    }else{
        text.style.color="white"
    }
}

//seting  color to the sliders
function colorizeSliders(color,hue,staturation,brightness){
    //scale staturation
    const noSat = color.set('hsl.s',0);
    const fullSat = color.set('hsl.s',1);
    //scale brightness
    const midBrightness = color.set('hsl.l',0.5);
    const scaleBright = chroma.scale(['black',midBrightness,'white']);
    const scaleSat = chroma.scale([noSat,color,fullSat]);
    
    staturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
    
}
//Adjustment Slider Toggler
adjustmentButton.forEach((button,index)=>{
    button.addEventListener('click',()=>{
        openAdjustmentPanel(index);
    })
})
closeAdjustments.forEach((button,index)=>{
    button.addEventListener('click',()=>{
        closeAdjustmentPanel(index);
    })
})
function layerLock(e,index){
    const lockSVG= e.target.children[0];
    const activeBg = colorDivs[index];
    activeBg.classList.toggle("locked");
    if (lockSVG.classList.contains("fa-lock-open")) {
        e.target.innerHTML = '<i class="fas fa-lock"></i>';
      } else {
        e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
      }
}

//SLider Controls 
function hslControl(e){
    //take the index of the slider that which slider is moved
    const index = e.target.getAttribute('data-bright') || 
                  e.target.getAttribute('data-sat') ||
                  e.target.getAttribute('data-hue');
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor =  initialColors[index];
    
    let color = chroma(bgColor)
    
    .set('hsl.s',saturation.value)
    .set('hsl.l',brightness.value)
    .set('hsl.h',hue.value)
    ;
   
    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color,hue,saturation,brightness);

}
function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();
    //Check Contrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
      checkTextContrast(color, icon);
    }
  }
 //reset input
 function resetInputs(){
    
     const sliders = document.querySelectorAll(".sliders input");
     
     sliders.forEach(slider => {
        if (slider.name === "hue") {
          const hueColor = initialColors[slider.getAttribute("data-hue")];
          const hueValue = chroma(hueColor).hsl()[0];
          slider.value = Math.floor(hueValue);
        }
        if (slider.name === "brightness") {
            const brightColor = initialColors[slider.getAttribute("data-bright")];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue *100)/100;
          }
          if (slider.name === "saturation") {
            const satColor = initialColors[slider.getAttribute("data-sat")];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue *100)/100;
          }
     })
 }

 //adustment panel toggle
 function openAdjustmentPanel(index){
     slidersContainers[index].classList.toggle('active');
 }
 function closeAdjustmentPanel(index){
    slidersContainers[index].classList.remove('active');
}

//Implement Save to Palette
const saveBtn = document.querySelector('.save');
const submitSave = document.querySelector('.submit-save');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');

saveBtn.addEventListener('click',openPalette);
closeSave.addEventListener('click',closePalette);
function openPalette(e){
    const popUp = saveContainer.children[0];
    saveContainer.classList.add('active');

}
function closePalette(e){
    const popUp = saveContainer.children[0];
    saveContainer.classList.remove('active');
    
}
//save
function savePalette(e) {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    const name = saveInput.value;
    const colors = [];
    currentHexes.forEach(hex => {
      colors.push(hex.innerText);
    });
}    
randomColor();
