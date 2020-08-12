import { Request, Response, Router } from 'express'; 
import User from './user';

const routes = Router();

// routes
routes.get('/', (req:Request, res:Response) => {

    return res.status(200).json({ message: 'HELLO WORLD' });
    
});

routes.get('/users', async (req:Request, res:Response) => {

    try {

        const users = await User.find();
        if (users) {
            return res.status(200).json({ users });
        }

        return res.status( 404 ).json({ message: 'No users' });


    } catch (err) {
        res.status(500).json({ message: 'Error of server' });
    }

});

routes.get('/user/:id', async (req:Request, res:Response) => {
    const { id } = req.params;

    try {
            const user = await User.findById( id );
            if (user) {
                    return res.status(200).json( user );
            }
            
            return res.status( 404 ).json({ message: 'This user does not exist' });

    } catch (err) {
        if ( err.message.includes( 'Cast to ObjectId failed' ) ) {
                return res.status(400).json({ message: 'Error, id of user invalid' });
        }
        
        return res.status(500).json({ message: err });
    }

});

routes.post('/create-user', async (req:Request, res:Response) => {

    const { name, email } = req.body;

    const user = new User({
        name,
        email
    });

    try {

        const userCreate = await user.save();

        if (userCreate) {
            return res.status(201).json( userCreate );
        }

        return res.status(400).json({ message: 'Error of validation' })
        
    } catch (err) {
        res.status(500).json({ message: 'Error of server' });
    }

});


routes.put('/user', async (req: Request, res:Response) => {

    const { name, id } = req.body;

    try {
        
        const user = await User.findByIdAndUpdate( id, {name}, { runValidators: true, new: true } );
        if (user) {
                return res.status(201).json( { userUpdate: user } );
        }
    
        return res.status(403).json({ message: 'User not found' });
        
    } catch (err) {
        if ( err.message.includes( 'Cast to ObjectId failed' ) ) {
            return res.status(400).json({ message: 'Error, id of user invalid' });
        }
        return res.status(400).json({ message: err });
        
    }

});

routes.delete('/userId/:id', async (req: Request, res: Response) => {

    const id = req.params.id;

    try {
        const userDeleted = await User.findByIdAndDelete( id );
        if ( userDeleted ) {
                return res.status(200).json({ message: 'User deleted' });
        }

        return res.status(404).json({ message: 'User not found' });
        
    } catch (err) {
        if ( err.message.includes( 'Cast to ObjectId failed' ) ) {
            return res.status(400).json({ message: 'Error, id of user invalid' });
        }
        return res.status(500).json({ message: err });
    }
    
});

export default routes;