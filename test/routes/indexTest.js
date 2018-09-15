var expect = require('chai').expect;
var app = require('../../app');
var request = require('supertest');


//login method data setup
const userCredentials = {
    email: 'sponge@bob.com', 
    password: 'garyTheSnail'
  }

  describe('GET /recipestore', function(done) {
    var authenticatedUser = request.agent(app);

    before(function(done){
        authenticatedUser
          .post('/login')
          .send(userCredentials)
          .expect('location', '/')
          .expect(302, done);
    });
    it('returns a 200 code if the user is logged in', function(done) {
        authenticatedUser.get('/recipestore').expect(200, done);
    });
  })
