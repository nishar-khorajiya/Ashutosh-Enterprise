import bcrypt from 'bcrypt';

 export const hashpassword=async(password)=>{
    try{
        const saltRounds=10;
        const hashedPassword=await bcrypt.hash(password,saltRounds);
        return hashedPassword
    }
    catch(error){
        console.log(error);
    }
};

 export const comparePassword=async (password,hashpassword)=>{
    return bcrypt.compare(password,hashpassword);
}

// module.exports={hashpassword,comparePassword};