const Posts = require('../models/Posts');
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const posts = {
  async getPosts({ req, res }) {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
  },
  // 運用解構的手法就不用被參數順序困擾
  // 可以在三個參數以上時使用
  async createPosts({ body, req, res }) {
    try {
      const data = JSON.parse(body);
      if (data.content) {
        const newPost = await Posts.create({
          name: data.name,
          content: data.content,
          tags: data.tags,
          type: data.type,
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async deleteAllPosts({ req, res }) {
    const posts = await Posts.deleteMany({});
    handleSuccess(res, posts);
  },
  async deleteOnePost({ id, req, res }) {
    if (id) {
      const posts = await Posts.findByIdAndDelete(id);
      handleSuccess(res, posts);
    } else {
      handleError(res, err);
    }
  },
  async editOnePost({ id, body, req, res }) {
    console.log(id, body);
    console.log('body=>', body);
    try {
      const data = JSON.parse(body);
      console.log(data);
      const id = req.url.split('/').pop();
      if (data.content !== undefined) {
        const editContent = {
          content: data.content,
        };
        const editPost = await Posts.findByIdAndUpdate(id, editContent);
        handleSuccess(res, editPost);
      } else {
        handleError(res, err);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
};

module.exports = posts;
