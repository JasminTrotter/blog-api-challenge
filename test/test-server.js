const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('BlogPosts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
  	return chai.request(app)
  		.get('/blog-posts')
  		.then(function(res) {
  			expect(res).to.have.status(200);
        	expect(res).to.be.json;
        	expect(res.body).to.be.a('array');

        	// each item should be an object with key/value pairs
        	// for `title`, `content`, `author` and `publishDate`.
        	const expectedKeys = ['title', 'content', 'author', 'publishDate'];
        	res.body.forEach(function(item) {
          		expect(item).to.be.a('object');
          		expect(item).to.include.keys(expectedKeys);
        	});
    	});
  });

  it('should create blog post on POST', function() {
    const newPost = {title: 'lorem ipusm', content: 'lorem ipsum is life, yo.', author: 'web dev', publishDate: 'september 15'};
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
    });
  });

  it('should delete post on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('should update item on PUT', function() {

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        const updateData = {
          title: 'updated post title',
          content: 'this is the updated content of the post I am updating'
        };
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
          expect(res).to.have.status(204);

    });
  });

});

