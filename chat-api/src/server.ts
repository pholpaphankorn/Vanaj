import express, { Application } from "express";
import router from './api/routes';
import dotenv from 'dotenv';
import cors from 'cors';


const server: Application = express();
server.use(cors({
    origin: true,
    credentials: true,
}));

dotenv.config();
server.set('port', process.env.PORT || 8080);
server.use(express.json());
server.use('/api', router);

server.listen(server.get('port'), () => {
    console.log(`Server running on port ${server.get('port')}`);
});
