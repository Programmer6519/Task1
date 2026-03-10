import { Schema, mongoose } from "mongoose";
import { SubTodo } from "./subTodo_models";

const mainTodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: false,
    },
    todos: [SubTodo],
  },
  { timestamps: true },
);

export const MainTodo = mongoose.model("MainTodo", mainTodoSchema);
