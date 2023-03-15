const HttpControllers = require('../controllers/http');
const PostControllers = require('../controllers/posts');

const routes = async (req, res) => {
  const { url, method } = req;

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  if (url === '/posts' && method === 'GET') {
    PostControllers.getPosts({ res });
  } else if (url === '/posts' && method === 'POST') {
    req.on('end', () => {
      PostControllers.createPosts({ body, req, res });
    });
  } else if (url === '/posts' && method === 'DELETE') {
    PostControllers.deleteAllPosts({ req, res });
  } else if (url.startsWith('/posts/') && method === 'DELETE') {
    const id = url.split('/').pop();
    PostControllers.deleteOnePost({ id, req, res });
  } else if (url.startsWith('/posts/') && method === 'PATCH') {
    const id = url.split('/').pop();
    req.on('end', () => {
      PostControllers.editOnePost({ id, body, req, res });
    });
  } else if (method === 'OPTIONS') {
    HttpControllers.cors(req, res);
  } else {
    HttpControllers.notFound(req, res);
  }
};

module.exports = routes;
