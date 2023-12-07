import { Router } from 'express';
import { chatController } from '../controllers/chat';

const router = Router();

router.post('/chat', chatController.talkToVanaj);
router.get('/chat', (req, res) => {
    res.send('hello world')
  });


export default router;