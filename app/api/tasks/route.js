// app/api/tasks/route.js
import redis from "@/lib/redis";
import { NextResponse } from "next/server";


export async function GET() {
  const tasks = (await redis.lrange("tasks", 0, -1)).map(JSON.parse);
  return NextResponse.json({ tasks });
}

export async function POST(req) {
  const { title, description } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const newTask = { title, description, completed: false };
  await redis.rpush("tasks", JSON.stringify(newTask));

  return NextResponse.json({ message: "Task added", task: newTask });
}

export async function DELETE(req) {
  const { title } = await req.json();
  const tasks = (await redis.lrange("tasks", 0, -1)).map(JSON.parse);
  const updatedTasks = tasks.filter((t) => t.title !== title);

  await redis.del("tasks");
  if (updatedTasks.length > 0)
    await redis.rpush("tasks", ...updatedTasks.map(JSON.stringify));

  return NextResponse.json({ message: "Task deleted" });
}

// ✅ NEW PUT route for editing
export async function PUT(req) {
  const { oldTitle, title, description } = await req.json();

  if (!oldTitle || !title) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const tasks = (await redis.lrange("tasks", 0, -1)).map(JSON.parse);
  const index = tasks.findIndex((t) => t.title === oldTitle);

  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  tasks[index] = { ...tasks[index], title, description };
  await redis.del("tasks");
  await redis.rpush("tasks", ...tasks.map(JSON.stringify));

  return NextResponse.json({ message: "Task updated", task: tasks[index] });
}
