import { Schema, mongoose } from "mongoose";
import { SubTodo } from "./subTodo_models.js";

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      Enum: ["completed", "pending", "inProgress"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const MainTodo = mongoose.model("MainTodo", mainTodoSchema);
