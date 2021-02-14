const superTest = require('supertest')
const expect = require('chai').expect

const dotenv = require('dotenv')
dotenv.config()

const API_URL = process.env.API_URL
const OLD_JWT_FOR_TEST = process.env.OLD_JWT_FOR_TEST
const fetchAPI = superTest(API_URL)

let token

describe('POST /admin/user', () => {
  before('Delete The Previous Session Of Test If Exists', async () => {
    await fetchAPI
      .delete('/admin/user')
      .send('email=test@test.com')
  })

  it('Post A New User', async () => {
    const response = await fetchAPI
      .post('/admin/user')
      .send('email=test@test.com')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Success')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(201)
    expect(response.body.message, 'Message Check').to.equal('Response code 201 (User Created. He Needs His Token Before Use The Justify Route)')
  })

  it('Attempt To Post An Existing User', async () => {
    const response = await fetchAPI
      .post('/admin/user')
      .send('email=test@test.com')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (User Already Exist)')
  })
})

describe('POST /token', () => {

  it('Request A Token When No Token Has Already Been Assigned', async () => {
    const response = await fetchAPI
      .post('/token')
      .send('email=test@test.com')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Success')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(201)
    expect(response.body.message, 'Message Check').to.equal('Response code 201 (Token Created)')
    expect(response.body.token, 'Token Check').to.be.a('string')

    token = response.body.token
  })

  it('Request A Token When A Token Has Already Been Assigned', async () => {
    const response = await fetchAPI
      .post('/token')
      .send('email=test@test.com')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (A Token Has Already Been Generated For This User)')
  })
})

describe('POST /justify', () => {

  it('Justify "Bon matin"', async () => {
    const response = await fetchAPI
      .post('/justify')
      .set('Authorization', 'Bearer ' + token)
      .type('text/plain')
      .send('Bon matin')
      .then(response => {
        return response
      })
    expect(response.text, 'Text Check').to.equal('Bon matin                                                                       ')
  })

  it('Justify A Text That Contains A Word Longer Than 80 Characters', async () => {
    const response = await fetchAPI
      .post('/justify')
      .set('Authorization', 'Bearer ' + token)
      .type('text/plain')
      .send("UneFemmeAyantSurvécuVingt-deuxFoisÀLaFoudreGagneAuLotoPlusieursMillionsDeDollars. Un mot de 80 lettres n'existe pas en Français.")
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (A Word Is Larger Than 80 Characters)')
  })

  it('Justify A Text With An Old Token', async () => {
    const response = await fetchAPI
      .post('/justify')
      .set('Authorization', 'Bearer ' + OLD_JWT_FOR_TEST)
      .type('text/plain')
      .send('Bon matin')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (This Token Is Outdated. Please Send The Last Generated Token)')
  })

  it('Justify A Text With An Wrong Token', async () => {
    const response = await fetchAPI
      .post('/justify')
      .set('Authorization', 'Bearer obviouslyAWrongToken')
      .type('text/plain')
      .send('Bon matin')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (Invalid token)')
  })
})



describe('PATCH /admin/user/token', () => {

  it('Allow A User To Regenerate A Token', async () => {
    const response = await fetchAPI
      .patch('/admin/user/token')
      .send('email=test@test.com')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Success')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(200)
    expect(response.body.message, 'Message Check').to.equal('Response code 200 (User Can Request Another Token)')
  })

  it('Attempt To Reset The Token When It Has Already Been Reset', async () => {
    const response = await fetchAPI
      .patch('/admin/user/token')
      .send('email=test@test.com')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (User Can Already Request Another Token)')
  })

  it("Justify A Text When The User Hasn't A Token Assigned (After Resetting of Admin For Example)", async () => {
    const response = await fetchAPI
      .post('/justify')
      .set('Authorization', 'Bearer ' + token)
      .type('text/plain')
      .send('Bon matin')
      .then(response => {
        return response
      })
    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(403)
    expect(response.body.message, 'Message Check').to.equal('Response code 403 (An Administrator Has Reset Your Account. Please Request A New Token)')
  })
})

describe('DELETE /admin/user', () => {
  it('Delete A User', async () => {
    const response = await fetchAPI
      .delete('/admin/user')
      .send('email=test@test.com')
      .then(response => {
        return response
      })

    expect(response.body.status, 'Status Check').to.equal('Success')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(200)
    expect(response.body.message, 'Message Check').to.equal('Response code 200 (User Deleted)')
  })

  it("Trying To Remove A User That Doesn't Exist", async () => {
    const response = await fetchAPI
      .delete('/admin/user')
      .send('email=test@test.com')
      .then(response => {
        return response
      })

    expect(response.body.status, 'Status Check').to.equal('Error')
    expect(response.body.statusCode, 'StatusCode Check').to.equal(404)
    expect(response.body.message, 'Message Check').to.equal('Response code 404 (User Not Found)')
  })
})