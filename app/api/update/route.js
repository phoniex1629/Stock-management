import { MongoClient } from "mongodb";

import { NextResponse } from "next/server";

export async function POST(request) {
  let { editId,newSlug, newQuantity, newPrice } = await request.json();
  const uri =
    "mongodb+srv://Rudransh:A9aD7Dku8RwNIzyU@projectcluster.n11ooes.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("stock");
    const inventory = database.collection("inventory");
    const filter = { slug: editId };
  
    const updateDoc = {
      $set: {
        slug: newSlug,
        quantity: newQuantity,
        price: newPrice,
      },
    };
    const result = await inventory.update(filter, updateDoc,{});
    if (result.matchedCount && result.modifiedCount) {
        return NextResponse.json({
          success: true,
          message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to update document",
        });
      }
  } finally {
    await client.close();
  }
}
