import { Document, Model, Schema, model } from 'mongoose'; 

interface User extends Document {
    name: string;
    email: string;
    role: string;
};


const schemaUser = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        validate: {
            validator: (email: string) => {
                return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test( email )
            },
            message: 'Error el email es invalido'
        },
        unique: true
        
    },

    role: {
        type: String,
        enum: ['USER_ROLE', 'ADMIN_ROLE'],
        default: 'USER_ROLE'
    }
});


export default model<User>('user', schemaUser);



 