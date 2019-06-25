# Et grundlæggende administrations panel!

Det ville være rigtig godt, hvis man kunne administrere f.eks. kategorieren via formularer direkte i browseren.

Så det er næste mål, at få sat et minimalt administrations panel op, og samtidigt få trænet alle de teknikker vi har arbejdet med i dette projekt.

## Administrations funktioner

Det første vi skal vide, er hvad er det egentligt et administrations panel skal kunne?
Helt grundlæggende har vi behov for følgende:

- Se en liste af entiteter, med links til ret og slet ud for hver entitet.
- Have en formular så der kan indtastes data til oprettelse af en ny entitet.
- Vise en formular der er forudfyldt med entitetens data, når der klikkes på et ret link.
- Håndtere post data fra opret formularen.
- Håndtere post data fra rediger formularen.
- slette en entitet når der klikkes på slet linket.

Vi kan være lidt fikse, og benytte den samme formular til at oprette og rette, da det jo er de samme data og valideringer der er behov for.

## Administrations routes

Vi har brug for en samling nye routes. Helt specifikt har vi brug for 5 routes:

- GET /admin/categories
- POST /admin/categories
- GET /admin/categories/edit/:category_id
- POST /admin/categories/edit/:category_id
- GET /admin/categories/delete/:category_id

læg mærke til de to POST routes er magen til de to GET routes, det er med vilje, fordi så kan formularens action fjernes, og formularen submitter til den route-sti der blev benyttet til at indlæse formularen (enten opret eller rediger).

Her giver der rigtig god mening at oprette en ny route-fil, så det er lettere at overskue hvor administrationen af kategorierne foregår.

Så, opret en fil kaldet 'admin_categories.js' i routes mappen, og indsæt denne grundlæggende struktur:

```javascript
const mysql = require("../config/mysql");

module.exports = app => {

   // her placeres alle de routes administrations panelet har brug for 

};
```

I `app.js` filen skal vi huske at linke til den nye route fil. Find denne linje i `app.js`:

```javascript
require("./server/routes/routes.js")(app);
```

dubliker den og tilpas så det er `admin_categories.js` der peges på, resultatet bør se nogenlunde sådan her ud

```javascript
require("./server/routes/routes.js")(app);
require("./server/routes/admin_categories.js")(app);
```

Det er selvfølgelig muligt at oprette en undermappe til admin-routes, der er det vigtigt at sikre require stier peger på de korrekte filer!


## Administrations template

vi skal også have en `ejs` fil til præsentationen af administrations panelet, så opret en ny fil i `views` mappen, kaldet `admin_categories.ejs`

Måske det er en fordel at oprette en mappe til alle administrations filerne, det må du selv bestemme. I mine eksempler har jeg oprettet en.

Templaten skal indeholde en formular og en liste over kategorierne.

Formularen kunne se nogenlunde sådan her ud:

```html
<form method="post">
  <label>Titel</label>
  <input
    type="text"
    name="category_title"
    value="<%= typeof category != 'undefined' ? category.category_title : '' %>">
  <button>Gem</button>
</form>
```

og listen over kategorier kunne udskrives i en table, noget i denne stil:

```html
<table>
  <thead>
    <tr>
      <th>Actions</th>
      <th>Id</th>
      <th>Titel</th>
    </tr>
  </thead>

  <% if(typeof categories != 'undefined') { %>
  <tbody>
    <% categories.forEach(category => { %>
    <tr>
      <td>
        <a href="/admin/categories/edit/<%= category.category_id %>">Ret</a>
        <a
          href="/admin/categories/delete/<%= category.category_id %>"
          onclick="return confirm('Er du sikker på du vil slette?')">Slet</a>
      </td>
      <td><%= category.category_id %></td>
      <td><%= category.category_title %></td>
    </tr>
    <% }) %>
  </tbody>
  <% } %>
</table>
```

**Læg mærke til links og formular navne i eksemplerne**

## ROUTE - Vis alle kategorier

inde i `admin_categories.js` filen i routes mappen, oprettes den route som skal kunne vise kategori listen:

```javascript
app.get("/admin/categories", async (req, res, next) => {
  // her skal alle kategorier hentes og sendes til template filen.....
});
```

For at kunne vise alle kategorierne, skal vi stort set bare gøre som vi hele tiden har gjort, nemlig hente alle sammen og sende dem til template filen.

Så her giver det god mening at kopiere funktionen der henter alle kategorier, og genbruge den.

Du burde have alle de nødvendige dele, så sørg for at få vist alle kategorierne med links til ret og slet.

## ROUTE - Opret en kategori

Formularen skal kunne sende en ny titel til serveren, som så bliver oprettet i databasen.

Her kan vi benytte princippet fra kontakt formularen.

Men først skal der være en route der kan modtage formular-data:

```javascript
app.post("/admin/categories", async (req, res, next) => {
  // her skal vi modtage form data og indsætte det i databasen
  // send bruger tilbage til kategori admin listen
});
```

Funktionaliteten i den route, skal minde rigtig meget om det vi gjorde i modtag kontakt besked, så kig tilbage på det for at løse denne route.

Tænk indsamling af data, validering af data, indsættelse af data.

## ROUTE - Forudfyld en kategori ved rediger

Denne route skal bruges til at hente kategorien ud af databasen og forudfylde formularen. Så kan brugeren rette det der skal rettes og sende formular data tilbage til den næste route.

Først skal vi have oprette routen, som i øvrigt også skal hente alle kategorierne til listen...

```javascript
app.get("/admin/categories/edit/:category_id", async (req, res, next) => {
  // denne route skal hente både alle kategorier og den ene kategori
  // data skal sendes til template filen
});
```

Her skal vi benytte de teknikker vi har brugt til at hente og vise en specifik artikel på nyhedssiden. Samt en del af kontakt formularen, spedicikt der hvor der valideringen har fejlet, og kontaktformularen vises igen, forudfyldt med de modtagede data... men nu kommer data bare fra databasen istedet.

## ROUTE - gem det rettede data

Denne route benyttes til at modtage formularen fra rediger funktionen, og det kombinerer endpoint-parameter med formularens data, til at opdatere i databasen.

Først oprettes selve route funktionen:

```javascript
app.post("/admin/categories/edit/:category_id", async (req, res, next) => {
  // tag form data og parameter fra endpoint og opdater databasen
  // send bruger tilbage til kategori admin listen
});
```

Den SQL der skal til for at gemme ændringerne, skal vide hvilke felter der skal opdateres, samt det er vigtigt at fortælle hvilken record der skal opdateres. Strukturen ser sådan her ud:

```SQL
UPDATE tabelnavn SET felt1 = værdi1, felt2 = værdi2 WHERE felt3 = værdi3
```

Da vi benytter `mysql2` modulet til database kan vi skrive sætingen med `?` i stedet for værdierne.

```javascript
let [result] = await db.execute(
  `
      UPDATE categories 
      SET category_title = ?
      WHERE category_id = ?`,
  [category_title, category_id]
);
```

Eksemplet her forudsætter at både værdien fra formularen og parameteren fra endpoint er puttet i en variabel (og der er valideret!).

## ROUTE - Slet en kategori

Det sidste der mangler før vi har oprettet en fuld `CRUD` funktion, er at vi skal kunne slette en kategori.

Her skal vi bruge endnu en route:

```javascript
app.get("/admin/categories/delete/:category_id", async (req, res, next) => {
  // benyt endpoint parameter til at slette en kategori fra databasen
  // send bruger tilbage til kategori admin listen
});
```

For at slette records fra databasen benyttes SQL ordet `DELETE`. Her skal vi fortælle hvilken tabel der skal slettes fra, samt hvordan SQL skal finde det der skal slettes... typisk et `WHERE id = ?`

```SQL
DELETE FROM tabelnavn WHERE felt1 = værdi1
```

Det kan skrives lige som vi plejer, med `db.execute()` og den værdi vi har hentet fra endpoint parameteren
```javascript
let [result] = await db.execute('DELETE FROM categories WHERE category_id = ?', [category_id]);
```

Så er der et fuldt funktionelt `CRUD` **Create, Read, Update, Delete** panel. Det kan gøres mere lækkert med lidt styling og med fornuftige beskeder til brugeren om de handlinger der er udført.