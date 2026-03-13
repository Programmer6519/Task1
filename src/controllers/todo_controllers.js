import { MainTodo } from "../models/mainTodo_models.js";
import { SubTodo } from "../models/subTodo_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTodo = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  if (!title || !content) {
    throw new ApiError(400, "All fields are required");
  }

  const todo = await MainTodo.create({
    title: title,
    content: content,
    status,
    userId: req.decodeToken._id,
  });

  return res
    .json({ success: true, message: "todo created successfully", todo })
    .status(200);
});

export const getTodo = asyncHandler(async (req, res) => {
  const { mainTodoId, status } = req.body;
  const totalMaintodosCount = await MainTodo.countDocuments({
    userId: req.decodeToken._id,
  });
  const completedMaintodos = await MainTodo.countDocuments({
    status: "completed",
    userId: req.decodeToken._id,
  });
  const pendingMaintodos = await MainTodo.countDocuments({
    status: "pending",
    userId: req.decodeToken._id,
  });
  const inProgressMaintodos = await MainTodo.countDocuments({
    status: "inProgress",
    userId: req.decodeToken._id,
  });
  const query = { userId: req.decodeToken._id };
  if (mainTodoId) {
    query._id = mainTodoId;
  }
  if (status) {
    query.status = status;
  }
  const todo = await MainTodo.find(query);
  return res
    .json({
      todo,
      totalMaintodosCount,
      completedMaintodos,
      pendingMaintodos,
      inProgressMaintodos,
    })
    .status(200);
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { title, content, status, todoId } = req.body;

  if (!todoId) {
    throw new ApiError(400, "Todo Id is required");
  }

  const todo = await MainTodo.find({
    _id: todoId,
    userId: req.decodeToken._id,
  });
  if (!todo[0]) {
    throw new ApiError(401, "Id is invalid");
  }

  todo[0].content = content ? content : todo[0].content;
  todo[0].title = title ? title : todo[0].title;
  todo[0].status = status ? status : todo[0].status;
  await todo[0].save();
  return res
    .status(200)
    .json({ success: true, message: "Todo updated successfully", todo });
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.body;

  if (!todoId) {
    throw new ApiError(400, "Todo Id is required");
  }
  const todo = await MainTodo.find({
    _id: todoId,
    userId: req.decodeToken._id,
  });

  if (!todo[0]) {
    throw new ApiError(400, "Invalid Todo Id");
  }

  await todo[0].deleteOne();

  const subTodos = await SubTodo.find({ mainTodoId: todoId });
  for (let i = 0; i < subTodos.length; i++) {
    await SubTodo.deleteOne({ _id: subTodos[i]._id });
  }

  return res
    .status(200)
    .json({ success: true, message: "todo deleted successfully" });
});
