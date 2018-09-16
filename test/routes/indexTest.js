const app = require('../../app.js');
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
chai.use(require('chai-expected-cookie'));

 describe('GET /', function() {
  it('responds with status code 200 and renders "Cookbook"', function(done) {
    request(app)
      .get('/')
      .expect(function(res) {
        expect(res.text).to.contain('Cookbook');
      })
      .expect(200, done);
  });
}); 

const userCredentials = {
  username: 'alice1',
  password: 'pass',
  firstname: 'Alice',
  lastname: 'Briggs'
}

describe('POST /register', function() {
  it('returns cookie', function(done) {
  request(app)
      .post('/register')
      .send(userCredentials)
      .set('Accept', 'application/json')
      .expect(function(res) {
        expect(res).to.containCookie({
          name: 'cookinguser'
        })
      })
      .expect(200, done);
  });
});

//login method data setup
const loginCredentials = {
    email: 'sponge@bob.com', 
    password: 'garyTheSnail'
  }

  describe('POST /login', function(){
    it('if login successful, returns a cookie and redirects to "/"', function(done){
      request(app)
      .post('/login')
      .send(loginCredentials)
      .set('Accept', 'application/json')
      .expect(function(res) {
        expect(res).to.containCookie({
          name: 'cookinguser'
        })
      }).expect('Location', '/')
      .expect(302, done);
    })
  });

  describe('Non logged in user accessing /recipestore', function(done) {
    it('should return a 302 response and redirect to /login', function(done){
        request(app).get('/recipestore')
        .expect('Location', '/login')
        .expect(302, done);
      });
  })

  describe('GET /recipestore', function(done) {
    var authenticatedUser = request.agent(app);

    before(function(done){
        authenticatedUser
          .post('/login')
          .send(loginCredentials)
          .expect('location', '/')
          .expect(302, done);
    });
    it('returns a 200 code if the user is logged in', function(done) {
        authenticatedUser.get('/recipestore').expect(200, done);
    });
  })
