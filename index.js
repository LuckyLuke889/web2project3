class Player {                      //Ovdje definiramo klasu Player koja predstavlja igrača
    constructor(context, x, y, size) {  //Konstruktor prima objekt context, početnu koordinatu (x,y) i veličinu igrača
      this.context = context;           
      this.x = x;
      this.y = y;
      this.size = size;
    }
  
    drawPlayer() {
      const shadowColor = 'rgba(0, 0, 0.2, 0.7)';  //Ovdje se postavljaju nijanse sive u sjeni igrača
      this.context.shadowColor = shadowColor; 
      this.context.shadowBlur = 15;   //Zamućenje sjene igrača
  
      this.context.fillStyle = 'red';   //Ovime se kvadrat koji predstavlja igrača boji u crveno 
      this.context.fillRect(this.x, this.y, this.size, this.size); //Crveni kvadrat veličine size se iscrtava na poziciji x,y
  
      this.context.shadowColor = 'transparent';
      this.context.shadowBlur = 0;
    }
  
    move(event) {
      const speed = 35; //predefinirana maksimalna brzina kojom se igrač može kretati
  
      switch (event.key) {
        case 'ArrowUp':  //U slučaju da onaj koji igra igricu pritisne strelicu prema gore na tipkovnici, igrač ide gore
          this.y = (this.y - speed + canvas.height) % canvas.height;
          break;
        case 'ArrowDown': //U slučaju da onaj koji igra igricu pritisne strelicu prema dolje na tipkovnici, igrač ide dolje
          this.y = (this.y + speed) % canvas.height;
          break;
        case 'ArrowLeft': //U slučaju da onaj koji igra igricu pritisne strelicu prema lijevo na tipkovnici, igrač ide lijevo
          this.x = (this.x - speed + canvas.width) % canvas.width;
          break;
        case 'ArrowRight': //U slučaju da onaj koji igra igricu pritisne strelicu prema desno na tipkovnici, igrač ide desno
          this.x = (this.x + speed) % canvas.width;
          break;
      }
  
      this.drawPlayer();
    }
  }
  
  class Asteroid { //U konstruktoru klase Asteroid se postavljaju parametri asteroida
    constructor() { //Njegova veličina, boja, brzina i kut kretanja generiraju se kao slučajni brojevi u predefiniranim intervalima
      this.size = Math.floor(Math.random() * (70 - 20 + 1)) + 20 ;
      this.color = this.getRandomGrayColor();
      this.speed = Math.random() * 5 + 1;
      this.angle = Math.random() * 2 * Math.PI; // Nasumični kut u radijanima
      this.initialX = 0;
      this.initialY = 0;
      this.spawnOutsideCanvas(); //Poziv funkcije koja će omogućiti da asteroid inicijalno bude postavljen izvan canvasa u koji ulazi nakon što je njegov objekt nacrtan
    }

    getRandomGrayColor() {
      const grayValue = Math.floor(Math.random() * 256); // Generiranje nasumične vrijednosti sive boje 
      return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    }
  
    spawnOutsideCanvas() {
        const side = Math.floor(Math.random() * 4); //Ovime se slučajno izabire jedna od četiri strane canvasa u koju će asteroid biti postavljen
      
        switch (side) {
          case 0: // Gornja strana canvasa
            this.x = Math.random() * canvas.width;
            this.y = -this.size / 2;
            break;
          case 1: // Desna strana canvasa
            this.x = canvas.width + this.size / 2;
            this.y = Math.random() * canvas.height;
            break;
          case 2: // Donja strana canvasa
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + this.size / 2;
            break;
          case 3: // Lijeva strana canvasa
            this.x = -this.size / 2;
            this.y = Math.random() * canvas.height;
            break;
        }
      
        //Ovdje se koordinate asteroida, koje su inicijalno (0,0), postavljaju na slučajno odabrane vrijednosti
        this.initialX = this.x;
        this.initialY = this.y;
      }
  
    drawAsteroid(context) { //Ovdje se asteroid iscrtava
      context.shadowColor = 'rgba(0, 0, 0.2, 0.7)'; //Za boju sjene se izabire siva
      context.shadowBlur = 15;  //Zamućenje sjene
      context.fillStyle = this.color;
      context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); //Dodavanje koordinata i veličine sivog kvadrata
      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
    }
  
    moveAsteroid() {//Asteroid se kreće pod određenim kutom koji je nasumično odabran u konstruktoru
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
  
      // Ovdje ćemo pratiti kut asteroida da bismo mogli osigurati istu putanju
      if (this.x < -this.size / 2) {
        this.x = canvas.width + this.size / 2;
      } else if (this.x > canvas.width + this.size / 2) {
        this.x = -this.size / 2;
      }
  
      if (this.y < -this.size / 2) {
        this.y = canvas.height + this.size / 2;
      } else if (this.y > canvas.height + this.size / 2) {
        this.y = -this.size / 2;
      }
    }
  }  

  function checkCollision(player, asteroid) { //Služi za detekciju sudara asteroida i igrača
    const distanceX = Math.abs(player.x - asteroid.x);
    const distanceY = Math.abs(player.y - asteroid.y);
    const arg1 = distanceX < player.size / 2 + asteroid.size / 2
    const arg2 = distanceY < player.size / 2 + asteroid.size / 2
  
    // Ako je udaljenost između asteroida i igrača manja od polovice zbroja njihovih veličina, dolazi do kolizije
    return (arg1 && arg2);
  }

  function drawDigitalClock(context) {

    context.font = 'bold 16px Arial'; //Ovdje definiramo veličinu debljinu i font zapisa trenutnog i najboljeg vremena
    //context.fillStyle = 'white'; 
  
    //Ovdje bilježimo vrijeme od učitavanja stranice
    const now = new Date();
    const elapsedMilliseconds = now - startTime;
  
    //Računamo minute, sekunde i milisekunde od početka igre
    const minutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedMilliseconds % (1000 * 60)) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor(elapsedMilliseconds % 1000).toString().padStart(3, '0');


    const bestTime = localStorage.getItem('Best time:')  //Iz localstoragea dohvaćamo do sada najbolji rezultat koji je inicijalno postavljen na 00:00:00
    // Digitalni sat iscrtavamo u gornji desni kut canvasa
    context.fillStyle = 'black'; //Crna boja teksta koji prikazuje vrijeme i najbolje vrijeme
    context.fillText(`Time: ${minutes}:${seconds}:${milliseconds}`, canvas.width - 190, 30); //Prikaz trenutnog vremena
    context.fillText(`Best time: ${bestTime}`, canvas.width - 190, 50) //Prikaz najboljeg vremena
  }

  let canvas = document.querySelector('canvas')  //Stvaranje canvas objekta
  let context = canvas.getContext('2d'); //Stvaranje context objekta za manipulacija nad canvasom

  if(!sessionStorage.getItem('Best time:')){   //Da se ne bi svaki puta kada osvježimo stranicu najbolji rezultat postavio na 00:00:00, koristit ćemo i sesssionStorage
    localStorage.setItem('Best time:', '00:00:00'); //te ćemo samo na početku, kada igra kreće po prvi put u localStorage upisati 00:00:00 
  }
  //Ovime se canvas proširuje preko čitavog prozora web aplikacije
  canvas.width = window.innerWidth;  
  canvas.height = window.innerHeight;
  
  // Stvaranje polja asteroida
  var asteroids = [];
  for (let i = 0; i < 10; i++) {
    asteroids.push(new Asteroid())
  }
  
  const player = new Player(context, canvas.width / 2, canvas.height / 2, 50); //Stvaranje jednog igrača
  
  function startGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Pomiči i crtaj svaki asteroid

    // Crtaj igrača
    player.drawPlayer();
    
    for (var i = 0; i < asteroids.length; i++) {
            asteroids[i].moveAsteroid();
            asteroids[i].drawAsteroid(context);

        if (checkCollision(player, asteroids[i])) { //Provjera kolizije u svakom trenutku
            const now = new Date();
            const elapsedMilliseconds = now - startTime;
            //Uzimamo i pospremamo u variajble minute, sekunde i milisekunde zapisane u digitalnom satu
            const minutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const seconds = Math.floor((elapsedMilliseconds % (1000 * 60)) / 1000).toString().padStart(2, '0');
            const milliseconds = Math.floor(elapsedMilliseconds % 1000).toString().padStart(3, '0');

            let current = new Date(0,0,0,0, parseInt(minutes), parseInt(seconds), parseInt(milliseconds))
            const bestTime = localStorage.getItem('Best time:')
            let bestArray = bestTime.split(":")

            let bestInDate = new Date(0,0,0,0,parseInt(bestArray[0]), parseInt(bestArray[1]), parseInt(bestArray[2]))

            //Kada dođe do kolizije, uspoređujemo trenutno i najbolje vrijeme; Ako je trenutno vrijeme bolje od najboljeg vremena,
            if(current > bestInDate){ //onda najbolje vrijeme postaje trenutno vrijeme
              const bestTime = minutes + ":" + seconds + ":" + milliseconds
              sessionStorage.setItem('Best time:', bestTime);
              localStorage.setItem('Best time:', bestTime);
            }


            //Na kraju se ozvježava stranica i igra može početi iznova
            location.reload();
        }
    }

    drawDigitalClock(context) //Iscravanje trenutnog i najboljeg vremena u obliku digitalnog sata
  
    // Ponovno pozovi animaciju igre
    requestAnimationFrame(startGame);
  }
  
  // Dodaj event listener koji prati kada osoba koja igra igricu dodiruje tipkovnicu čime se omogućuje kretanje igrača (crvenog kvadrata)
  window.addEventListener('keydown', (event) => player.move(event));
  
  // Set the start time when the page is loaded
  const startTime = new Date();

  // Pokreni igru, iscrtaj igrača i asteroide i omogući im kretnju
  startGame();
  