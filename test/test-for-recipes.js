const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('recipes', function(){

    before(function(){

    });

    after(function(){

    });

    it('should list out Recipes', function(){
        return chai.request(app)
        .get('/recipes')
        .then(function(result){
            result.should.have.status(200);
            result.should.be.json;
            result.body.should.be.a('array');

            result.body.length.should.be.at.least(1);
            const expectedKeys = ['id', 'name', 'ingredients'];

            result.body.forEach(function(eachItem){
                eachItem.should.be.a('object');
                eachItem.should.include.keys(expectedKeys)
            });
        });
    });

    it('should add an item on POST', function() {
        const newRecipe = {name: 'coffee', ingredients: ['ground coffee beans' ,'water']};
        return chai.request(app)
          .post('/recipes')
          .send(newRecipe)
          .then(function(result) {
            result.should.have.status(201);
            result.should.be.json;
            result.body.should.be.a('object');
            result.body.should.include.keys('id', 'name', 'ingredients');
            result.body.id.should.not.be.null;

            // response should be deep equal to `newItem` from above if we assign
            // `id` to it from `res.body.id`
            result.body.ingredients.should.be.a('array');
          });
      });

      it('should edit recipes on put', function(){
        const updateData = {
            name: 'spaghetti',
            ingredients: ['noodles', 'pasta sauce', 'cheese']
          };
      
          return chai.request(app)
            .get('/recipes')
            .then(function(result) {
              updateData.id = result.body[0].id;
              return chai.request(app)
                .put(`/recipes/${updateData.id}`)
                .send(updateData);
            })
            .then(function(result) {
              result.should.have.status(204);
            });
      });

      it('should delete recipes on DELETE', function(){
        return chai.request(app)
        .get('/recipes')
        .then(function(result) {
          return chai.request(app)
            .delete(`/recipes/${result.body[0].id}`);
        })
        .then(function(result) {
          result.should.have.status(204);
        });
      });
});





