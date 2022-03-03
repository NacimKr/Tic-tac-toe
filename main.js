const RondCroixJoueur = document.querySelector('#joueur');
const ModeJoueur = document.querySelector('#joueur-mode');
const btnCommencerPartie = document.querySelector('input[type="button"]');
const selectBloc = document.querySelector('.select');
const blocJeu = document.querySelector('.container-grid');
const info = document.querySelector('.info');
let interval

let finDePartie = false;

let obj = {
    joueur : "",
    mode : ""
};

RondCroixJoueur.addEventListener('click',(e)=>{
    obj.joueur = e.target.value
})

ModeJoueur.addEventListener('click',(e)=>{
    obj.mode = e.target.value
})

btnCommencerPartie.addEventListener('click',()=>{
    if(obj.joueur === "" || obj.mode === ""){
        alert('Oooh')
    }else{
        selectBloc.style.display="none";
        blocJeu.style.display="grid";
        info.style.display="block";
    }
})

const allCase = document.querySelectorAll('.case');
let pasTerminé = false;
let jeuTableau = ["","","","","","","","",""]
const alignementsGagnants = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

allCase.forEach(cases => {
    cases.addEventListener('click', clickSurCase)
});


function caseAleatoire(joueur){
    let tab = []
    for(let i=0; i<jeuTableau.length; i++){
        if(jeuTableau[i] !== "X" && jeuTableau[i] !== "O"){
            tab.push(i)
        }
    }
    let randomArr = tab[Math.floor(Math.random()*tab.length)]
    jeuTableau[randomArr] = joueur;
    console.log("le random est "+randomArr)
    return randomArr
}

function randomCase(joueur,joueur2,random){
    if(!pasTerminé){
        setTimeout(()=>{
            allCase[random].innerHTML = "<span style='filter:drop-shadow(5px 0px 5px black); color:royalblue;'>"+joueur+"</span>";
            info.innerText = "Au tour du joueur "+joueur2;
        },500);
    }
}

function modale(str){
    let divGagnant = document.createElement('div');
    divGagnant.setAttribute('class',"gagnant-alerte");

    let titreGagnant = document.createElement('h3');
    titreGagnant.innerText = str;
    titreGagnant.setAttribute('class','titre-gagnant');
    divGagnant.append(titreGagnant);
    
    
    let butttonRecommencer = document.createElement('button');
    butttonRecommencer.innerText = "Recommencer la partie";
    butttonRecommencer.classList.add('button');
    divGagnant.append(butttonRecommencer);
    
    blocJeu.style.display="none";
    info.style.display="none";
    
    butttonRecommencer.addEventListener('click',()=>{
        document.location.reload();
    })
    
    document.querySelector('.title').style.filter="blur(10px)";
    document.body.append(divGagnant);
}

function clickSurCase(){
    
    let indexTab = this.getAttribute('data-index');

    if(this.innerHTML !== ""){
        return;
    }else if(obj.joueur === "Croix" && obj.mode === "2-joueurs" && !finDePartie && !pasTerminé){

        this.innerHTML = "<span style='filter:drop-shadow(5px 0px 5px black); color:royalblue;'>X</span>";
        jeuTableau[indexTab] = "X";
        info.innerText = "Au tour du joueur O";
        changementJoueur();

    }else if(obj.joueur === "Rond" && obj.mode === "2-joueurs" && !finDePartie && !pasTerminé){

        this.innerHTML = "<span style='filter:drop-shadow(5px 0px 5px black); color:firebrick;'>O</span>";
        jeuTableau[indexTab] = "O";
        info.innerText = "Au tour du joueur X";
        changementJoueur();

    }else if(obj.joueur === "Rond" && obj.mode === "ordinateur" && !finDePartie && !pasTerminé){

        this.innerHTML = "<span style='filter:drop-shadow(5px 0px 5px black); color:firebrick;'>O</span>";
        jeuTableau[indexTab] = "O";
        info.innerText = "Au tour du joueur X";
        
        interval = randomCase("X","O",caseAleatoire("X"));
        //validationResultats();

    }else if(obj.joueur === "Croix" && obj.mode === "ordinateur" && !finDePartie && !pasTerminé){

        this.innerHTML = "<span style='filter:drop-shadow(5px 0px 5px black); color:firebrick;'>X</span>";
        jeuTableau[indexTab] = "X";
        info.innerText = "Au tour du joueur O";
        
        interval = randomCase("O","X",caseAleatoire("O"));
    }
    validationResultats();
    console.log(jeuTableau);
}

function validationResultats(){

    for(let i = 0; i < alignementsGagnants.length; i++ ){
        const checkWin = alignementsGagnants[i];
        let a = jeuTableau[checkWin[0]];
        let b = jeuTableau[checkWin[1]];
        let c = jeuTableau[checkWin[2]];

        if(a === '' || b === '' || c === ''){
            continue;
        }
        if(a === b && b === c){
            pasTerminé = true;
            break;
        }
    }

    if(pasTerminé){
        info.innerText = "Le joueur "+ changementJoueur()+ " a gagné !";
        verouillage = false;
        clearTimeout(interval);
        allCase.forEach(cases=>{
            cases.removeEventListener('click',clickSurCase);
        });

        setTimeout(()=>{
            modale("Le joueur "+changementJoueur()+" gagne cet partie")
        },600);
        }

        let matchNul = !jeuTableau.includes('');
        if(matchNul){
            info.innerText = "Match Nul !";
            setTimeout(()=>{
                modale("Match Nul !")
            },600);
            pasTerminé = true;
            return;
        }
}

//permet de changer de joueur simultanément
function changementJoueur(){
    let player = obj.joueur === "Croix" ? obj.joueur = "Rond" : obj.joueur = "Croix";
    return player;
}