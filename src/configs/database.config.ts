import {connect, ConnectOptions} from 'mongoose';

export const dbConnect = () => {
   connect(process.env.MONGO_URI!
      // lo comentado esta obsoleto
// , 
//     {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//    } as ConnectOptions
   ).then(
    () => console.log('conexión exitosa'),
    (error) => console.log(error)
   )
}