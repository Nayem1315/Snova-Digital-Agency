import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "./integrations/firebase/client";
import { products } from "./lib/mockData";

async function seedDatabase() {
  const productsCollection = collection(db, "products");
  const batch = writeBatch(db);

  products.forEach((product) => {
    const docRef = doc(productsCollection, product.id);
    batch.set(docRef, product);
  });

  try {
    await batch.commit();
    console.log("Database seeded successfully with mock products!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();
