import * as THREE from 'three'
import * as CANNON from 'cannon-es'

window.focus()

let camera, scene, rendu
let monde
let derniereTemps
let pile
let surplombs
const hauteurBloc = 0.5
const tailleBlocOriginale = 3

function obtenirTailleBloc() {
    if (window.innerWidth < 480) {
        return 2.5
    } else if (window.innerWidth < 768) {
        return 2
    }
    return 1.5
}

let tailleBlocActuelle = obtenirTailleBloc()
let piloteAutomatique
let jeuTermine
let precisionRobot

const elementScore = document.getElementById('score')
const affichageScore = document.getElementById('score-display')
const elementResultats = document.getElementById('results')
const ecranChargement = document.getElementById('loading-screen')
const progressionChargement = document.querySelector('.loading-progress')
const messageChargement = document.querySelector('.loading-message')
const pourcentageChargement = document.querySelector('.loading-percentage')
const messageDebut = document.getElementById('start-message')
const elementScoreFinal = document.getElementById('final-score')
const elementMeilleurScore = document.getElementById('final-best-score')
const boutonRejouer = document.getElementById('replay-btn')

let meilleurScore = parseInt(localStorage.getItem('stackTowerBestScore')) || 0

const messagesChargement = [
    'Initialisation du moteur 3D...',
    'Chargement des textures...',
    'Configuration de la physique...',
    'Préparation de la scène...',
    'Optimisation des performances...',
    'Finalisation du chargement...'
]

demarrerChargement()
initialiserParticules()
function initialiserParticules() {
    creerParticulesJeu()
    creerParticulesFinJeu()
}

function creerParticulesJeu() {
    const conteneurParticulesJeu = document.getElementById('game-particles')
    if (!conteneurParticulesJeu) return
    
    const nombreParticules = 80
    const positions = genererPositionsAleatoires(nombreParticules)
    
    for (let i = 0; i < nombreParticules; i++) {
        const etoile = document.createElement('div')
        etoile.className = 'game-star'
        etoile.style.top = positions[i].top + '%'
        etoile.style.left = positions[i].left + '%'
        etoile.style.animationDelay = (i * 0.2) + 's'
        conteneurParticulesJeu.appendChild(etoile)
    }
}

function creerParticulesFinJeu() {
    const conteneurFinJeu = document.querySelector('.stars-background')
    if (!conteneurFinJeu) return
    
    const nombreParticules = 70
    const positions = genererPositionsAleatoires(nombreParticules)
    
    for (let i = 0; i < nombreParticules; i++) {
        const etoile = document.createElement('div')
        etoile.className = 'star'
        etoile.style.top = positions[i].top + '%'
        etoile.style.left = positions[i].left + '%'
        etoile.style.animationDelay = (i * 0.1) + 's'
        conteneurFinJeu.appendChild(etoile)
    }
}

function genererPositionsAleatoires(nombre) {
    const positions = []
    for (let i = 0; i < nombre; i++) {
        positions.push({
            top: Math.random() * 100,
            left: Math.random() * 100
        })
    }
    return positions
}

function demarrerChargement() {
    let progression = 0
    let indexMessage = 0
    
    function mettreAJourProgression() {
        progression += Math.random() * 15 + 5
        
        if (progression > 100) progression = 100
        
        if (progressionChargement) {
            progressionChargement.style.transform = `translateX(${progression - 100}%)`
        }
        
        if (pourcentageChargement) {
            pourcentageChargement.textContent = `${Math.round(progression)}%`
        }
        
        if (messageChargement && indexMessage < messagesChargement.length) {
            messageChargement.textContent = messagesChargement[indexMessage]
            indexMessage++
        }
        
        if (progression < 100) {
            setTimeout(mettreAJourProgression, 200 + Math.random() * 300)
        } else {
            setTimeout(() => {
                masquerEcranChargement()
                initialiser()
            }, 500)
        }
    }
    
    setTimeout(mettreAJourProgression, 500)
}

function masquerEcranChargement() {
    if (ecranChargement) {
        ecranChargement.classList.add('hidden')
        setTimeout(() => {
            ecranChargement.remove()
        }, 800)
    }
}

function mettreAJourScore() {
    const scoreActuel = Math.max(0, pile.length - 2)
    if (affichageScore) {
        affichageScore.textContent = scoreActuel
    }
    if (elementScore) {
        elementScore.innerText = scoreActuel
    }
}

function mettreAJourScoreApresPlacement() {
    const scoreActuel = Math.max(0, pile.length - 2)
    if (affichageScore) {
        affichageScore.textContent = scoreActuel
    }
    if (elementScore) {
        elementScore.innerText = scoreActuel
    }
}

function masquerMessageDebut() {
    if (messageDebut) {
        messageDebut.classList.add('hidden')
    }
}

function afficherFinJeu() {
    if (elementResultats) {
        elementResultats.style.display = 'flex'
        
        const scoreActuel = Math.max(0, pile.length - 2)
        if (elementScoreFinal) {
            elementScoreFinal.textContent = scoreActuel
        }
        
        if (scoreActuel > meilleurScore) {
            meilleurScore = scoreActuel
            localStorage.setItem('stackTowerBestScore', meilleurScore.toString())
        }
        
        if (elementMeilleurScore) {
            elementMeilleurScore.textContent = meilleurScore
        }
    }
}

if (boutonRejouer) {
    boutonRejouer.addEventListener('click', () => {
        reinitialiserJeu()
    })
}

function reinitialiserJeu() {
    if (elementResultats) elementResultats.style.display = 'none'
    
    piloteAutomatique = true
    jeuTermine = false
    derniereTemps = 0
    pile = []
    surplombs = []
    definirPrecisionRobot()

    if (monde) {
        while (monde.bodies.length > 0) {
            monde.removeBody(monde.bodies[0])
        }
    }
    
    if (scene) {
        while (scene.children.find((c) => c.type == 'Mesh')) {
            const mesh = scene.children.find((c) => c.type == 'Mesh')
            scene.remove(mesh)
        }

    ajouterCouche(0, 0, tailleBlocActuelle, tailleBlocActuelle)
    ajouterCouche(-10, 0, tailleBlocActuelle, tailleBlocActuelle, 'x')
    }
    
    if (camera) {
        let distanceCamera = 7
        if (window.innerWidth < 768) {
            distanceCamera = 6
        }
        if (window.innerWidth < 480) {
            distanceCamera = 5
        }
        camera.position.set(distanceCamera, distanceCamera, distanceCamera)
        camera.lookAt(0, 0, 0)
    }
    
    if (elementScore) elementScore.innerText = 0
    mettreAJourScore()
    
    if (messageDebut) {
        messageDebut.classList.remove('hidden')
    }
}

function definirPrecisionRobot() {
    precisionRobot = Math.random() * 1 - 0.5
}

function initialiser() {
    piloteAutomatique = true
    jeuTermine = false
    derniereTemps = 0
    pile = []
    surplombs = []
    definirPrecisionRobot()

    monde = new CANNON.World()
    monde.gravity.set(0, -10, 0)
    monde.broadphase = new CANNON.NaiveBroadphase()
    monde.solver.iterations = 40

    const aspect = window.innerWidth / window.innerHeight
    
    // Ajuster la taille de la vue selon la taille de l'écran
    let largeur = 10
    if (window.innerWidth < 768) {
        largeur = 8 // Vue plus proche sur tablettes
    }
    if (window.innerWidth < 480) {
        largeur = 6 // Vue encore plus proche sur mobiles
    }
    
    const hauteur = largeur / aspect

    camera = new THREE.OrthographicCamera(
        largeur / -2,
        largeur / 2,
        hauteur / 2,
        hauteur / -2,
        0,
        100
    )
    
    // Ajuster la position de la caméra selon la taille de l'écran
    let distanceCamera = 7
    if (window.innerWidth < 768) {
        distanceCamera = 6
    }
    if (window.innerWidth < 480) {
        distanceCamera = 5
    }
    
    camera.position.set(distanceCamera, distanceCamera, distanceCamera)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()

    ajouterCouche(0, 0, tailleBlocActuelle, tailleBlocActuelle)

    ajouterCouche(-10, 0, tailleBlocActuelle, tailleBlocActuelle, 'x')

    const lumiereAmbiante = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(lumiereAmbiante)

    const lumiereDirectionnelle = new THREE.DirectionalLight(0xffffff, 0.6)
    lumiereDirectionnelle.position.set(10, 20, 0)
    scene.add(lumiereDirectionnelle)

    rendu = new THREE.WebGLRenderer({antialias: true, alpha: true})
    rendu.setSize(window.innerWidth, window.innerHeight)
    rendu.setClearColor(0x000000, 0) // Fond transparent
    rendu.setAnimationLoop(animer)
    rendu.setPixelRatio(window.devicePixelRatio)
    document.body.append(rendu.domElement)
    
    // Initialiser les styles responsive
    mettreAJourStylesResponsive()
}

function demarrerJeu() {
    piloteAutomatique = false
    jeuTermine = false
    derniereTemps = 0
    pile = []
    surplombs = []

    if (elementResultats) elementResultats.style.display = 'none'
    if (elementScore) elementScore.innerText = 0
    
    // Masquer le message de début
    masquerMessageDebut()
    
    // Mettre à jour le score
    mettreAJourScore()

    if (monde) {
        while (monde.bodies.length > 0) {
            monde.removeBody(monde.bodies[0])
        }
    }
    if (scene) {
        while (scene.children.find((c) => c.type == 'Mesh')) {
            const mesh = scene.children.find((c) => c.type == 'Mesh')
            scene.remove(mesh)
        }

    ajouterCouche(0, 0, tailleBlocActuelle, tailleBlocActuelle)
    ajouterCouche(-10, 0, tailleBlocActuelle, tailleBlocActuelle, 'x')
    }
    if (camera) {
        camera.position.set(7, 7, 7)
        camera.lookAt(0, 0, 0)
    }
}

function ajouterCouche(x, z, largeur, profondeur, direction) {
    const y = hauteurBloc * pile.length
    const couche = genererBloc(x, y, z, largeur, profondeur, false)
    couche.direction = direction
    pile.push(couche)
}

function ajouterSurplomb(x, z, largeur, profondeur) {
    const y = hauteurBloc * (pile.length - 1)
    const surplomb = genererBloc(x, y, z, largeur, profondeur, true)
    surplombs.push(surplomb)
}

function genererBloc(x, y, z, largeur, profondeur, tombe) {
    // Utiliser la taille adaptative actuelle pour les nouvelles plateformes
    const geometrie = new THREE.BoxGeometry(largeur, hauteurBloc, profondeur)
    // Système de couleurs par groupes de 10 plateformes
    const indexGroupe = Math.floor(pile.length / 10) // Groupe de 10 plateformes
    const positionDansGroupe = pile.length % 10 // Position dans le groupe (0-9)
    
    // Couleurs de base pour chaque groupe (couleurs vives et variées)
    const couleursGroupe = [
        [223, 229, 238], // Gris bleuté clair
        [255, 182, 193], // Rose clair
        [144, 238, 144], // Vert clair
        [255, 218, 185], // Pêche
        [221, 160, 221], // Violet clair
        [255, 228, 196], // Bisque
        [173, 216, 230], // Bleu clair
        [255, 192, 203], // Rose
        [152, 251, 152], // Vert menthe
        [255, 239, 213]  // Papaye
    ]
    
    // Sélectionner la couleur de base du groupe
    const couleurBase = couleursGroupe[indexGroupe % couleursGroupe.length]
    const baseR = couleurBase[0]
    const baseG = couleurBase[1]
    const baseB = couleurBase[2]
    
    // Variation progressive dans le groupe : chaque plateforme devient plus sombre
    const facteurAssombrissement = positionDansGroupe * 0.08 // 8% plus sombre par position dans le groupe
    const r = Math.max(0, baseR - (baseR * facteurAssombrissement))
    const g = Math.max(0, baseG - (baseG * facteurAssombrissement))
    const b = Math.max(0, baseB - (baseB * facteurAssombrissement))
    
    const couleur = new THREE.Color(r / 255, g / 255, b / 255)
    const materiau = new THREE.MeshLambertMaterial({color: couleur})
    const mesh = new THREE.Mesh(geometrie, materiau)
    mesh.position.set(x, y, z)
    scene.add(mesh)

    const forme = new CANNON.Box(
        new CANNON.Vec3(largeur / 2, hauteurBloc / 2, profondeur / 2)
    )
    let masse = tombe ? 5 : 0
    masse *= largeur / tailleBlocOriginale
    masse *= profondeur / tailleBlocOriginale
    const corps = new CANNON.Body({mass: masse, shape: forme})
    corps.position.set(x, y, z)
    monde.addBody(corps)

    return {
        threejs: mesh,
        cannonjs: corps,
        width: largeur,
        depth: profondeur
    }
}

function couperBloc(coucheSuperieure, chevauchement, taille, delta) {
    const direction = coucheSuperieure.direction
    const nouvelleLargeur = direction === 'x' ? chevauchement : coucheSuperieure.width
    const nouvelleProfondeur = direction === 'z' ? chevauchement : coucheSuperieure.depth

    coucheSuperieure.width = nouvelleLargeur
    coucheSuperieure.depth = nouvelleProfondeur

    coucheSuperieure.threejs.scale[direction] = chevauchement / taille
    coucheSuperieure.threejs.position[direction] -= delta / 2

    coucheSuperieure.cannonjs.position[direction] -= delta / 2

    const forme = new CANNON.Box(
        new CANNON.Vec3(nouvelleLargeur / 2, hauteurBloc / 2, nouvelleProfondeur / 2)
    )
    coucheSuperieure.cannonjs.shapes = []
    coucheSuperieure.cannonjs.addShape(forme)
}

window.addEventListener('mousedown', gererEvenement)
elementResultats.addEventListener('click', (event)=> {
    event.preventDefault()
    demarrerJeu()
})
window.addEventListener('keydown', (event) => {
    if (event.key == ' ' || event.key == 'Enter') {
        event.preventDefault()
        gererEvenement()
        return
    }
})

function gererEvenement() {
    if (piloteAutomatique) demarrerJeu()
    else diviserBlocEtSuivantSiChevauchement()
}

function diviserBlocEtSuivantSiChevauchement() {
    if (jeuTermine) return

    const coucheSuperieure = pile.at(-1)
    const couchePrecedente = pile.at(-2)
    const direction = coucheSuperieure.direction

    const taille = direction === 'x' ? coucheSuperieure.width : coucheSuperieure.depth
    const delta =
        coucheSuperieure.threejs.position[direction] -
        couchePrecedente.threejs.position[direction]
    const tailleSurplomb = Math.abs(delta)
    const chevauchement = taille - tailleSurplomb
    if (chevauchement > 0) {
        couperBloc(coucheSuperieure, chevauchement, taille, delta)

        const decalageSurplomb = (chevauchement / 2 + tailleSurplomb / 2) * Math.sign(delta)
        const surplombX =
            direction === 'x'
                ? coucheSuperieure.threejs.position.x + decalageSurplomb
                : coucheSuperieure.threejs.position.x
        const surplombZ =
            direction === 'z'
                ? coucheSuperieure.threejs.position.z + decalageSurplomb
                : coucheSuperieure.threejs.position.z
        const largeurSurplomb = direction === 'x' ? tailleSurplomb : coucheSuperieure.width
        const profondeurSurplomb = direction === 'z' ? tailleSurplomb : coucheSuperieure.depth

        ajouterSurplomb(surplombX, surplombZ, largeurSurplomb, profondeurSurplomb)

        const prochainX = direction === 'x' ? coucheSuperieure.threejs.position.x : -10
        const prochainZ = direction === 'z' ? coucheSuperieure.threejs.position.z : -10
        const nouvelleLargeur = coucheSuperieure.width
        const nouvelleProfondeur = coucheSuperieure.depth
        const prochaineDirection = direction === 'x' ? 'z' : 'x'

        ajouterCouche(prochainX, prochainZ, nouvelleLargeur, nouvelleProfondeur, prochaineDirection)
        
        // Mettre à jour le score après l'ajout du nouveau bloc
        mettreAJourScoreApresPlacement()
    } else {
        raterLaCible()
    }
}

function raterLaCible () {
    const coucheSuperieure = pile.at(-1)
    ajouterSurplomb(
        coucheSuperieure.threejs.position.x,
        coucheSuperieure.threejs.position.z,
        coucheSuperieure.width,
        coucheSuperieure.depth
    )
    monde.removeBody(coucheSuperieure.cannonjs)
    scene.remove(coucheSuperieure.threejs)

    jeuTermine = true
    if (!piloteAutomatique) {
        afficherFinJeu()
    }
}

function animer (temps) {
    if(derniereTemps) {
        const tempsEcoule = temps - derniereTemps
        const vitesse = 0.008

        const coucheSuperieure = pile.at(-1)
        const couchePrecedente = pile.at(-1)

        if(pile.length >= 2 && camera.position.y < hauteurBloc * pile.length + 6) {
            camera.position.y += vitesse * 10
        }

        const blocDoitBouger =
            !jeuTermine &&
            (!piloteAutomatique ||
                (piloteAutomatique &&
                coucheSuperieure.threejs.position[coucheSuperieure.direction] <
                    couchePrecedente.threejs.position[coucheSuperieure.direction] +
                        precisionRobot))
        if(blocDoitBouger) {
            coucheSuperieure.threejs.position[coucheSuperieure.direction] += vitesse * tempsEcoule
            coucheSuperieure.cannonjs.position[coucheSuperieure.direction] += vitesse * tempsEcoule

            if(coucheSuperieure.threejs.position[coucheSuperieure.direction] > 10) {
                raterLaCible()
            }
        } else {
            if(piloteAutomatique) {
                diviserBlocEtSuivantSiChevauchement()
                definirPrecisionRobot()
            }
        }

        mettreAJourPhysique(tempsEcoule)
        rendu.render(scene, camera)
    }
    derniereTemps = temps
}

function mettreAJourPhysique(tempsEcoule) {
    monde.step(tempsEcoule / 1000)

    surplombs.forEach((element)=> {
        element.threejs.position.copy(element.cannonjs.position)
        element.threejs.quaternion.copy(element.cannonjs.quaternion)
    })
}

window.addEventListener('resize', ()=> {
    const aspect = window.innerWidth / window.innerHeight
    
    // Ajuster la taille de la vue selon la taille de l'écran
    let largeur = 10
    if (window.innerWidth < 768) {
        largeur = 8 // Vue plus proche sur tablettes
    }
    if (window.innerWidth < 480) {
        largeur = 6 // Vue encore plus proche sur mobiles
    }
    
    const hauteur = largeur / aspect

    camera.left = largeur / -2
    camera.right = largeur / 2
    camera.top = hauteur / 2
    camera.bottom = hauteur / -2
    camera.updateProjectionMatrix()

    // Mettre à jour la taille des plateformes en temps réel
    const nouvelleTailleBloc = obtenirTailleBloc()
    if (nouvelleTailleBloc !== tailleBlocActuelle) {
        tailleBlocActuelle = nouvelleTailleBloc
        console.log(`Taille des plateformes mise à jour: ${tailleBlocActuelle}`)
    }
    
    // Mettre à jour les styles CSS en temps réel
    mettreAJourStylesResponsive()

    if (rendu) {
        rendu.setSize(window.innerWidth, window.innerHeight)
        rendu.render(scene, camera)
    }
})
// Fonction pour mettre à jour les styles CSS en temps réel
function mettreAJourStylesResponsive() {
    const affichageScore = document.getElementById('score-display')
    const messageDebut = document.getElementById('start-message')
    
    if (window.innerWidth < 480) {
        // Mobile
        if (affichageScore) {
            affichageScore.style.fontSize = '2rem'
            affichageScore.style.top = '15px'
        }
        if (messageDebut) {
            messageDebut.style.fontSize = '0.9rem'
            messageDebut.style.padding = '0 15px'
        }
    } else if (window.innerWidth < 768) {
        // Tablette
        if (affichageScore) {
            affichageScore.style.fontSize = '2.5rem'
            affichageScore.style.top = '20px'
        }
        if (messageDebut) {
            messageDebut.style.fontSize = '1rem'
            messageDebut.style.padding = '0 20px'
        }
    } else {
        // Desktop
        if (affichageScore) {
            affichageScore.style.fontSize = '3rem'
            affichageScore.style.top = '30px'
        }
        if (messageDebut) {
            messageDebut.style.fontSize = '1.2rem'
            messageDebut.style.padding = '0 30px'
        }
    }
}
