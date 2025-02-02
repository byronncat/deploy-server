import express from 'express';
import { postController } from '@controllers';
const router = express.Router();

router.get('/comment/:postId', postController.getComments);
router.get('/user/:username', postController.getByUsername);
router.get('/', postController.get);
router.post('/like', postController.like);
router.post('/unlike', postController.unlike);
router.post('/comment', postController.comment);
router.post('/', postController.create);
router.put('/', postController.update);
router.delete('/:postId/comments/:commentId', postController.deleteComment);
router.delete('/:postId', postController.delete);

export default router;
