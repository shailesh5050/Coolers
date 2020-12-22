

//Global Selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");


//random color generator 
function generatHex(){
    let hash = chroma.random();
    
    return hash;
}
//add event listener to the sliders
sliders.forEach(slider =>{
    slider.addEventListener("input",hslControl);
})
//random color seting to the color boxes
function randomColor(){
    let initialColors = [];
    colorDivs.forEach(function(div,index){
        //adding to the array 
        
        const hexText = div.children[0];
        const randomColor = generatHex();
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
    const bgColor = colorDivs[index].querySelector('h2').innerText;
    let color = chroma(bgColor)
    .set('hsl.h',hue.value)
    .set('hsl.s',saturation.value)
    .set('hsl.l',brightness.value)
    ;
    colorDivs[index].style.backgroundColor = color;

}
randomColor()
