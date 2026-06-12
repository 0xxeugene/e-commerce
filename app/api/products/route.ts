import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "cms-backend", "data", "products.json");

function readProducts() {
  try {
    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading products database:", error);
    return [];
  }
}

function writeProducts(data: any[]) {
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing products database:", error);
    return false;
  }
}

export async function GET() {
  const products = readProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields (name, price, category)" },
        { status: 400 }
      );
    }

    const products = readProducts();
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name,
      price: parseFloat(body.price),
      description: body.description || "",
      category: body.category,
      image: body.image || "/images/default-drug.jpg",
      stock: parseInt(body.stock) || 100,
      rating: 5.0,
      reviewsCount: 0,
    };

    products.push(newProduct);
    writeProducts(products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  }
}
