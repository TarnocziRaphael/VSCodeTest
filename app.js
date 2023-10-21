const mysql = require('mysql');
const express = require('express'); // Express hinzufügen
const app = express(); // Neue Express-Anwendung erstellen
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.set('json spaces', 3);


const connection = mysql.createConnection({
  host: 'projekte.tgm.ac.at',
  user: 'proj_quizit',
  password: 'ijie4Fae',
  database: 'proj_quizit',
  port: 3306
});



// GET-Listener hinzufügen
app.get('/insertUser/:username/:jahrgang', (req, res) => {
  // Benutzername und Jahrgang aus den URL-Parametern holen
  const username = req.params.username;
  const jahrgang = req.params.jahrgang;

  // SQL-Befehl für die Einfügung mit den dynamischen Werten
  const sqlQuery = "INSERT INTO user (user_name, user_year) VALUES (?, ?)";

  connection.query(sqlQuery, [username, jahrgang], (error, results) => {
    if (error) {
      console.error('Fehler beim Einfügen von Daten: ' + error.message);
      res.status(500).send('Fehler beim Einfügen von Daten');
    } else {
      console.log('Daten erfolgreich eingefügt.');
      res.status(200).send('Daten erfolgreich eingefügt');
    }
  });
});

app.get('/getUser', (req, res) => {
  // SQL-Befehl für die Abfrage
  const sqlQuery = "SELECT * FROM user ORDER BY user_year DESC";

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Fehler beim Ausführen der Abfrage: ' + error.message);
      res.status(500).send('Fehler beim Ausführen der Abfrage');
    } else {
      console.log('Abfrage erfolgreich ausgeführt.');
      // Ergebnisse als JSON an die Ausgabeseite senden
      res.status(200).json(results);
    }
  });
});
app.get('/getFaecher/:username', (req, res) => {
  // Benutzername aus dem URL-Parameter holen
  const username = req.params.username;

  // SQL-Befehl für die Abfrage mit dem dynamischen Benutzernamen
  const sqlQuery = `SELECT f.* FROM faecher f JOIN schwerpunkte s ON f.fach_name = s.fach_name JOIN user u ON s.schwerpunkt_year = u.user_year WHERE u.user_name = ? AND EXISTS ( SELECT 1 FROM fragen WHERE fragen.schwerpunkt_id = s.schwerpunkt_id) ORDER BY s.schwerpunkt_name DESC`;

  connection.query(sqlQuery, [username], (error, results) => {
    if (error) {
      console.error('Fehler beim Ausführen der Abfrage: ' + error.message);
      res.status(500).send('Fehler beim Ausführen der Abfrage');
    } else {
      console.log('Abfrage erfolgreich ausgeführt.');
      // Ergebnisse als JSON an die Ausgabeseite senden
      res.status(200).json(results);
    }
  });
});
app.get('/getSchwerpunkte/:fach', (req, res) => {
  // Fach aus dem URL-Parameter holen
  const fach = req.params.fach;

  // SQL-Befehl für die Abfrage mit dem dynamischen Fach
  const sqlQuery = `SELECT schwerpunkte.* FROM schwerpunkte JOIN faecher ON schwerpunkte.fach_name = faecher.fach_name WHERE faecher.fach_name = ?`;
  connection.query(sqlQuery, [fach], (error, results) => {
    if (error) {
      console.error('Fehler beim Ausführen der Abfrage: ' + error.message);
      res.status(500).send('Fehler beim Ausführen der Abfrage');
    } else {
      console.log('Abfrage erfolgreich ausgeführt.');
      // Ergebnisse als JSON an die Ausgabeseite senden
      res.status(200).json(results);
    }
  });
});
app.get('/getFragen/:schwerpunkt', (req, res) => {
  // Schwerpunkt aus dem URL-Parameter holen
  const schwerpunkt = req.params.schwerpunkt;

  // SQL-Befehl für die Abfrage mit dem dynamischen Schwerpunkt
  const sqlQuery = `SELECT fragen.* FROM fragen JOIN schwerpunkte ON fragen.schwerpunkt_id = schwerpunkte.schwerpunkt_id WHERE schwerpunkte.schwerpunkt_name = ? ORDER BY fragen.frage_id DESC`;
  connection.query(sqlQuery, [schwerpunkt], (error, results) => {
    if (error) {
      console.error('Fehler beim Ausführen der Abfrage: ' + error.message);
      res.status(500).send('Fehler beim Ausführen der Abfrage');
    } else {
      console.log('Abfrage erfolgreich ausgeführt.');
      // Ergebnisse als JSON an die Ausgabeseite senden
      res.status(200).json(results);
    }
  });
});
app.get('/deleteUser/:username', (req, res) => {
  // Username aus dem URL-Parameter holen
  const username = req.params.username;

  // SQL-Befehl für die Abfrage mit dem dynamischen Schwerpunkt
  const sqlQuery = `DELETE FROM user WHERE user_name = ?`;
  connection.query(sqlQuery, [username], (error, results) => {
    if (error) {
      console.error('Fehler beim Ausführen der Abfrage: ' + error.message);
      res.status(500).send('Fehler beim Ausführen der Abfrage');
    } else {
      console.log('Abfrage erfolgreich ausgeführt.');
      // Ergebnisse als JSON an die Ausgabeseite senden
      res.status(200).json('User erfolgreich entfernt.');
    }
  });
});


app.post('/tenzi', (req, res) => {
    const jsonData = req.body; // Hier wird der gesamte JSON-Request-Body analysiert
  
    const klasse = jsonData.klasse;
  
    console.log(klasse);
  });

// 404-Handler hinzufügen
app.use((req, res) => {
  res.status(404).send('404 - Fehler');
});

// Server starten
const port = 8080;
app.listen(port, () => {
  console.log('Server läuft auf Port ' + port);
});
