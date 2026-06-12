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
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing products database:", error);
    return false;
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const products = readProducts();
    const filtered = products.filter((p: any) => p.id !== id);

    if (products.length === filtered.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    writeProducts(filtered);
    return NextResponse.json({ success: true, message: `Product ${id} deleted` });
  } catch (error) {
    return NextResponse.json({ error: "Server error during product deletion" }, { status: 500 });
  }
}
