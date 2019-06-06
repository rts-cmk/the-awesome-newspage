# Databaser

Indtil videre har vi arbejdet med statiske html koder, samt arrays sendt fra rout til template.

Det fungerer og man vil kunne komme langt med den tilgang, dog begrænser det indholdet til at være statiske data som bliver svære at ændre fremadrettet.

Heldigvis er der en løsning på det problem, nemlig at benytte en database.


Det smarte ved en database, er at vi stadig sender arrays fra route til template, præcis som vi har gjort ind til nu, men den data som gemmes i databasen vil kunne opdateres igennem en formular eller lign, så vores hjemmesider bliver nemmere at vedligeholde.

---

Vi benytter MySQL her, men der findes selvfølglig mange andre database løsninger, men MySQL er meget let at komme i gang med, derfor vælge vi denne. Samt at I jo allerede er kommet igang med MySQL.


# Terminolgi

Det er super vigtigt at have styr på hvad der er hvad, når vi skal skrive SQL sætninger, derfor lige en kort opsamling.


* Database - Dette er "beholderen" som indeholder alt data og struktur, dette vil typisk stå i en konfigurations fil.
* Tabel - en samling i databasen, dette kunne være `brugere`, `produkter`, `categories` eller lign som ligger inden i en database.
* Felt / kolonne - en tabel betår af felter, f.eks. et `id`, `pris` eller `titel`, dette svarer lidt til variabler, da det er igennem felterne selve værdierne findes.
* Datatype - alle felter er defineret med en bestemt datatype, f.eks. `int`, `varchar` eller `datetime`
* Række / record - en tabel indeholder `rækker`, det er her selve værdierne ligger, og de passer sammen med kolonnerne.

Database, tabel og felter kan navngives som man lyster, dog vil jeg anbefale at ma beslutter sig for om man vil skrive på dansk eller engelsk, og så holder sig konsekvent til det fremadrettet. Dog skal man lige være lidt varsom med at benytte andre tegn end `a-z` + `0-9` da det kan skabe problemer alt efter hvilken server man benytter.

Ligeledes vil jeg anbefale at man beslutter sig for om man benytter store eller små bogstaver, eller måske camelCase, eller underscores. Vær konsekvente i jeres navngivninger.

# PhpMyAdmin

For at kunne oprette og administrere databaser, kan vi benytte et system kaldet PhpMyAdmin, som ligger i de fleste serverløsninger som `XAMPP`, `WAMP` og `MAMP`. Sørg for at den server er startet, så du kan komme godt igang med database konceptet.

# Node og MySQL

For at kunne kommunikere med databasen fra vores node server, skal vi installer modulet `mysql2` som er et solidt modul der håndterer forbindelse og forespørgsler. Det er smart.

`npm install mysql2 --save` 

Derefter skal mysql2 have nogle forbindelses info så der kan forbindes til den korrekte database. Her ligger er en fil kaldt `./server/config/mysql.js` som indeholder det grundlæggende der skal til.

Det er meget muligt du er nødt til at rette på `pass` hvis din server ikke benytter kodeord, eller hvis du har defineret et andet kodeord. Det kan også være din mysql-server kører på en anden port end standard porten `3306`, husk det er IKKE express serveren vi starter på port `3000`, dette er noget helt andet og oplysingerne bør kunne findes i dokumentation for din serverpakke. *(xampp kører som standard på 3306)*

---

Vi skal også lige udføre et par enkelte ændringer i filen, da der er en nyere og bedre metode tilgængelig, nemlig at udnytte `promises`. det er ikke noget vi skal gå super meget i dybden med lige nu. 

Ret til så det er `mysql2/promise` der `requires`

Ret så der står `async` før `function` på linje 5

Ret så der står `await` lige efter return på linje 6.

Og ret de felter som skal rettes så der kan forbindes til din mysql server.

```javascript
const mysql = require('mysql2/promise'); // rettet: mysql2/promise

module.exports = {
   connect: async function () { // tilføjet: async
      return await mysql.createConnection({ // tilføjet: await
         host: 'localhost',
         user: 'root',
         password: 'root',
         port: '3306',
         database: 'the_awesome_newpage'
      });
   }
}
```


# Opret en database
For at trække data ud af databasen, skal vi ned i route filen, det er her det giver mening at hente data så vi kan sende det til template filen.

Men det kræver der er en database, og at den database har mindst en tabel, som indeholder mindst 1 felt og en række med data... ellers er det et tomt udtræk og der er intet at vise.

Opret en ny database kaldet `test_database`. nu skal vi huske at rette i forbindelses info til databasen!

I den nye database oprettes en tabel kaldet `products` (eller produkter hvis du vil skrive på dansk)

Og tabellen skal have 4 felter.
* product_id INT AI
* product_title VARCHAR 64
* product_price DECIMAL (8,2)
* product_description VARCHAR 2000


så skal der indsættes lidt data, så der er noget at trække ud, så smid 3-4 produkter ind i tabellen via phpmyadmins indsæt formular


# Route, træk data ud af databasen

For at kunne forbinde fra route filen, skal config filen indlæses i `routes.js` filen. Dette gøres som det aller første, så der skal indskydes en linje før `modules.exports` linjen.

`const mysql = require('../config/mysql');`

Derefter vil vi kunne forbinde til databasen inde i en route. 
Her opretter vi lige en ny test route så vi har helt styr på hvad der foregår.

```javascript
app.get('/database',  async (req,res,next)=>{
      let db = await mysql.connect();
      // udfør en (elelr flere) forespørgel(er)
      let [products] = await db.execute('SELECT * FROM products');
      // afslut forbindelsen til databasen
      db.end();

      res.send(products);
});
```

Hvis der ikke er opstået fejl undervejs, burde der være en håndfuld produkter i browservinduet når http://localhost:3000/database besøges

---

Opret en ny template fil, med en simpel grundlæggende html struktur. Send produkterne til den istedet for `res.send()` og løb igennem alle produkterne og udskriv dem i en html struktur. Eksempelvis som vist herunder.

```javascript
// inde i routen
res.render('products', {
   'products': products
});
```


```javascript
// i .ejs  filen
<% if(typeof products != 'undefined') { %>
   <% products.forEach(product => { %>
   <div>
      <h3><%= product.product_title %></h3>
      <p><%= product.product_description %></p>
      <span><%= product.product_price%> </span>
   </div>
   <% }); %>
<% } %>
```
Og så burde der meget gerne være en fin udskrift af produkterne.

# INNER JOIN

Hvis et produkt skal knyttes til en kategori, så kunne man sagtens tilføje et ekstra felt i produkt tabellen, som indeholder navnet på kategorien... men der risikerer man hurtigt at kategori navnene bliver skrevet/stavet uens, og så bliver det  svært at vedligeholde.

Her giver der bedre mening at oprette en ny tabel til kategorierne, og så skrive sin SQL query, så den knytter tabellerne sammen i udtrækket.

Det kaldes "JOIN" der er flere varianter, og vi vil se på `INNER JOIN` og `LEFT OUTER JOIN`.

Først skal vi have en tabel til kategorier:

* categories 
* category_id INT AI
* category_title VARCHAR 64

indsæt et par kategorier.


---

Nu skal vi få produkt tabellen til at pege ind på kategori tabellen, og det sker ved at oprette et felt mere i produkt tabellen: `fk_category_id` 

Formålet med dette felt, er at gemme det  tal kategorien har fået som id, så vi kan finde kategori data ud fra id.

Det bliver hurtigt lidt svært at huske hvad de forskellige id'er repræsenterer når man sidder i indsæt eller rediger formularen, derfor vil jeg foreslå en lille opdatereing af tabellerne.

* sørg for at stå op `structure` visningen, så delt egenskaberne er synlige.
* klik på `relation view` knappen over tabel detaljerne.
* i dropdownlisten `choose column to return` vælges navnet eller title på entiteten.
* under produkt tabellens relation view, klikkes også på `internal relations` 
* ud for `fk_category_id` vælges `categories` tabellen og feltet `category_id`

nu vil det være muligt at vælge  kategorier fra en dropdownliste, frem for at skulle huske hvilke id'er der hører til hvad... det er nemt.

Sørg for at have  et par kategorier og sørg for at alle produkter peger ind  på en kategori igennem fk feltet.

---

Nu skal der trækkes ud fra begge kolonner  i en SQL sætning.

prøv at køre denne sql direkt i PhpMyAdmin SQL vinduet: 
`SELECT * FROM products INNER JOIN categories ON category_id = fk_category_id`

(kan være du skal erstatte tabel og felt navne med dine egne navne!)

resultatet burde gerne indeholde en record med både produkt og kategori data.

---

Prøv at rette en af produkterne så dens `fk_category_id` peger på noget der IKKE eksisterer i kategori tabellen, og kør den samme SQL sætning fra før.

Læg mærke til at det er tilladt at pege på noget der ikke findes, men ved INNER JOIN ignores hele produktet.


Det kan løses ved at rette `INNER JOIN` til `LEFT OUTER JOIN` i stedet, så kommer produkt data ud, men kategori felterne indeholder `NULL`.  

**Det kan anbefales altid at teste sine SQL sætninger med LEFT OUTER JOIN** så der i det mindste kommer noget ud fra databasen, selv om foreign keys skulle være forkerte.

---

Hvis du har 2 kolonner som hedder det samme, f.eks. `title` eller `id`, så kan SQL ikke finde ud af hvilken kolonne du mener, med mindre du omdøber kolonnen i udtrækket... det kaldes et `alias`.

```SQL
SELECT 
   products.id AS product_id, 
   categories.id AS category_id 
FROM
   products
INNER JOIN categories ON categories.id = fk_category_id
```
Denne SQL får to kolonner ud som i udskriften hedder noget andet end i databasen

Det er værd at beslutte om man ønsker at benytte alias eller om man sørger for at kalde felterne noget unikt. Begge løsninger er fine, det handler om ens egen præference. (jeg vil anbefale unikke navne, hvis man bliver lidt forvirret over alias)

*sørg for at trække alle produkter ud og udskriv alle informationer, inklusiv kategoriens navn* 

---

## næste opgave beskrivelse kommer når det er tid...



