import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const getFilePath = () => path.join(process.cwd(), "cms-backend", "data", "categories.json");

function readCategories() {
  try {
    const filePath = getFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading categories database:", error);
    return [];
  }
}

function writeCategories(data: any[]) {
  try {
    const filePath = getFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing categories database:", error);
    return false;
  }
}

export async function GET() {
  const categories = readCategories();
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const categories = readCategories();
    const slug = body.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    if (categories.some((c: any) => c.slug === slug)) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: body.name,
      slug,
    };

    categories.push(newCategory);
    writeCategories(categories);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Category slug is required" }, { status: 400 });
  }

  const categories = readCategories();
  const filtered = categories.filter((c: any) => c.slug !== slug);

  if (categories.length === filtered.length) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  writeCategories(filtered);
  return NextResponse.json({ success: true, message: `Category ${slug} deleted` });
}
