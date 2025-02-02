import express from 'express';
import { userController } from '../controllers';
const router = express.Router();

router.get('/search/:text', userController.search);
router.get('/:username', userController.get);
router.put('/avatar', userController.changeAvatar);
router.put('/follow', userController.follow);
router.put('/unfollow', userController.unfollow);
router.delete('/avatar', userController.removeAvatar);

export default router;
