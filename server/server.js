const express = require("express");
const app = express();
const sql = require("mssql");

const serverConfig = {
  user: "hala0001",
  password: "newPassword2022",
  server: "hala0001-sql-server.database.windows.net",
  database: "cs-dsa-4513-sql-db",
  options: {
    encrypt: true,
  },
};

// get player data
const getPlayer = async (username) => {
  try {
    let pool = await sql.connect(serverConfig);
    let result = await pool
      .request()
      .input("username", sql.NVarChar(50), username)
      .query("SELECT highscore FROM Player WHERE username = @username");
    return result.recordset;
  } catch (err) {
    console.error(err);
  }
};

// verfiy user by fetching player data related to name and pass
const verifiedUser = async (username, password) => {
  try {
    let pool = await sql.connect(serverConfig);
    let result = await pool
      .request()
      .input("username", sql.NVarChar(50), username)
      .input("password", sql.NVarChar(50), password)
      .query(
        "SELECT * FROM Player WHERE username = @username AND password= @password"
      );
    return result.recordset.length > 0;
  } catch (err) {
    console.error(err);
    return false; 
  }
};

const setHighScore = async (username,highscore) =>{
  try {
    let pool = await sql.connect(serverConfig);
    await pool
      .request()
      .input("username", sql.NVarChar(50), username)
      .input("highscore", sql.Int, highscore)
      .query("UPDATE Player SET highscore = @highscore WHERE username = @username");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const createUser = async (username, password) => {
  try {
    let pool = await sql.connect(serverConfig);
    await pool
      .request()
      .input("username", sql.NVarChar(50), username)
      .input("password", sql.NVarChar(50), password)
      .query("INSERT INTO Player (username, password, highscore) VALUES (@username, @password, 0)");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// user clicks player stats button
app.get("/PlayerStatistics/:username", async (req, res) => {
  const username = req.params.username;
  res.json(await getPlayer(username));
});

// user creates account
app.get("/CreateAccount/:username/:password", async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  const acctCreated = await createUser(username, password);
  res.json(await acctCreated);
});

// user login when playing game
app.get("/PlayerLogin/:username/:password", async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  const isValidUser = await verifiedUser(username, password);
  res.json(await isValidUser);
});

// new high score
app.get("/setHighScore/:username/:score", async (req, res) => {
  const username = req.params.username;
  const newscore = req.params.score;
  const scoreSet = await setHighScore(username,newscore);
  res.json(await scoreSet);
});

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
