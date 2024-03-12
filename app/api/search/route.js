import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const query = request.nextUrl.searchParams.get("query");
  const uri =
    "mongodb+srv://Rudransh:A9aD7Dku8RwNIzyU@projectcluster.n11ooes.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");

    const products = await inventory
      .aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } }, // Case-insensitive partial or full match in name
            ],
          },
        },
      ])
      .toArray();

    return NextResponse.json({ success: true, products });
  } finally {
    await client.close();
  }
}
