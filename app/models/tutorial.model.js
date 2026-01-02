/**
 * tutorial.model.js
 * WRITE  -> Primary DB
 * READ   -> Read Replica
 */

const { writeDB, readDB } = require("./db.js");

// constructor
const Tutorial = function(tutorial) {
  this.title = tutorial.title;
  this.description = tutorial.description;
  this.published = tutorial.published;
};

/**
 * CREATE -> WRITE -> PRIMARY DB
 */
Tutorial.create = (newTutorial, result) => {
  writeDB.query(
    "INSERT INTO tutorials SET ?",
    newTutorial,
    (err, res) => {
      if (err) {
        console.log("error (PRIMARY): ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newTutorial });
    }
  );
};

/**
 * FIND BY ID -> READ -> READ REPLICA
 */
Tutorial.findById = (id, result) => {
  readDB.query(
    "SELECT * FROM tutorials WHERE id = ?",
    [id],
    (err, res) => {
      if (err) {
        console.log("error (REPLICA): ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      result({ kind: "not_found" }, null);
    }
  );
};

/**
 * FIND ALL -> READ -> READ REPLICA
 */
Tutorial.getAll = (title, result) => {
  let query = "SELECT * FROM tutorials";
  let params = [];

  if (title) {
    query += " WHERE title LIKE ?";
    params.push(`%${title}%`);
  }

  readDB.query(query, params, (err, res) => {
    if (err) {
      console.log("error (REPLICA): ", err);
      result(err, null);
      return;
    }

    result(null, res);
  });
};

/**
 * FIND ALL PUBLISHED -> READ -> READ REPLICA
 */
Tutorial.getAllPublished = result => {
  readDB.query(
    "SELECT * FROM tutorials WHERE published = true",
    (err, res) => {
      if (err) {
        console.log("error (REPLICA): ", err);
        result(err, null);
        return;
      }

      result(null, res);
    }
  );
};

/**
 * UPDATE -> WRITE -> PRIMARY DB
 */
Tutorial.updateById = (id, tutorial, result) => {
  writeDB.query(
    "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
    [tutorial.title, tutorial.description, tutorial.published, id],
    (err, res) => {
      if (err) {
        console.log("error (PRIMARY): ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...tutorial });
    }
  );
};

/**
 * DELETE -> WRITE -> PRIMARY DB
 */
Tutorial.remove = (id, result) => {
  writeDB.query(
    "DELETE FROM tutorials WHERE id = ?",
    [id],
    (err, res) => {
      if (err) {
        console.log("error (PRIMARY): ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res);
    }
  );
};

/**
 * DELETE ALL -> WRITE -> PRIMARY DB
 */
Tutorial.removeAll = result => {
  writeDB.query(
    "DELETE FROM tutorials",
    (err, res) => {
      if (err) {
        console.log("error (PRIMARY): ", err);
        result(err, null);
        return;
      }

      result(null, res);
    }
  );
};

module.exports = Tutorial;
