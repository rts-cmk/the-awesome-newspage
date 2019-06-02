# Date And Time modulet

date-and-time modulet er et smart lille modul der gør det nemmere at formattere datoer.

Kør: `npm install date-and-time --save `

Så er modulet installeret og vi kan arbejde med det på server siden.


På nyhedssiden er der f.eks. et område med de senste poster  i hver kategori (i højre side). Der står et tidspunkt samt en dato for hver post `7:00 AM | April 14`
Det vil være en længere kodeblok vi skal skrive, bare for at kunne hive 'AM/PM' ud af datoen i vanilla javascript:
```javascript
// https://stackoverflow.com/a/8888498
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

console.log(formatAMPM(new Date));
```
Så det vil vi helst ikke! 

Heldigvis er det noget nemmere med date-and-time, for der er allerede skrevet en funktion som kan benyttes til formatteringen: 
```javascript
const date = require('date-and-time');
.
.
.
let now = new Date(); 
date.format(now, 'h:mm A | MMMM DD');
```

Dog er der en lille udfordring. Nemlig at date-and-time modulet indlæses enten i route-filen, eller i app.js filen... ikke i .ejs dokumentet.
For at gøre funktionen tilgængelig i .ejs filerne, skal vi tilføje lidt kode til `app` variablen i `app.js`.

```javascript
// husk: npm install date-and-time --save
app.locals.dateAndTime = require('date-and-time');
```

Nu vil det være muligt at skrive følgende kode i en .ejs fil: 
```javascript
<% let now = new Date('2019-04-14 07:00:14'); %>
<%= dateAndTime.format(now, 'h:mm A | MMMM DD') %>
```
Forslaget opretter en variabel kaldet `now` som derefter udskrives formatteret: `7:00 a.m. | April 14 `



Dog er formatteringen ikke helt i henhold til designet, for der skulle stå `AM` istedet for `a.m.`.
Og teksten er sandsynligtvis på engelsk frem for dansk, men det opdager vi først når måneden er en anden...

Dem der har skrevet date-and-time modulet, har gjort det forholdsvis let at skifte sprog, men desværre har de ikke tilføjet det danske sprog. Så vi skal benytte en anden tilgang, nemlig redefinere formatteringen for et par af reglerne.
```javascript
// npm install date-and-time --save
app.locals.dateAndTime = require('date-and-time');
app.locals.dateAndTime.locale('en');
app.locals.dateAndTime.setLocales('en', {
   'A': ['AM', 'PM'],
   'dddd': ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
   'ddd': ['søn', 'man', 'tirs', 'ons', 'tors', 'fre', 'lør'],
   'dd': ['sø', 'ma', 'ti', 'on', 'to', 'fr', 'lø'],
   'MMM': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
   'MMMM': ['januar', ' februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']
});
```
Det er selvfølgelig ikke helt optimalt at omdøbe de engelske definitioner, men det giver os muligheden for at få danske navne.

Alternativt kan man dykke ned i `node_modules` mappen og finde `date-and-time` modulet, og se hvad der ligger i `locale` mappen, det er muligt at kopiere en af filerne og oprette en `dk.js` med de danske ændringer. Dog skal man være klar over at det kun vil være tilgængelgit lokalt, og ændringen vil ikke være synlig på github. Så det er ikke en foretrukken løsning. 


## data-and-time i routes

Det vil være muligt at arbejde med `date-and-time` modulet på to måder nu.

Den ene er at `require()` modulet i toppen af `routes.js`, før `modules.exports`:
```javascript
const date = require('date-and-time');
module.exports = (app) => {
   app.get('/', (req, res, next) => {
      let now = new Date('2019-01-14 07:00:14');
      console.log(date.format(now, 'h:mm A | MMMM DD'));
   });
};
```

Eller, når nu vi har lagt modulet ind i `app.locals.dateAndTime`, så kan det benyttes direkte i routes 
```javascript
module.exports = (app) => {
   app.get('/', (req, res, next) => {
      let now = new Date('2019-01-14 07:00:14');
      console.log(app.locals.dateAndTime.format(now, 'h:mm A | MMMM DD'));
   });
};
```

Det er typisk `require()` metoden der foretrækkes når et modul skal være tilgængeligt i en server fil, men fordi vi har tilpasset modulets sproginstillinger, så er `app.locals` tilgangen den bedste lige ved dette modul.




## Opgaven

Sørg for at der sendes data fra route til alle siderne, dvs i hver `res.render()` funktion. Sørg for at data indeholder en `datetime` de steder hvor der skal være en dato.

I ejs filen benyttes `date-and-time` modulet til at formattere tiden som vist i det udleverede design.

på forsiden `home` er der 4 områder der indeholder datoer.

på `categories` er der 3 områder der skal formatteres via date-and-time

på `single-article` siden er der også 4 områder med datoer *(se bort fra svar på kommentarer, lad strukturen være en flad struktur her)*

på `about` og `contact` er der ingen områder med datoer

*(vi ser bort fra de to datoer i `mega menu`)*

