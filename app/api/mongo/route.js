import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request){
    const uri = "mongodb+srv://Rudransh:A9aD7Dku8RwNIzyU@projectcluster.n11ooes.mongodb.net/";
    const client = new MongoClient(uri);
    
    try {
        await client.connect(); // Connect to the MongoDB server
        
        const database = client.db('sample_supplies');
        const movies = database.collection('sales');
        
        const query = {  };
        const movie = await movies.find(query).toArray();
        
        console.log(movie);
        return NextResponse.json({ "a": 34, movie });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error("Internal Server Error");
    } finally {
        await client.close();
    }
}
