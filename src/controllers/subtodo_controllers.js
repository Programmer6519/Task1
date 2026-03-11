import { SubTodo } from "../models/subTodo_models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createSubTodo = asyncHandler(async (req, res) => {
  const { title, content, maintodoid } = req.body;
  if (!title || !content || !maintodoid) {
    throw new ApiError(400, "All fields are required");
  }

  const subTodo = await SubTodo.create({
    title,
    content,
    maintodoid,
  });

  res.status(200).json({ message: "subTodo created successfully", subTodo });
});

export const getSubTodo = asyncHandler(async (req, res) => {
  const { maintodoid, subtodoid } = req.body;
  const totalSubtodosCount = await SubTodo.countDocuments({});
  const completedSubtodos = await SubTodo.countDocuments({
    status: "Completed",
  });
  const pendingSubtodos = await SubTodo.countDocuments({ status: "Pending" });
  const inProgressSubtodos = await SubTodo.countDocuments({
    status: "InProgress",
  });

  if (maintodoid && subtodoid) {
    throw new ApiError(400, "Only one id is required");
  }

  if (maintodoid) {
    const subTodos = await SubTodo.find({ maintodoid });
    if (!subTodos[0]) {
      throw new ApiError(400, "Invalid maintodo id");
    }
    res.status(200).json({ subTodos });
  } else if (subtodoid) {
    const subTodo = await SubTodo.find({ _id: subtodoid });

    if (!subTodo) {
      throw new ApiError(400, "Invalid subtodo id");
    }
    res.status(200).json({
      subTodo,
      totalSubtodosCount,
      completedSubtodos,
      pendingSubtodos,
      inProgressSubtodos,
    });
  } else {
    throw new ApiError(400, "id is required");
  }
});

export const updateSubTodo = asyncHandler(async (req, res) => {
  const { title, content, status, subtodoid } = req.body;

  if (!subtodoid) {
    throw new ApiError(400, "subTodo Id is required");
  }

  const subTodo = await SubTodo.find({
    _id: subtodoid,
  });
  if (!subTodo[0]) {
    throw new ApiError(401, "Id is invalid");
  }

  subTodo[0].content = content;
  subTodo[0].title = title;
  subTodo[0].status = status;
  await subTodo[0].save();
  res.status(200).json({ subTodo });
});

export const deleteSubTodo = asyncHandler(async (req, res) => {
  const { subtodoid } = req.body;

  const subTodo = await SubTodo.find({
    _id: subtodoid,
  });
  if (!subTodo[0]) {
    throw new ApiError(404, "Not Found");
  }

  await SubTodo.deleteOne({ _id: subtodoid });
  res.status(200).json({ message: "subtodo deleted successfully" });
});
