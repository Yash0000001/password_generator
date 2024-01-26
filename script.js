let inputSlider=document.querySelector('#data-lengthSlider');
let lengthDisplay=document.querySelector('#data-lenghtNumber');
let passwordDisplay=document.querySelector('#data-passwordDisplay');
let copyBtn=document.querySelector('#data-copy');
let copyMsg=document.querySelector('#data-copyMsg');
let uppercaseCheck=document.querySelector('#uppercase');
let lowercaseCheck=document.querySelector('#lowercase');
let numbersCheck=document.querySelector('#numbers');
let symbolsCheck=document.querySelector('#symbol');
let indicator=document.querySelector('#data-indicator');
let generateBtn=document.querySelector('.generateButton');
let allcheckBox=document.querySelectorAll('input[type=checkbox]');


let symbols= '~`!@#$%^&*()-_+={[}]|\;:",<.>/?';
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // setting color till the thumb of the slider
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=[(passwordLength-min)*100/(max-min)]+ "% 100%";
}

function setIndicator(){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}
function generateSymbol(){
    const randNum= getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym= false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await mavigator.clipboard.writetext(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    // to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length -1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el) => (str+=el));
    return str;
}
 
function handleCheckBoxChange(){
    checkCount = 0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })
    // checkcount more than password length
    if(passwordLength<checkCount)
        passwordLength=checkCount;

}

allcheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
        copyContent();
})  

generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount<=0) return ;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // create new password

    // remove old password
    password="";
    // put checkboxes value
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase); 
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase); 
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber); 
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol); 
    }

    // compulsary addition
    for(let i=0;i<funcArr.length; i++){
        password+=funcArr[i]();
    } 
    // remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password+=funcArr[randIndex]();
    }
    // shuffle password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // camculate strength
    calcStrength();

});