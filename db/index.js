const Pool = require('pg').Pool
const validUrl = require('valid-url');
const shortid = require('shortid');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shortly',
  password: 'postgres',
  port: 5432,
})


const getUrlByCode = (req, res) => {
  const { code } = req.params
  const query = {
    text: 'SELECT * FROM urls WHERE code = $1',
    values: [code],
  }
  pool.query(query, (error, results) => {
    if (error) throw error
    return res.json(results.rows)
  })
}

const shortlyCode = (req, res) => {
  const { longUrl } = req.body
  const baseUrl = process.env.BASEURL
  // Check base url
  if (!validUrl.isUri(baseUrl))
    return res.status(401).json('Invalid base url');
  // Create url code
  const code = shortid.generate();
  const shortUrl = baseUrl + '/' + code
  // Check long url
  if (validUrl.isUri(longUrl)) {
    const selectQuery = { text: 'SELECT * FROM urls WHERE longurl = $1', values: [longUrl] }
    pool.query(selectQuery, (error, results) => {
      if (error) throw error
      // Check LongUrl if available on the database and return it
      if (results.rows.length > 0)
        return res.json(results.rows)
      // Else Create a new url save it to database and return it
      else {
        const createQuery = {
          text: 'INSERT INTO urls(longurl, shorturl, code) VALUES($1, $2, $3) RETURNING *',
          values: [longUrl, shortUrl, code]
        }
        pool.query(createQuery, (error, results) => {
          if (error) throw error
          return res.json(results.rows)
        })
      }
    })
  } else {
    res.status(401).json('Invalid long url');
  }
}

module.exports = { getUrlByCode, shortlyCode }